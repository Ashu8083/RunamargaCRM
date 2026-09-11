# app/controllers/Loans/duplicate_approval_controller.py

from datetime import date,datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.duplicate_approvals import (
    DuplicateApproval,
    DuplicateApprovalStatus,
)
from app.models.loan_types import LoanType
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication,LoanStatus

from app.schemas.duplicate_approval_schema import (
    DuplicateApprovalCreateRequest,
)
def get_duplicate_approvals(
    db: Session,
    employee: Employee,
    status: str | None = None,
    search: str | None = None,
    loan_type_id: int | None = None,
    applied_by_id: int | None = None,
):
    query = (
        db.query(DuplicateApproval)
        .filter(
            DuplicateApproval.deleted_at.is_(None)
        )
    )

    # ---------------------------------------------------------
    # STATUS FILTER
    # ---------------------------------------------------------

    if status:
        try:
            status_enum = DuplicateApprovalStatus(status)
        except ValueError:
            return []

        query = query.filter(
            DuplicateApproval.status == status_enum
        )

    # ---------------------------------------------------------
    # SEARCH
    # ---------------------------------------------------------

    if search:
        search_value = f"%{search.strip()}%"

        query = query.filter(
            or_(
                DuplicateApproval.name.ilike(search_value),
                DuplicateApproval.phone.ilike(search_value),
            )
        )

    # ---------------------------------------------------------
    # LOAN TYPE
    # ---------------------------------------------------------

    if loan_type_id:
        query = query.filter(
            DuplicateApproval.loan_type_id == loan_type_id
        )

    # ---------------------------------------------------------
    # APPLIED BY
    # ---------------------------------------------------------

    if applied_by_id:
        query = query.filter(
            DuplicateApproval.applied_by_id == applied_by_id
        )

    # ---------------------------------------------------------
    # ORDER
    # ---------------------------------------------------------

    approvals = (
        query
        .order_by(
            DuplicateApproval.applied_date.desc(),
            DuplicateApproval.id.desc(),
        )
        .all()
    )

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    result = []

    for approval in approvals:

        loan_type_name = None

        if approval.loan_type_id:
            loan_type = (
                db.query(LoanType)
                .filter(
                    LoanType.id ==
                    approval.loan_type_id
                )
                .first()
            )

            if loan_type:
                loan_type_name = (
                    getattr(loan_type, "name", None)
                    or getattr(loan_type, "loan_type", None)
                    or getattr(loan_type, "title", None)
                )

        applied_by_name = None

        if approval.applied_by:
            applied_by_name = approval.applied_by.name

        approved_by_name = None

        if approval.approved_by:
            approved_by_name = approval.approved_by.name

        rm_name = None

        if approval.rm:
            rm_name = approval.rm.name

        result.append({
            "id": approval.id,

            "applicantName":
                approval.name,

            "name":
                approval.name,

            "phone":
                approval.phone,

            "loanType":
                loan_type_name,

            "loan_type":
                loan_type_name,

            "loan_type_id":
                approval.loan_type_id,

            "loanAmount":
                float(approval.loan_amt)
                if approval.loan_amt is not None
                else None,

            "loan_amount":
                float(approval.loan_amt)
                if approval.loan_amt is not None
                else None,

            "loan_purpose":
                approval.loan_purpose,

            "reference_name":
                approval.referral,

            "appliedBy":
                applied_by_name,

            "applied_by":
                applied_by_name,

            "applied_by_id":
                approval.applied_by_id,

            "rm_id":
                approval.rm_id,

            "rmName":
                rm_name,

            "rm_name":
                rm_name,

            "status":
                approval.status.value
                if approval.status
                else None,

            "appliedDate":
                approval.applied_date,

            "applied_date":
                approval.applied_date,

            "approvedDate":
                approval.approved_at,

            "approved_date":
                approval.approved_at,

            "approved_by_id":
                approval.approved_by_id,

            "approved_by":
                approved_by_name,

            "rejectedDate":
                approval.approved_at
                if approval.status ==
                DuplicateApprovalStatus.rejected
                else None,

            "rejected_date":
                approval.approved_at
                if approval.status ==
                DuplicateApprovalStatus.rejected
                else None,

            "rejected_remarks":
                approval.rejected_remarks,

            "loanId":
                approval.loan_id,

            "loan_id":
                approval.loan_id,
        })

    return result

