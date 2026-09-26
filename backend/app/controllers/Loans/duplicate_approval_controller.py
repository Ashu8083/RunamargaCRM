# backend/app/controllers/Loans/duplicate_approval_controller.py

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employees import Employee

from app.schemas.duplicate_approval_schema import (
    DuplicateApprovalCreateRequest,
)

from app.services.Loans.duplicate_approval_service import (
    DuplicateApprovalService,
)


# =========================================================
# GET DUPLICATE APPROVALS
# =========================================================

def get_duplicate_approvals(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
    status: str | None = None,
    search: str | None = None,
    loan_type_id: int | None = None,
    applied_by_id: int | None = None,
):
    approvals = DuplicateApprovalService.get_all(
        db=db,
        employee=employee,
        context_id=context_id,
        status=status,
        search=search,
        loan_type_id=loan_type_id,
        applied_by_id=applied_by_id,
    )

    result = [
        DuplicateApprovalService.serialize(
            db=db,
            approval=approval,
        )
        for approval in approvals
    ]

    return result


# =========================================================
# CREATE DUPLICATE APPROVAL
# =========================================================

def create_duplicate_approval(
    db: Session,
    employee: Employee,
    payload: DuplicateApprovalCreateRequest,
    context_id: int | None = None,
):
    try:

        approval = DuplicateApprovalService.create(
            db=db,
            employee=employee,
            payload=payload,
            context_id=context_id,
        )

        return {
            "success": True,

            "message": (
                "Duplicate application approval "
                "request submitted successfully."
            ),

            "data": {
                "id": approval.id,

                "loan_id": approval.loan_id,

                "rm_id": (
                    approval.rm_context.employee.id
                    if approval.rm_context
                    and approval.rm_context.employee
                    else None
                ),

                "status": (
                    approval.status.value
                    if approval.status
                    else None
                ),

                "applied_by_id": (
                    approval.applied_by_context.employee.id
                    if (
                        approval.applied_by_context
                        and approval.applied_by_context.employee
                    )
                    else employee.id
                ),

                "applied_date": (
                    approval.applied_date
                ),
            },
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# =========================================================
# APPROVE DUPLICATE APPLICATION
# =========================================================

def approve_duplicate_application(
    db: Session,
    employee: Employee,
    duplicate_approval_id: int,
    context_id: int | None = None,
):
    try:

        result = DuplicateApprovalService.approve(
            db=db,
            employee=employee,
            duplicate_approval_id=duplicate_approval_id,
            context_id=context_id,
        )

        duplicate_approval = (
            result["duplicate_approval"]
        )

        loan_application = (
            result["loan_application"]
        )

        return {
            "success": True,

            "message": (
                "Duplicate application approved "
                "and loan application created successfully."
            ),

            "data": {
                "duplicate_approval_id":
                    duplicate_approval.id,

                "loan_id":
                    loan_application.id,

                "status":
                    duplicate_approval.status.value,

                "approved_by_id":
                    duplicate_approval.approved_by_id,

                "approved_at":
                    duplicate_approval.approved_at,
            },
        }

    except LookupError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )