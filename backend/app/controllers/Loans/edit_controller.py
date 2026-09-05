from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication
from app.models.loan_applications import LoanStatus

from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.models.loan_applications import LoanApplication
from app.models.loan_applications import LoanStatus



# =============================================================
# UPDATE LOAN TYPE
# =============================================================

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
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to update this application",
        )

    # =========================================================
    # LOAN TYPE
    # =========================================================

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


# =============================================================
# UPDATE APPLICATION STATUS
# =============================================================

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
    # STATUS MAPPING
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
    # FLAGS
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

    # =========================================================
    # VALIDATE REJECTION REMARKS
    # =========================================================

    if is_rejected or is_revert_rejected:

        if (
            not rejected_remarks
            or not rejected_remarks.strip()
        ):
            raise HTTPException(
                status_code=400,
                detail="Rejection remarks are required",
            )

    # =========================================================
    # UPDATE STATUS
    # =========================================================

    application.status = database_status

    # =========================================================
    # NORMAL REJECTION
    # =========================================================

    if is_rejected:

        application.rejection_date = (
            datetime.utcnow().date()
        )

        application.rejected_remarks = (
            rejected_remarks.strip()
        )

        # This is a normal rejection.
        application.reverted_status = None

    # =========================================================
    # REVERT REJECTED
    # =========================================================

    elif is_revert_rejected:

        # IMPORTANT:
        # Database status remains REJECTED.
        application.status = LoanStatus.rejected

        # Mark this application as reverted-rejected.
        application.reverted_status = (
            "revert_rejected"
        )

        # Store reason on application.
        application.rejected_remarks = (
            rejected_remarks.strip()
        )

        # -----------------------------------------------------
        # Determine revert date
        # -----------------------------------------------------

        reverted_at = None

        if revert_rejection_date:

            try:

                if isinstance(
                    revert_rejection_date,
                    datetime,
                ):
                    reverted_at = (
                        revert_rejection_date
                    )

                else:
                    reverted_at = datetime.combine(
                        revert_rejection_date,
                        datetime.min.time(),
                    )

            except (ValueError, TypeError):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid revert rejection date",
                )

        else:
            reverted_at = datetime.utcnow()

        # -----------------------------------------------------
        # Employee role
        # -----------------------------------------------------

        role_name = ""

        if employee.role:
            role_name = employee.role.name or ""

        # -----------------------------------------------------
        # Create revert record
        # -----------------------------------------------------

        reverted_loan = RevertedLoan(
            remarks=rejected_remarks.strip(),

            loan_id=application.id,

            reverted_by_id=employee.id,

            reverted_by_name=employee.name,

            rejection_type="revert_rejected",

            reverted_by_role=role_name,

            reverted_at=reverted_at,
        )

        db.add(reverted_loan)

    # =========================================================
    # MOVING AWAY FROM REJECTION
    # =========================================================

    elif database_status != LoanStatus.rejected:

        application.rejected_remarks = None

        application.reverted_status = None

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

            "status": (
                application.status.value
                if application.status
                else None
            ),

            "reverted_status":
                application.reverted_status,

            "rejected_remarks":
                application.rejected_remarks,

            "rejection_date":
                application.rejection_date,

            "docspending_date":
                application.docspending_date,

            "sanction_date":
                application.sanction_date,

            "loggedin_date":
                application.loggedin_date,

            "updated_at":
                application.updated_at,
        },
    }