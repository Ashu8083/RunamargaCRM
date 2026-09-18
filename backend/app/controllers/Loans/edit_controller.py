import os
import uuid
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import HTTPException
from datetime import datetime
from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication, LoanStatus
from app.models.loan_coapplicant import LoanCoApplicant
from app.models.reverted_loans import RevertedLoan
from app.models.bank_processings import BankProcessing
from app.models.dsa_details import DSADetail

from app.models.loan_reference import LoanReference
from app.models.bank import Bank

from app.schemas.application_schema import (
   ApplicationHeaderUpdate,ApplicationLoanDetailsUpdate,AddApplicationAddressRequest,AddApplicationReferenceRequest,AddApplicationCoApplicantRequest,UploadApplicationDocumentRequest
)
from app.models.loan_addresses import LoanAddress
from app.models.loan_document import LoanDocument



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

            rejection_type="revert",

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
async def upload_application_document(
    db: Session,
    employee: Employee,
    application_id: str,
    payload: UploadApplicationDocumentRequest,
    file: UploadFile,
):
    # ---------------------------------------------------------
    # FIND APPLICATION
    # ---------------------------------------------------------

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

    # ---------------------------------------------------------
    # RBAC
    # ---------------------------------------------------------

    # Keep the SAME RBAC check you already use
    # in your other View Application controllers.


    # ---------------------------------------------------------
    # VALIDATE FILE
    # ---------------------------------------------------------

    if not file:
        raise HTTPException(
            status_code=400,
            detail="File is required",
        )

    original_filename = file.filename or ""

    extension = os.path.splitext(
        original_filename
    )[1].lower()

    allowed_extensions = {
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
    }

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Only PDF, JPG, JPEG and PNG files are allowed."
            ),
        )

    # ---------------------------------------------------------
    # READ FILE
    # ---------------------------------------------------------

    file_content = await file.read()

    max_file_size = 10 * 1024 * 1024

    if len(file_content) > max_file_size:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 10 MB",
        )

    # ---------------------------------------------------------
    # DOCUMENT TYPE
    # ---------------------------------------------------------

    doc_type = payload.doc_type.strip().lower()

    if not doc_type:
        raise HTTPException(
            status_code=400,
            detail="Document type is required",
        )

    # ---------------------------------------------------------
    # STORAGE PATH
    #
    # SAME PATH AS EXISTING DOCUMENT SYSTEM:
    #
    # app/static/uploads/{unique_id}/{doc_type}/
    # ---------------------------------------------------------

    base_upload_dir = os.path.join(
        "app",
        "static",
        "uploads",
    )

    upload_dir = os.path.join(
        base_upload_dir,
        application.unique_id,
        doc_type,
    )

    os.makedirs(
        upload_dir,
        exist_ok=True,
    )

    # ---------------------------------------------------------
    # GENERATE FILE NAME
    # ---------------------------------------------------------

    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    random_string = uuid.uuid4().hex[:8]

    filename = (
        f"{application.unique_id}_"
        f"{doc_type}_"
        f"{timestamp}_"
        f"{random_string}"
        f"{extension}"
    )

    file_path = os.path.join(
        upload_dir,
        filename,
    )

    # ---------------------------------------------------------
    # FIND EXISTING DOCUMENT
    # ---------------------------------------------------------

    existing_document = (
        db.query(LoanDocument)
        .filter(
            LoanDocument.loan_id == application.id,
            LoanDocument.doc_type == doc_type,
            LoanDocument.deleted_at.is_(None),
        )
        .first()
    )

    try:

        # -----------------------------------------------------
        # SAVE NEW FILE
        # -----------------------------------------------------

        with open(
            file_path,
            "wb",
        ) as output_file:

            output_file.write(
                file_content
            )

        # -----------------------------------------------------
        # REPLACE EXISTING DOCUMENT
        # -----------------------------------------------------

        if existing_document:

            # Delete old physical file
            if (
                existing_document.path
                and os.path.exists(
                    existing_document.path
                )
            ):
                os.remove(
                    existing_document.path
                )

            # Update existing DB record
            existing_document.path = file_path

            existing_document.bank_stmt_pass = (
                payload.bank_stmt_pass
            )

            existing_document.updated_at = (
                datetime.utcnow()
            )

            db.commit()
            db.refresh(
                existing_document
            )

            document = existing_document
            message = "Document replaced successfully"

        # -----------------------------------------------------
        # CREATE NEW DOCUMENT
        # -----------------------------------------------------

        else:

            document = LoanDocument(
                loan_id=application.id,
                path=file_path,
                doc_type=doc_type,
                bank_stmt_pass=payload.bank_stmt_pass,
            )

            db.add(document)

            db.commit()

            db.refresh(document)

            message = "Document uploaded successfully"

        # -----------------------------------------------------
        # RESPONSE
        # -----------------------------------------------------

        return {
            "success": True,
            "message": message,
            "data": {
                "id": document.id,
                "loan_id": document.loan_id,
                "document_key": document.doc_type,
                "doc_type": document.doc_type,
                "path": document.path,
                "file_path": document.path,
                "file_name": filename,
                "bank_stmt_pass": document.bank_stmt_pass,
                "created_at": (
                    document.created_at.isoformat()
                    if document.created_at
                    else None
                ),
                "updated_at": (
                    document.updated_at.isoformat()
                    if document.updated_at
                    else None
                ),
            },
        }

    except HTTPException:
        raise

    except Exception as error:

        db.rollback()

        # Remove newly uploaded file if DB operation failed
        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload document: {str(error)}",
        )

