# backend/app/controllers/admin/Loans/loan_assignment_controller.py

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.models.loan_assignments import LoanAssignmentStatus
from app.services.Loans.loan_assignment_service import (
    LoanAssignmentService,
)


class LoanAssignmentController:

    # ========================================================================
    # GET LOAN ASSIGNMENTS
    # ========================================================================

    @staticmethod
    def get_loan_assignments(
        db: Session,
        employee: Employee,
        context_id: int | None = None,
    ):
        return LoanAssignmentService.get_loan_assignments(
            db=db,
            employee=employee,
            context_id=context_id,
        )

    # ========================================================================
    # TOGGLE LOAN ASSIGNMENT
    # ========================================================================

    @staticmethod
    def toggle_loan_assignment(
        db: Session,
        employee: Employee,
        employee_context_id: int,
        loan_type_id: int,
        status: LoanAssignmentStatus,
        context_id: int | None = None,
    ):
        return LoanAssignmentService.toggle_loan_assignment(
            db=db,
            employee=employee,
            employee_context_id=employee_context_id,
            loan_type_id=loan_type_id,
            status=status,
            context_id=context_id,
        )