# backend\app\seeders\loan_type_seeder.py
from sqlalchemy import select

from app.config.database import SessionLocal
from app.models.loan_types import LoanType, LoanTypeStatus


LOAN_TYPES = [
    {
        "id": 1,
        "name": "Personal",
        "status": LoanTypeStatus.active,
    },
    {
        "id": 2,
        "name": "Business",
        "status": LoanTypeStatus.active,
    },
    {
        "id": 3,
        "name": "Home",
        "status": LoanTypeStatus.active,
    },
    {
        "id": 4,
        "name": "Loan Against Property",
        "status": LoanTypeStatus.active,
    },
    {
        "id": 5,
        "name": "Education",
        "status": LoanTypeStatus.active,
    },
    {
        "id": 6,
        "name": "Car",
        "status": LoanTypeStatus.active,
    },
    {
        "id": 7,
        "name": "Gold",
        "status": LoanTypeStatus.active,
    },
    {
        "id": 8,
        "name": "Credit Card",
        "status": LoanTypeStatus.active,
    },
    {
        "id": 9,
        "name": "Agricultural",
        "status": LoanTypeStatus.active,
    },
]


def seed_loan_types():
    db = SessionLocal()

    try:
        created_count = 0
        skipped_count = 0

        for loan_type_data in LOAN_TYPES:

            existing_loan_type = db.scalar(
                select(LoanType).where(
                    LoanType.id == loan_type_data["id"]
                )
            )

            if existing_loan_type:
                skipped_count += 1

                print(
                    f"[SKIP] Loan Type already exists: "
                    f"{existing_loan_type.id} - "
                    f"{existing_loan_type.name}"
                )

                continue

            loan_type = LoanType(
                id=loan_type_data["id"],
                name=loan_type_data["name"],
                status=loan_type_data["status"],
            )

            db.add(loan_type)

            created_count += 1

            print(
                f"[CREATE] {loan_type_data['id']} - "
                f"{loan_type_data['name']}"
            )

        db.commit()

        print()
        print("=" * 60)
        print("LOAN TYPE SEEDER COMPLETED")
        print("=" * 60)
        print(f"Created : {created_count}")
        print(f"Skipped : {skipped_count}")
        print("=" * 60)

    except Exception as e:
        db.rollback()

        print()
        print("=" * 60)
        print("LOAN TYPE SEEDER FAILED")
        print("=" * 60)
        print(f"Error: {e}")
        print("=" * 60)

        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_loan_types()