def delete_application_document(
    db: Session,
    employee: Employee,
    application_id: str,
    document_id: int,
):
    # ---------------------------------------------------------
    # FIND APPLICATION USING UNIQUE ID
    # ---------------------------------------------------------

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

    # ---------------------------------------------------------
    # RBAC
    # ---------------------------------------------------------

    # Keep the SAME RBAC check that you use
    # in your other View Application controllers.


    # ---------------------------------------------------------
    # FIND DOCUMENT
    # ---------------------------------------------------------

    document = (
        db.query(LoanDocument)
        .filter(
            LoanDocument.id == document_id,
            LoanDocument.loan_id == application.id,
            LoanDocument.deleted_at.is_(None),
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    try:

        # -----------------------------------------------------
        # DELETE PHYSICAL FILE
        # -----------------------------------------------------

        if (
            document.path
            and os.path.exists(document.path)
        ):
            os.remove(document.path)

        # -----------------------------------------------------
        # SOFT DELETE DATABASE RECORD
        # -----------------------------------------------------

        document.deleted_at = datetime.utcnow()

        db.commit()

        return {
            "success": True,
            "message": "Document deleted successfully",
            "data": {
                "id": document.id,
                "doc_type": document.doc_type,
            },
        }

    except Exception as error:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete document: {str(error)}",
        )


def update_bank_processing_workflow(
    db,
    employee,
    application_id: str,
    processing_id: int,
    action: str,
    data: dict,
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

    bank_processing = (
        db.query(BankProcessing)
        .filter(
            BankProcessing.id == processing_id,
            BankProcessing.loan_id == application.id,
            BankProcessing.deleted_at.is_(None),
        )
        .first()
    )

    if not bank_processing:
        raise HTTPException(
            status_code=404,
            detail="Bank processing not found",
        )

    current_status = bank_processing.status

    valid_transitions = {
        "login": ["sanction", "reject"],
        "sanctioned": ["disburse", "reject"],
        "disbursed": [],
        "rejected": [],
    }

    if action not in valid_transitions.get(current_status, []):
        raise HTTPException(
            status_code=400,
            detail=(
                f"Cannot perform '{action}' "
                f"when current status is '{current_status}'"
            ),
        )

    # -------------------------
    # SANCTION
    # -------------------------
    if action == "sanction":
        offered_amount = data.get("offered_amount")

        if offered_amount is None:
            raise HTTPException(
                status_code=400,
                detail="offered_amount is required for sanction",
            )

        bank_processing.status = "sanctioned"
        bank_processing.offered_amount = offered_amount
        bank_processing.sanctioned_at = datetime.now()

        bank_processing.approved_by = employee.id

        application.status = LoanStatus.sanctioned
        application.sanction_date = datetime.now().date()

    # -------------------------
    # DISBURSE
    # -------------------------
    elif action == "disburse":
        disbursement_amount = data.get("disbursement_amount")
        processing_fees = data.get("processing_fees")
        insurance = data.get("insurance")
        disbursed_at = data.get("disbursed_at")

        if disbursement_amount is None:
            raise HTTPException(
                status_code=400,
                detail="disbursement_amount is required for disbursement",
            )

        if processing_fees is None:
            raise HTTPException(
                status_code=400,
                detail="processing_fees is required for disbursement",
            )

        if insurance is None:
            raise HTTPException(
                status_code=400,
                detail="insurance is required for disbursement",
            )

        if disbursed_at is None:
            raise HTTPException(
                status_code=400,
                detail="disbursed_at is required for disbursement",
            )

        bank_processing.status = "disbursed"
        bank_processing.disbursement_amount = disbursement_amount
        bank_processing.processing_fees = processing_fees
        bank_processing.insurance = insurance
        bank_processing.disbursed_at = datetime.now()
        bank_processing.application_reference_id = data.get(
            "application_reference_id"
        )

        bank_processing.approved_by = employee.id

        application.status = LoanStatus.disbursed

    # -------------------------
    # REJECT
    # -------------------------
    elif action == "reject":
        remarks = data.get("remarks")

        if not remarks:
            raise HTTPException(
                status_code=400,
                detail="remarks is required for rejection",
            )

        bank_processing.status = "rejected"
        bank_processing.remarks = remarks
        bank_processing.rejected_at = datetime.now()

        bank_processing.approved_by = employee.id

        application.status = LoanStatus.rejected
        application.rejection_date = datetime.now().date()
        application.rejected_remarks = remarks

    db.commit()
    db.refresh(bank_processing)

    return {
        "success": True,
        "message": f"Bank processing {action} successful",
        "data": {
            "id": bank_processing.id,
            "loan_id": bank_processing.loan_id,
            "bank_id": bank_processing.bank_id,
            "status": bank_processing.status,
            "offered_amount": bank_processing.offered_amount,
            "disbursement_amount": bank_processing.disbursement_amount,
            "processing_fees": bank_processing.processing_fees,
            "insurance": bank_processing.insurance,
            "remarks": bank_processing.remarks,
            "sanctioned_at": bank_processing.sanctioned_at,
            "disbursed_at": bank_processing.disbursed_at,
            "rejected_at": bank_processing.rejected_at,
            "application_reference_id": (
                bank_processing.application_reference_id
            ),
        },
    }



def assign_bank(
    db: Session,
    employee,
    application_id: str,
    payload,
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

    bank = (
        db.query(Bank)
        .filter(
            Bank.id == payload.bank_id,
            Bank.is_active.is_(True),
            Bank.deleted_at.is_(None),
        )
        .first()
    )

    if not bank:
        raise HTTPException(
            status_code=404,
            detail="Bank not found or inactive",
        )

    existing = (
        db.query(BankProcessing)
        .filter(
            BankProcessing.loan_id == application.id,
            BankProcessing.bank_id == payload.bank_id,
            BankProcessing.deleted_at.is_(None),
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="This bank is already assigned to the application",
        )

    # Find default DSA for this bank + loan type
    default_dsa = None

    if application.loan_type_id:
        default_dsa = (
            db.query(DSADetail)
            .filter(
                DSADetail.bank_id == payload.bank_id,
                DSADetail.loan_type_id == application.loan_type_id,
                DSADetail.status == "1",
                DSADetail.is_default.is_(True),
                DSADetail.deleted_at.is_(None),
            )
            .first()
        )

    if default_dsa:
        dsa_id = str(default_dsa.id)
        dsa_code = default_dsa.dsa_code
        dsa_name = default_dsa.dsa_name

    else:
        if not payload.dsa_code and not payload.dsa_name:
            raise HTTPException(
                status_code=400,
                detail="DSA code or DSA name is required",
            )

        dsa_id = None
        dsa_code = payload.dsa_code
        dsa_name = payload.dsa_name

    now = datetime.now()

    bank_processing = BankProcessing(
        loan_id=application.id,
        bank_id=payload.bank_id,
        loan_type_id=application.loan_type_id,

        dsa_id=dsa_id,
        dsa_code=dsa_code,
        dsa_name=dsa_name,

        status="login",
        loggedin_at=now,
    )

    db.add(bank_processing)

    # Assignment immediately moves application to login
    application.status = LoanStatus.login
    application.loggedin_date = now.date()

    db.commit()
    db.refresh(bank_processing)

    return {
        "success": True,
        "message": "Bank assigned successfully",
        "data": {
            "id": bank_processing.id,
            "loan_id": bank_processing.loan_id,
            "bank_id": bank_processing.bank_id,
            "bank_name": bank.name,
            "loan_type_id": bank_processing.loan_type_id,
            "dsa_id": bank_processing.dsa_id,
            "dsa_code": bank_processing.dsa_code,
            "dsa_name": bank_processing.dsa_name,
            "status": bank_processing.status,
            "loggedin_at": (
                bank_processing.loggedin_at.isoformat()
                if bank_processing.loggedin_at
                else None
            ),
        },
    }