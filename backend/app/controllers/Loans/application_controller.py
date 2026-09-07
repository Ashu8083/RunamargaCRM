from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import HTTPException
from datetime import datetime,date

from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication, LoanStatus
from app.models.reverted_loans import RevertedLoan


# =============================================================
# GET APPLICATIONS
# =============================================================

def get_applications(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
):
    query = db.query(LoanApplication)

    query = AccessControl.apply_application_scope(
        query=query,
        db=db,
        employee=employee,
        context_id=context_id,
    )

    applications = (
        query
        .order_by(LoanApplication.id.desc())
        .all()
    )

    data = []

    for application in applications:

        # =====================================================
        # LATEST ACTIVE REVERT RECORD
        # =====================================================

        latest_revert = (
            db.query(RevertedLoan)
            .filter(
                RevertedLoan.loan_id == application.id,
                RevertedLoan.deleted_at.is_(None),
            )
            .order_by(
                RevertedLoan.reverted_at.desc(),
                RevertedLoan.id.desc(),
            )
            .first()
        )

        data.append({
            "id": application.id,
            "unique_id": application.unique_id,

            "name": application.name,
            "email": application.email,
            "phone": application.phone,
            "gender": application.gender,
            "alternate_phone": application.alternate_phone,
            "alternate_email": application.alternate_email,
            "marital_status": application.marital_status,
            "dob": application.dob,

            "loan_type_id": application.loan_type_id,
            "loan_amt": application.loan_amt,
            "loan_tenure": application.loan_tenure,
            "loan_purpose": application.loan_purpose,
            "credit_score": application.credit_score,
            "referral": application.referral,

            # =================================================
            # NORMAL REJECTION DETAILS
            # =================================================

            "rejection_date": application.rejection_date,
            "rejected_remarks": application.rejected_remarks,

            # =================================================
            # ASSIGNMENTS
            # =================================================

            "applied_by_id": application.applied_by_id,
            "agent_id": application.agent_id,
            "rm_id": application.rm_id,

            "applied_by": (
                {
                    "id": application.applied_by.id,
                    "name": application.applied_by.name,
                }
                if application.applied_by
                else None
            ),

            "agent": (
                {
                    "id": application.agent.id,
                    "name": application.agent.name,
                }
                if application.agent
                else None
            ),

            "rm": (
                {
                    "id": application.rm.id,
                    "name": application.rm.name,
                }
                if application.rm
                else None
            ),

            # =================================================
            # STATUS
            # =================================================

            "status": application.status,

            "applied_date": application.applied_date,
            "sanction_date": application.sanction_date,
            "loggedin_date": application.loggedin_date,
            "docspending_date": application.docspending_date,

            # =================================================
            # REVERT STATUS
            # =================================================

            "reverted_status": application.reverted_status,

            # =================================================
            # REVERT REJECTION DETAILS
            # =================================================

            "reverted_reason": (
                latest_revert.remarks
                if latest_revert
                else None
            ),

            "reverted_date": (
                latest_revert.reverted_at
                if latest_revert
                else None
            ),

            "reverted_by_name": (
                latest_revert.reverted_by_name
                if latest_revert
                else None
            ),

            "reverted_by_role": (
                latest_revert.reverted_by_role
                if latest_revert
                else None
            ),

            "state_id": application.state_id,
            "city_id": application.city_id,
            "language_id": application.language_id,
            "ivr_id": application.ivr_id,

            "created_at": application.created_at,
            "updated_at": application.updated_at,
        })

    return {
        "success": True,
        "count": len(data),
        "data": data,
    }


# =============================================================
# VIEW APPLICATION
# =============================================================

def view_application(
    db: Session,
    employee: Employee,
    application_id: str,
):
    application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.unique_id == application_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        return None

    # =========================================================
    # RBAC
    # =========================================================

    scoped_query = AccessControl.apply_application_scope(
        query=db.query(LoanApplication),
        db=db,
        employee=employee,
    )

    allowed_application = (
        scoped_query
        .filter(
            LoanApplication.id == application_id
        )
        .first()
    )

    if not allowed_application:
        return None

    # =========================================================
    # LATEST ACTIVE REVERT
    # =========================================================

    latest_revert = (
        db.query(RevertedLoan)
        .filter(
            RevertedLoan.loan_id == application.id,
            RevertedLoan.deleted_at.is_(None),
        )
        .order_by(
            RevertedLoan.reverted_at.desc(),
            RevertedLoan.id.desc(),
        )
        .first()
    )

    return {
        "id": application.id,
        "unique_id": application.unique_id,

        "name": application.name,
        "email": application.email,
        "phone": application.phone,
        "gender": application.gender,
        "alternate_phone": application.alternate_phone,
        "alternate_email": application.alternate_email,
        "marital_status": application.marital_status,
        "dob": application.dob,

        "pancard_no": application.pancard_no,
        "aadhar_no": application.aadhar_no,
        "bank_acc_no": application.bank_acc_no,
        "ifsc_code": application.ifsc_code,

        "loan_type_id": application.loan_type_id,
        "loan_amt": application.loan_amt,
        "loan_tenure": application.loan_tenure,
        "loan_purpose": application.loan_purpose,
        "credit_score": application.credit_score,
        "referral": application.referral,

        "applied_by_id": application.applied_by_id,
        "agent_id": application.agent_id,
        "rm_id": application.rm_id,

        # =====================================================
        # STATUS
        # =====================================================

        "status": application.status,

        "applied_date": application.applied_date,
        "sanction_date": application.sanction_date,
        "rejection_date": application.rejection_date,
        "loggedin_date": application.loggedin_date,
        "docspending_date": application.docspending_date,

        "reverted_status": application.reverted_status,

        # =====================================================
        # NORMAL REJECTION
        # =====================================================

        "rejected_remarks": application.rejected_remarks,

        # =====================================================
        # REVERT REJECTION
        # =====================================================

        "reverted_reason": (
            latest_revert.remarks
            if latest_revert
            else None
        ),

        "reverted_date": (
            latest_revert.reverted_at
            if latest_revert
            else None
        ),

        "reverted_by_name": (
            latest_revert.reverted_by_name
            if latest_revert
            else None
        ),

        "reverted_by_role": (
            latest_revert.reverted_by_role
            if latest_revert
            else None
        ),

        "state_id": application.state_id,
        "city_id": application.city_id,
        "language_id": application.language_id,
        "ivr_id": application.ivr_id,

        "created_at": application.created_at,
        "updated_at": application.updated_at,

        "agent": (
            {
                "id": application.agent.id,
                "name": application.agent.name,
            }
            if application.agent
            else None
        ),

        "rm": (
            {
                "id": application.rm.id,
                "name": application.rm.name,
            }
            if application.rm
            else None
        ),

        "applied_by": (
            {
                "id": application.applied_by.id,
                "name": application.applied_by.name,
            }
            if application.applied_by
            else None
        ),

        # These models don't exist yet.
        "addresses": [],
        "references": [],
        "documents": [],
        "co_applicants": [],
        "bank_processing": [],
    }

