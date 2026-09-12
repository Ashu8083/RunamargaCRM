# backend/app/routes/admin/Loans/loan_assignment_routes.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee
from app.models.loan_assignments import LoanAssignmentStatus
from app.controllers.Loans.loan_assignment_controller import (
    LoanAssignmentController,
)
from app.schemas.Loans.loan_assignment import (
    LoanAssignmentToggleRequest,
)


router = APIRouter(
    prefix="/loans-assignment",
    tags=["Loan Assignment"],
)


# ============================================================================
# GET LOAN ASSIGNMENTS
# ============================================================================

@router.get("")
def get_loan_assignments(
    context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        return LoanAssignmentController.get_loan_assignments(
            db=db,
            employee=employee,
            context_id=context_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================================
# TOGGLE LOAN ASSIGNMENT
# ============================================================================

@router.put("/{employee_context_id}/{loan_type_id}")
def toggle_loan_assignment(
    employee_context_id: int,
    loan_type_id: int,
    payload: LoanAssignmentToggleRequest,
    context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        return LoanAssignmentController.toggle_loan_assignment(
            db=db,
            employee=employee,
            employee_context_id=employee_context_id,
            loan_type_id=loan_type_id,
            status=payload.status,
            context_id=context_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )