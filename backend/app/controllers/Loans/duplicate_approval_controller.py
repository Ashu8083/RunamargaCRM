# backend/app/controllers/Loans/duplicate_approval_controller.py
from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.duplicate_approvals import (
    DuplicateApproval,
    DuplicateApprovalStatus,
)
from app.models.loan_applications import LoanApplication
from app.models.employees import Employee


def create_duplicate_approval(
    db: Session,
    employee: Employee,
    payload,
):

    # =========================================================
    # FIND EXISTING APPLICATION
    # =========================================================

    application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.id == payload.loan_application_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Existing loan application not found.",
        )

    # =========================================================
    # PREVENT DUPLICATE PENDING REQUEST
    # =========================================================

    existing_request = (
        db.query(DuplicateApproval)
        .filter(
            DuplicateApproval.loan_application_id
            == application.id,

            DuplicateApproval.status
            == DuplicateApprovalStatus.pending,

            DuplicateApproval.deleted_at.is_(None),
        )
        .first()
    )

    if existing_request:
        raise HTTPException(
            status_code=409,
            detail="Approval request already exists for this application.",
        )

    # =========================================================
    # CREATE APPROVAL REQUEST
    # =========================================================

    approval = DuplicateApproval(

        loan_application_id=application.id,

        name=application.name,

        phone=application.phone,

        loan_type_id=application.loan_type_id,

        loan_amt=application.loan_amt,

        loan_purpose=application.loan_purpose,

        referral=application.referral,

        applied_by_id=employee.id,

        status=DuplicateApprovalStatus.pending,

        applied_date=date.today(),
    )

    db.add(approval)
    db.commit()
    db.refresh(approval)

    return {
        "success": True,
        "message": "Duplicate application approval request submitted successfully.",
        "data": {
            "id": approval.id,
            "status": approval.status.value,
            "loan_application_id": approval.loan_application_id,
        },
    }