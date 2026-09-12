from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import HTTPException, Request
from datetime import datetime,date

from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.loan_coapplicant import LoanCoApplicant
from app.models.loan_addresses import LoanAddress
from app.models.loan_applications import LoanApplication, LoanStatus
from app.models.reverted_loans import RevertedLoan
from app.models.loan_reference import LoanReference
from app.models.loan_document import LoanDocument
from app.models.bank_processings import BankProcessing
from app.models.dsa_details import DSADetail
from app.models.bank import Bank


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
    addresses = (
        db.query(LoanAddress)
        .filter(
            LoanAddress.loan_id == application.id,
            LoanAddress.deleted_at.is_(None),
        )
        .all()
    )
    references = (
        db.query(LoanReference)
        .filter(
            LoanReference.loan_id == application.id,
            LoanReference.deleted_at.is_(None),
        )
        .all()
    )
    co_applicants = (
        db.query(LoanCoApplicant)
        .filter(
            LoanCoApplicant.loan_id == application.id,
            LoanCoApplicant.deleted_at.is_(None),
        )
        .all()
    )
    documents = (
        db.query(LoanDocument)
        .filter(
            LoanDocument.loan_id == application.id,
            LoanDocument.deleted_at.is_(None),
        )
        .all()
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
            LoanApplication.id == application.id
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

        "loan_type": (
            {
                "id": application.loan_type.id,
                "name": application.loan_type.name,
            }
            if application.loan_type
            else None
        ),
        "common_fields": {
            "email": application.email,
            "gender": application.gender,
            "marital_status": application.marital_status,
            "date_of_birth": application.dob,
            "pan_number": application.pancard_no,
            "aadhaar_number": application.aadhar_no,
            "loan_amount": application.loan_amt,
            "loan_tenure": application.loan_tenure,
            "bank_account_number": application.bank_acc_no,
            "ifsc_code": application.ifsc_code,
        },
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
        "addresses": [
            {
                "id": address.id,
                "loan_id": address.loan_id,
                "address": address.address,
                "address_type": address.address_type,
                "created_at": address.created_at,
            }
            for address in addresses
        ],
        "references": [
            {
                "id": reference.id,
                "loan_id": reference.loan_id,
                "name": reference.name,
                "phone": reference.phone,
                "relation": reference.relation,
                "address": reference.address,
                "created_at": reference.created_at,
            }
            for reference in references
        ],
        "documents": [
            {
                "id": document.id,
                "loan_id": document.loan_id,
                "document_key": document.doc_type,
                "doc_type": document.doc_type,
                "path": document.path,
                "bank_stmt_pass": document.bank_stmt_pass,
                "file_name": (
                    document.path.split("/")[-1]
                    if document.path
                    else None
                ),
                "created_at": document.created_at,
            }
            for document in documents
        ],
        "co_applicants": [
            {
                "id": co_applicant.id,
                "loan_id": co_applicant.loan_id,
                "name": co_applicant.name,
                "phone": co_applicant.phone,
                "pan_number": co_applicant.pancard_no,
                "aadhaar_number": co_applicant.adharr_no,
                "created_at": co_applicant.created_at,
            }
            for co_applicant in co_applicants
        ],
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

    # =========================================================
    # EXISTING APPLICATION
    # =========================================================

    if existing_application:

        # -------------------------------------------------------
        # APPLIED BY
        # -------------------------------------------------------

        applied_by = None

        if existing_application.applied_by_id:

            applied_by = (
                db.query(Employee)
                .filter(
                    Employee.id == existing_application.applied_by_id
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
                    Employee.id == existing_application.rm_id
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
            "message": (
                "An existing application was found "
                "for this phone number."
            ),
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

                "status": (
                    existing_application.status.value
                    if existing_application.status
                    else None
                ),

                "applied_date": (
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

                "applied_by_name": (
                    applied_by.name
                    if applied_by
                    else None
                ),

                # ------------------------------------------------
                # RM
                # ------------------------------------------------

                "rm_id":
                    existing_application.rm_id,

                "rm_name": (
                    rm.name
                    if rm
                    else None
                ),

                # ------------------------------------------------
                # AGENT
                # ------------------------------------------------

                "agent_id":
                    agent_id,

                "agent_name": (
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
    db.flush()

    application.unique_id = f"LN{application.id}"

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

def get_bank_processings(
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
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    bank_processings = (
        db.query(
            BankProcessing,
            Bank.name.label("bank_name"),
        )
        .join(
            Bank,
            Bank.id == BankProcessing.bank_id,
        )
        .filter(
            BankProcessing.loan_id == application.id,
            BankProcessing.deleted_at.is_(None),
        )
        .order_by(
            BankProcessing.created_at.desc()
        )
        .all()
    )

    data = []

    for bp, bank_name in bank_processings:
        data.append({
            "id": bp.id,
            "loan_id": bp.loan_id,

            "bank_id": bp.bank_id,
            "bank_name": bank_name,

            "loan_type_id": bp.loan_type_id,

            "dsa_id": bp.dsa_id,
            "dsa_code": bp.dsa_code,
            "dsa_name": bp.dsa_name,

            "status": bp.status,

            "offered_amount": (
                float(bp.offered_amount)
                if bp.offered_amount is not None
                else None
            ),

            "disbursement_amount": (
                float(bp.disbursement_amount)
                if bp.disbursement_amount is not None
                else None
            ),

            "interest_rate": (
                float(bp.interest_rate)
                if bp.interest_rate is not None
                else None
            ),

            "tenure_months": bp.tenure_months,

            "processing_fees": (
                float(bp.processing_fees)
                if bp.processing_fees is not None
                else None
            ),

            "insurance": bp.insurance,
            "remarks": bp.remarks,

            "assigned_at": (
                bp.created_at.isoformat()
                if bp.created_at
                else None
            ),

            "login_at": (
                bp.loggedin_at.isoformat()
                if bp.loggedin_at
                else None
            ),

            "sanction_at": (
                bp.sanctioned_at.isoformat()
                if bp.sanctioned_at
                else None
            ),

            "disbursement_at": (
                bp.disbursed_at.isoformat()
                if bp.disbursed_at
                else None
            ),

            "rejected_at": (
                bp.rejected_at.isoformat()
                if bp.rejected_at
                else None
            ),

            "approved_by": bp.approved_by,

            "application_reference_id":
                bp.application_reference_id,

            "created_at": (
                bp.created_at.isoformat()
                if bp.created_at
                else None
            ),

            "updated_at": (
                bp.updated_at.isoformat()
                if bp.updated_at
                else None
            ),
        })

    return {
        "success": True,
        "data": data,
    }
def get_default_dsa(
    db: Session,
    employee,
    application_id: str,
    bank_id: int,
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

    # KEEP THE SAME RBAC CHECK USED BY YOUR OTHER
    # VIEW-APPLICATION CONTROLLERS

    if not application.loan_type_id:
        return {
            "success": True,
            "data": {
                "found": False,
                "dsa_id": None,
                "dsa_code": None,
                "dsa_name": None,
            },
        }

    dsa = (
        db.query(DSADetail)
        .filter(
            DSADetail.bank_id == bank_id,
            DSADetail.loan_type_id == application.loan_type_id,
            DSADetail.status == "1",
            DSADetail.is_default.is_(True),
        )
        .first()
    )

    return {
        "success": True,
        "data": {
            "found": bool(dsa),
            "dsa_id": str(dsa.id) if dsa else None,
            "dsa_code": dsa.dsa_code if dsa else None,
            "dsa_name": dsa.dsa_name if dsa else None,
        },
    }