def create_duplicate_approval(
    db: Session,
    employee: Employee,
    payload: DuplicateApprovalCreateRequest,
):
    # Validate RM if selected
    if payload.rm_id is not None:
        rm = (
            db.query(Employee)
            .filter(
                Employee.id == payload.rm_id,
                Employee.deleted_at.is_(None),
            )
            .first()
        )

        if not rm:
            raise HTTPException(
                status_code=404,
                detail="Selected RM not found.",
            )

    # Prevent duplicate pending approval requests
    existing_request = (
        db.query(DuplicateApproval)
        .filter(
            DuplicateApproval.phone == payload.phone,
            DuplicateApproval.status == DuplicateApprovalStatus.pending,
            DuplicateApproval.deleted_at.is_(None),
        )
        .first()
    )

    if existing_request:
        raise HTTPException(
            status_code=409,
            detail="Approval request already exists for this phone number.",
        )

    approval = DuplicateApproval(
        name=payload.name,
        phone=payload.phone,
        loan_type_id=payload.loan_type_id,
        loan_amt=payload.loan_amount,
        loan_purpose=payload.loan_purpose,
        referral=payload.reference_name,
        rm_id=payload.rm_id,
        applied_by_id=employee.id,
        status=DuplicateApprovalStatus.pending,
        applied_date=date.today(),
        loan_id=None,
    )

    db.add(approval)
    db.commit()
    db.refresh(approval)

    return {
        "success": True,
        "message": "Duplicate application approval request submitted successfully.",
        "data": {
            "id": approval.id,
            "loan_id": approval.loan_id,
            "rm_id": approval.rm_id,
            "status": approval.status.value,
            "applied_by_id": approval.applied_by_id,
            "applied_date": approval.applied_date,
        },
    }
def approve_duplicate_application(
    db: Session,
    employee: Employee,
    duplicate_approval_id: int,
):
    # =====================================================
    # 1. FIND DUPLICATE APPROVAL
    # =====================================================

    duplicate_approval = (
        db.query(DuplicateApproval)
        .filter(
            DuplicateApproval.id == duplicate_approval_id,
            DuplicateApproval.deleted_at.is_(None),
        )
        .first()
    )

    if not duplicate_approval:
        raise HTTPException(
            status_code=404,
            detail="Duplicate approval request not found.",
        )

    # =====================================================
    # 2. CHECK STATUS
    # =====================================================

    if (
        duplicate_approval.status
        != DuplicateApprovalStatus.pending
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Only pending duplicate approval "
                "requests can be approved."
            ),
        )

    # =====================================================
    # 3. VALIDATE REQUIRED DATA
    # =====================================================

    if not duplicate_approval.name:
        raise HTTPException(
            status_code=400,
            detail="Applicant name is required.",
        )

    if not duplicate_approval.phone:
        raise HTTPException(
            status_code=400,
            detail="Applicant phone number is required.",
        )

    if not duplicate_approval.loan_type_id:
        raise HTTPException(
            status_code=400,
            detail="Loan type is required.",
        )

    # =====================================================
    # 4. CREATE NEW LOAN APPLICATION
    # =====================================================

    loan_application = LoanApplication(
        name=duplicate_approval.name,
        phone=duplicate_approval.phone,

        loan_type_id=duplicate_approval.loan_type_id,

        loan_amt=duplicate_approval.loan_amt,

        loan_purpose=duplicate_approval.loan_purpose,

        referral=duplicate_approval.referral,

        rm_id=duplicate_approval.rm_id,

        applied_by_id=duplicate_approval.applied_by_id,

        applied_date=(
            duplicate_approval.applied_date
            or date.today()
        ),

        status=LoanStatus.inprocess,
    )

    db.add(loan_application)
    db.flush()

    loan_application.unique_id = f"LN{loan_application.id}"

    db.commit()
    db.refresh(loan_application)

    # =====================================================
    # 5. UPDATE DUPLICATE APPROVAL
    # =====================================================

    duplicate_approval.loan_id = loan_application.id

    duplicate_approval.status = (
        DuplicateApprovalStatus.approved
    )

    duplicate_approval.approved_by_id = employee.id

    duplicate_approval.approved_at = datetime.utcnow()

    # =====================================================
    # 6. COMMIT BOTH CHANGES
    # =====================================================

    db.commit()

    # =====================================================
    # 7. REFRESH
    # =====================================================

    db.refresh(loan_application)
    db.refresh(duplicate_approval)

    # =====================================================
    # 8. RESPONSE
    # =====================================================

    return {
        "success": True,
        "message": (
            "Duplicate application approved "
            "and loan application created successfully."
        ),
        "data": {
            "duplicate_approval_id": duplicate_approval.id,
            "loan_id": loan_application.id,
            "status": duplicate_approval.status.value,
            "approved_by_id": duplicate_approval.approved_by_id,
            "approved_at": duplicate_approval.approved_at,
        },
    }