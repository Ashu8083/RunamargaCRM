from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import HTTPException
from datetime import datetime

from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication, LoanStatus
from app.models.loan_coapplicant import LoanCoApplicant
from app.models.reverted_loans import RevertedLoan
from app.models.loan_reference import LoanReference
from app.schemas.application_schema import (
   ApplicationHeaderUpdate,ApplicationLoanDetailsUpdate,AddApplicationAddressRequest,AddApplicationReferenceRequest,AddApplicationCoApplicantRequest
)
from app.models.loan_addresses import LoanAddress

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


def update_application_header(
    db: Session,
    employee: Employee,
    application_id: str,
    payload: ApplicationHeaderUpdate,
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
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    if payload.name is not None:
        application.name = payload.name

    if payload.phone is not None:
        application.phone = payload.phone

    if payload.referral is not None:
        application.referral = payload.referral

    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "message": "Application header updated successfully",
        "data": {
            "id": application.id,
            "unique_id": application.unique_id,
            "name": application.name,
            "phone": application.phone,
            "referral": application.referral,
        },
    }


def update_application_loan_details(
    db: Session,
    employee: Employee,
    application_id: str,
    payload: ApplicationLoanDetailsUpdate,
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
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    if payload.email is not None:
        application.email = payload.email

    if payload.gender is not None:
        application.gender = payload.gender

    if payload.marital_status is not None:
        application.marital_status = payload.marital_status

    if payload.date_of_birth is not None:
        application.dob = payload.date_of_birth

    if payload.pan_number is not None:
        application.pancard_no = payload.pan_number

    if payload.aadhaar_number is not None:
        application.aadhar_no = payload.aadhaar_number

    if payload.loan_amount is not None:
        application.loan_amt = payload.loan_amount

    if payload.loan_tenure is not None:
        application.loan_tenure = payload.loan_tenure

    if payload.bank_account_number is not None:
        application.bank_acc_no = payload.bank_account_number

    if payload.ifsc_code is not None:
        application.ifsc_code = payload.ifsc_code

    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "message": "Loan details updated successfully",
        "data": {
            "id": application.id,
            "unique_id": application.unique_id,
            "email": application.email,
            "gender": application.gender,
            "marital_status": application.marital_status,
            "dob": application.dob,
            "pancard_no": application.pancard_no,
            "aadhar_no": application.aadhar_no,
            "loan_amt": application.loan_amt,
            "loan_tenure": application.loan_tenure,
            "bank_acc_no": application.bank_acc_no,
            "ifsc_code": application.ifsc_code,
        },
    }


def add_application_address(
    db: Session,
    employee: Employee,
    application_id: str,
    payload: AddApplicationAddressRequest,
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
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

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
            LoanApplication.id == application.id
        )
        .first()
    )

    if not allowed_application:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this application",
        )

    # =========================================================
    # CREATE ADDRESS
    # =========================================================

    address = LoanAddress(
        loan_id=application.id,
        address=payload.address,
        address_type=payload.address_type,
    )

    db.add(address)
    db.commit()
    db.refresh(address)

    return {
        "success": True,
        "message": "Address added successfully",
        "data": {
            "id": address.id,
            "loan_id": address.loan_id,
            "address": address.address,
            "address_type": address.address_type,
            "created_at": address.created_at,
        },
    }


def add_application_reference(
    db: Session,
    employee: Employee,
    application_id: str,
    payload: AddApplicationReferenceRequest,
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
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    # RBAC
    scoped_query = AccessControl.apply_application_scope(
        query=db.query(LoanApplication),
        db=db,
        employee=employee,
    )

    allowed_application = (
        scoped_query
        .filter(
            LoanApplication.id == application.id
        )
        .first()
    )

    if not allowed_application:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this application",
        )

    # CREATE REFERENCE
    reference = LoanReference(
        loan_id=application.id,
        name=payload.name,
        phone=payload.phone,
        relation=payload.relation,
        address=payload.address,
    )

    db.add(reference)
    db.commit()
    db.refresh(reference)

    return {
        "success": True,
        "message": "Reference added successfully",
        "data": {
            "id": reference.id,
            "loan_id": reference.loan_id,
            "name": reference.name,
            "phone": reference.phone,
            "relation": reference.relation,
            "address": reference.address,
            "created_at": reference.created_at,
        },
    }


def add_application_co_applicant(
    db: Session,
    employee: Employee,
    application_id: str,
    payload: AddApplicationCoApplicantRequest,
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
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    # RBAC
    scoped_query = AccessControl.apply_application_scope(
        query=db.query(LoanApplication),
        db=db,
        employee=employee,
    )

    allowed_application = (
        scoped_query
        .filter(
            LoanApplication.id == application.id
        )
        .first()
    )

    if not allowed_application:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this application",
        )

    # CREATE CO-APPLICANT
    co_applicant = LoanCoApplicant(
        loan_id=application.id,
        name=payload.name,
        phone=payload.phone,
        pancard_no=payload.pan_number,
        adharr_no=payload.aadhaar_number,
    )

    db.add(co_applicant)
    db.commit()
    db.refresh(co_applicant)

    return {
        "success": True,
        "message": "Co-applicant added successfully",
        "data": {
            "id": co_applicant.id,
            "loan_id": co_applicant.loan_id,
            "name": co_applicant.name,
            "phone": co_applicant.phone,
            "pan_number": co_applicant.pancard_no,
            "aadhaar_number": co_applicant.adharr_no,
            "created_at": co_applicant.created_at,
        },
    }