def create_application(
    db: Session,
    employee: Employee,
    payload,
):

    # =========================================================
    # VALIDATE RM IF PROVIDED
    # =========================================================

    if payload.rm_id is not None:

        rm = (
            db.query(Employee)
            .filter(
                Employee.id == payload.rm_id,
                Employee.status == "active",
                Employee.deleted_at.is_(None),
            )
            .first()
        )

        if not rm:
            raise HTTPException(
                status_code=404,
                detail="Relationship Manager not found",
            )

    # =========================================================
    # CHECK EXISTING APPLICATION BY PHONE
    # =========================================================

    existing_application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.phone == payload.phone,
            LoanApplication.deleted_at.is_(None),
        )
        .order_by(
            LoanApplication.id.desc()
        )
        .first()
    )

    # ===========================================================
    # EXISTING APPLICATION
    # ===========================================================

    existing_application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.phone == payload.phone,
            LoanApplication.deleted_at.is_(None),
        )
        .order_by(
            LoanApplication.id.desc()
        )
        .first()
    )

    if existing_application:

        # -------------------------------------------------------
        # APPLIED BY
        # -------------------------------------------------------

        applied_by = None

        if existing_application.applied_by_id:

            applied_by = (
                db.query(Employee)
                .filter(
                    Employee.id ==
                    existing_application.applied_by_id
                )
                .first()
            )


        # -------------------------------------------------------
        # RM
        # -------------------------------------------------------

        rm = None

        if existing_application.rm_id:

            rm = (
                db.query(Employee)
                .filter(
                    Employee.id ==
                    existing_application.rm_id
                )
                .first()
            )


        # -------------------------------------------------------
        # AGENT
        # -------------------------------------------------------

        agent = None

        agent_id = getattr(
            existing_application,
            "agent_id",
            None,
        )

        if agent_id:

            agent = (
                db.query(Employee)
                .filter(
                    Employee.id == agent_id
                )
                .first()
            )


        # -------------------------------------------------------
        # RETURN EXISTING APPLICATION
        # -------------------------------------------------------

        return {

            "success": True,

            "existing_loan": True,

            "message":
                "An existing application was found for this phone number.",

            "data": {

                "application_id":
                    existing_application.id,

                "name":
                    existing_application.name,

                "phone":
                    existing_application.phone,

                "loan_type_id":
                    existing_application.loan_type_id,

                "loan_amount":
                    existing_application.loan_amt,

                "credit_score":
                    existing_application.credit_score,

                "loan_purpose":
                    existing_application.loan_purpose,

                "reference_name":
                    existing_application.referral,

                "status":
                    (
                        existing_application.status.value
                        if existing_application.status
                        else None
                    ),

                "applied_date":
                    (
                        existing_application.applied_date
                        or (
                            existing_application.created_at.date()
                            if existing_application.created_at
                            else None
                        )
                    ),

                # ------------------------------------------------
                # APPLIED BY
                # ------------------------------------------------

                "applied_by_id":
                    existing_application.applied_by_id,

                "applied_by_name":
                    (
                        applied_by.name
                        if applied_by
                        else None
                    ),

                # ------------------------------------------------
                # RM
                # ------------------------------------------------

                "rm_id":
                    existing_application.rm_id,

                "rm_name":
                    (
                        rm.name
                        if rm
                        else None
                    ),

                # ------------------------------------------------
                # AGENT
                # ------------------------------------------------

                "agent_id":
                    agent_id,

                "agent_name":
                    (
                        agent.name
                        if agent
                        else None
                    ),
            },
        }
    # =========================================================
    # CREATE NEW APPLICATION
    # =========================================================

    application = LoanApplication(
        name=payload.name,
        phone=payload.phone,
        gender=payload.gender,
        loan_type_id=payload.loan_type_id,
        loan_amt=payload.loan_amount,
        credit_score=payload.credit_score,
        loan_purpose=payload.loan_purpose,
        referral=payload.reference_name,
        rm_id=payload.rm_id,
        state_id=payload.state_id,
        city_id=payload.city_id,
        applied_by_id=employee.id,
        status=LoanStatus.inprocess,
        applied_date=date.today(),
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "existing_loan": False,
        "message": "Loan application created successfully.",
        "data": {
            "id": application.id,
            "status": application.status.value,
        },
    }
