from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.shuffle_loans_schema import ShuffleLoansAssign
from app.services.shuffle_loans_service import ShuffleLoansService


class ShuffleLoansController:

    @staticmethod
    def get_shuffle_loans(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        search: Optional[str] = None,
        agent_id: Optional[int] = None,
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

    @staticmethod
    def get_eligible_agents(
        db: Session,
        employee: Employee,
        application_id: int,
        context_id: Optional[int] = None,
    ):
        return ShuffleLoansService.get_eligible_agents(
            db=db,
            employee=employee,
            application_id=application_id,
            context_id=context_id,
        )

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