# backend/app/controllers/Loans/shuffle_loans_controller.py

from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.shuffle_loans_schema import ShuffleLoansAssign
from app.services.shuffle_loans_service import ShuffleLoansService


class ShuffleLoansController:

    # =========================================================
    # GET SHUFFLE LOANS
    # =========================================================

    @staticmethod
    def get_shuffle_loans(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        search: Optional[str] = None,

        # EmployeeContext.id for AGENT context
        agent_id: Optional[int] = None,

        # EmployeeContext.id for RM context
        rm_id: Optional[int] = None,

        loan_type_id: Optional[int] = None,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 30,
    ):
        return ShuffleLoansService.get_shuffle_loans(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            agent_id=agent_id,
            rm_id=rm_id,
            loan_type_id=loan_type_id,
            status=status,
            page=page,
            limit=limit,
        )

    # =========================================================
    # ASSIGN SHUFFLE LOANS
    # =========================================================

    @staticmethod
    def assign_shuffle_loans(
        db: Session,
        employee: Employee,
        payload: ShuffleLoansAssign,
        shuffled_by_context_id: int,
    ):
        return ShuffleLoansService.assign_shuffle_loans(
            db=db,
            employee=employee,
            application_ids=payload.application_ids,
            shuffled_by_context_id=shuffled_by_context_id,
            agent_id=payload.agent_id,
            rm_id=payload.rm_id,
            loan_type_id=payload.loan_type_id,
        )