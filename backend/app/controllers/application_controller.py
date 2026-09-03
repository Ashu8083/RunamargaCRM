# backend/app/controllers/application_controller.py
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication, LoanStatus
from app.models.reverted_loans import RevertedLoan
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

    return {
        "success": True,
        "count": len(applications),
        "data": [
    {
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
        "rejection_date": application.rejection_date,
        "rejected_remarks": application.rejected_remarks,
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

        "status": application.status,
        "applied_date": application.applied_date,
        "sanction_date": application.sanction_date,
        "rejection_date": application.rejection_date,
        "loggedin_date": application.loggedin_date,
        "docspending_date": application.docspending_date,
        "reverted_status": application.reverted_status,

        "state_id": application.state_id,
        "city_id": application.city_id,
        "language_id": application.language_id,
        "ivr_id": application.ivr_id,

        "created_at": application.created_at,
        "updated_at": application.updated_at,
    }
    for application in applications
],
    }
def view_application(
    db: Session,
    employee: Employee,
    application_id: int,
):
    application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.id == application_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        return None

    # Check whether the logged-in employee is allowed
    # to access this particular application.
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

        "status": application.status,
        "applied_date": application.applied_date,
        "sanction_date": application.sanction_date,
        "rejection_date": application.rejection_date,
        "loggedin_date": application.loggedin_date,
        "docspending_date": application.docspending_date,
        "reverted_status": application.reverted_status,
        "rejection_date": application.rejection_date,
        "rejected_remarks": application.rejected_remarks,
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
def update_application_loan_type(
    db: Session,
    employee: Employee,
    application_id: int,
    loan_type_id: int,
):
    application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.id == application_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        return None

    # Check RBAC access to this application.
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
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to update this application",
        )

    # Make sure the loan type exists.
    from app.models.loan_types import LoanType

    loan_type = (
        db.query(LoanType)
        .filter(
            LoanType.id == loan_type_id,
            LoanType.deleted_at.is_(None),
        )
        .first()
    )

    if not loan_type:
        raise HTTPException(
            status_code=404,
            detail="Loan type not found",
        )

    application.loan_type_id = loan_type_id

    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "message": "Loan type updated successfully",
        "data": {
            "id": application.id,
            "loan_type_id": application.loan_type_id,
            "updated_at": application.updated_at,
        },
    }
def update_application_status(
    db: Session,
    employee: Employee,
    application_id: int,
    status: str,
    rejected_remarks: str | None = None,
    revert_rejection_date: str | None = None,
):
    application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.id == application_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    # =========================================================
    # RBAC ACCESS
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
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to update this application",
        )

    # =========================================================
    # NORMALIZE STATUS
    # =========================================================

    normalized_status = (
        str(status)
        .strip()
        .lower()
        .replace("_", " ")
        .replace("-", " ")
    )

    # =========================================================
    # MAP UI STATUS → DATABASE STATUS
    # =========================================================

    status_mapping = {
        "inprocess": LoanStatus.inprocess,
        "in process": LoanStatus.inprocess,
        "in progress": LoanStatus.inprocess,
        "processing": LoanStatus.inprocess,

        "docs pending": LoanStatus.docspending,
        "docspending": LoanStatus.docspending,
        "documents pending": LoanStatus.docspending,
        "document pending": LoanStatus.docspending,

        "rejected": LoanStatus.rejected,
        "reject": LoanStatus.rejected,

        "revert rejected": LoanStatus.rejected,
        "reverted rejected": LoanStatus.rejected,
        "revert reject": LoanStatus.rejected,

        "sanctioned": LoanStatus.sanctioned,
        "sanction": LoanStatus.sanctioned,

        "disbursed": LoanStatus.disbursed,
        "disbursement": LoanStatus.disbursed,

        "login": LoanStatus.login,
    }

    database_status = status_mapping.get(
        normalized_status
    )

    if not database_status:
        raise HTTPException(
            status_code=400,
            detail="Invalid application status",
        )

    # =========================================================
    # VALIDATE REJECTION REMARKS
    # =========================================================

    is_rejected = normalized_status in {
        "rejected",
        "reject",
    }

    is_revert_rejected = normalized_status in {
        "revert rejected",
        "reverted rejected",
        "revert reject",
    }

    if is_rejected or is_revert_rejected:

        if not rejected_remarks or not rejected_remarks.strip():
            raise HTTPException(
                status_code=400,
                detail="Rejection remarks are required",
            )

    # =========================================================
    # UPDATE APPLICATION
    # =========================================================

    application.status = database_status

    # =========================================================
    # NORMAL REJECTION
    # =========================================================

    if is_rejected:

        application.rejection_date = datetime.utcnow().date()

        application.rejected_remarks = (
            rejected_remarks.strip()
        )

    # =========================================================
    # REVERT REJECTED
    # =========================================================

    elif is_revert_rejected:

        # The application remains REJECTED.
        application.status = LoanStatus.rejected

        # Store the reason on the application itself.
        application.rejected_remarks = (
            rejected_remarks.strip()
        )

        # -----------------------------------------------------
        # Determine revert date
        # -----------------------------------------------------

        reverted_at = None

        if revert_rejection_date:

            try:
                reverted_at = datetime.combine(
                    revert_rejection_date,
                    datetime.min.time(),
                )
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid revert rejection date",
                )

        else:
            reverted_at = datetime.utcnow()

        # -----------------------------------------------------
        # Employee role
        # -----------------------------------------------------

        role_name = None

        if employee.role:
            role_name = employee.role.name

        # -----------------------------------------------------
        # Create reverted loan record
        # -----------------------------------------------------

        reverted_loan = RevertedLoan(
            remarks=rejected_remarks.strip(),

            loan_id=application.id,

            reverted_by_id=employee.id,

            reverted_by_name=employee.name,

            rejection_type="revert_rejected",

            reverted_by_role=role_name or "",

            reverted_at=reverted_at,
        )

        db.add(reverted_loan)

    # =========================================================
    # CLEAR OLD REJECTION DATA WHEN MOVING AWAY
    # =========================================================

    elif database_status != LoanStatus.rejected:

        application.rejected_remarks = None

    # =========================================================
    # STATUS-SPECIFIC DATES
    # =========================================================

    today = datetime.utcnow().date()

    if database_status == LoanStatus.docspending:
        application.docspending_date = today

    elif database_status == LoanStatus.sanctioned:
        application.sanction_date = today

    elif database_status == LoanStatus.login:
        application.loggedin_date = today

    # =========================================================
    # SAVE
    # =========================================================

    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "message": "Application status updated successfully",
        "data": {
            "id": application.id,
            "status": application.status.value
                if application.status
                else None,
            "rejected_remarks": application.rejected_remarks,
            "rejection_date": application.rejection_date,
            "docspending_date": application.docspending_date,
            "sanction_date": application.sanction_date,
            "loggedin_date": application.loggedin_date,
            "updated_at": application.updated_at,
        },
    }