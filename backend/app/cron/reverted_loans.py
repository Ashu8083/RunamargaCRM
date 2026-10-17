from datetime import datetime

from app.core.database import SessionLocal, get_db_connection
from app.cron.assign_loans import get_eligible_agents
from app.models.loan_application import LoanApplication
from app.models.loan_type import LoanType
from app.models.reverted_loans import RevertedLoan
from sqlalchemy.orm import Session

ACCESS_KEY_MAP = {
    "Personal Loan": "PERSONAL_LOAN_ACCESS",
    "Business Loan": "BUSINESS_LOAN_ACCESS",
    "Home Loan": "HOME_LOAN_ACCESS",
    "Education Loan": "EDUCATION_LOAN_ACCESS",
    "Loan Against Property": "LAP_ACCESS",
    "Car Loan": "CAR_LOAN_ACCESS",
    "Gold Loan": "GOLD_LOAN_ACCESS",
    "Credit Card": "CREDIT_CARD_ACCESS",
}


def update_loan_status(db: Session):
    conn = None

    try:
        print("🔄 Reverted loan reassignment started")

        conn = get_db_connection()

        now = datetime.now()
        latest_revert_ids = (
             db.query(RevertedLoan.id)
             .filter(RevertedLoan.rejection_type == "revert")
             .order_by(
                 RevertedLoan.loan_id,
                 RevertedLoan.reverted_at.desc(),
                 RevertedLoan.id.desc(),
         )
         .distinct(RevertedLoan.loan_id)
         .subquery()
        )

        reverted_loans = (
             db.query(RevertedLoan)
             .filter(RevertedLoan.id.in_(latest_revert_ids))
             .filter(RevertedLoan.deleted_at.is_(None))
             .filter(RevertedLoan.reverted_at <= now)
             .order_by(RevertedLoan.id.asc())
             .all()
        )
       # reverted_loans = (
        #    db.query(RevertedLoan)
         #   .filter(RevertedLoan.reverted_at <= now)
          #  .filter(RevertedLoan.rejection_type == "revert")
           # .filter(RevertedLoan.deleted_at.is_(None))
           # .order_by(
            #    RevertedLoan.loan_id,
            #    RevertedLoan.reverted_at.desc(),
            #    RevertedLoan.id.desc(),
            #)
            #.distinct(RevertedLoan.loan_id)
            #.limit(10)
            #.all()
        #)
        print("######## NEW CRON VERSION ########")
        if not reverted_loans:
            print("✅ No reverted loans found.")
            return

        print(f"📋 Found {len(reverted_loans)} reverted loans")

        rr_index_map = {}

        for reverted_loan in reverted_loans:

            try:
                print(
                    f"\n================ LOAN {reverted_loan.loan_id} ================"
                )
                direct_exists = (
                    db.query(RevertedLoan)
                    .filter(
                        RevertedLoan.loan_id == reverted_loan.loan_id,
                        RevertedLoan.rejection_type == "direct",
                        RevertedLoan.deleted_at.is_(None),
                    )
                    .first()
                )

                if direct_exists:
                    print(
                        f"⏭ Loan {reverted_loan.loan_id} already has a DIRECT entry. Skipping."
                    )

                    reverted_loan.deleted_at = datetime.now()
                    continue
                loan = (
                    db.query(LoanApplication)
                    .filter(LoanApplication.id == reverted_loan.loan_id)
                    .first()
                )

                if not loan:
                    print(f"⚠️ Loan not found for reverted record {reverted_loan.id}")
                    continue
                if loan.status != "inprocess":
                    loan.agent_id = None
                    loan.status = "inprocess"
                    print(
                        f"⏭ Loan {loan.id} is not inprocess. "
                        f"Agent ID cleared and reverted record marked deleted."
                    )

                    reverted_loan.deleted_at = datetime.now()
                    continue
                loan_type = (
                    db.query(LoanType).filter(LoanType.id == loan.loan_type_id).first()
                )

                if not loan_type:
                    print(f"⚠️ Loan type not found for loan {loan.id}")
                    continue

                loan_type_name = loan_type.name.strip() if loan_type.name else ""

                print(f"📌 Loan Type = [{loan_type_name}]")

                access_key = ACCESS_KEY_MAP.get(loan_type_name)

                if not access_key:
                    print(f"⚠️ No access key mapping for loan type {loan_type_name}")
                    continue

                print(f"🔑 Access Key = {access_key}")

                agent_ids = get_eligible_agents(conn, access_key)

                print(f"👥 Eligible Agents = {agent_ids}")

                if not agent_ids:
                    print(f"⚠️ No eligible agents found for {loan_type_name}")
                    continue

                if loan_type_name not in rr_index_map:
                    rr_index_map[loan_type_name] = 0

                index = rr_index_map[loan_type_name]

                selected_agent = agent_ids[index % len(agent_ids)]

                print(f"🎯 Selected Agent Raw = {selected_agent}")

                if isinstance(selected_agent, dict):
                    new_agent_id = selected_agent.get("id")
                else:
                    new_agent_id = selected_agent

                print(f"✅ Final Agent ID = {new_agent_id}")

                rr_index_map[loan_type_name] += 1

                loan.agent_id = new_agent_id
                loan.status = "inprocess"

                # db.delete(reverted_loan)
                reverted_loan.deleted_at = datetime.now()
                print(f"✅ Loan {loan.id} reassigned to Agent {new_agent_id}")

            except Exception as loan_error:
                print(
                    f"❌ Error processing reverted loan "
                    f"{reverted_loan.loan_id}: {loan_error}"
                )

        db.commit()

        print("\n✅ Reverted loan reassignment completed.")

    except Exception as e:

        db.rollback()

        print(f"❌ Fatal Error: {str(e)}")

    finally:

        if conn:
            conn.close()


if __name__ == "__main__":

    print("🚀 Starting reverted loan cron...")

    db = SessionLocal()

    try:
        update_loan_status(db)

    finally:
        db.close()

    print("🏁 Reverted loan cron finished.")
