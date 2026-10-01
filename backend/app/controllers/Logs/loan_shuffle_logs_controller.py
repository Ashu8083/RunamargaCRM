# backend/app/controllers/Logs/loan_shuffle_logs_controller.py

from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.logs.loan_shuffle_logs_service import (
    LoanShuffleLogsService,
)


class LoanShuffleLogsController:

    @staticmethod
    def get_logs(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        search: Optional[str] = None,
        shuffled_by_context_id: Optional[int] = None,
        from_agent_context_id: Optional[int] = None,
        to_agent_context_id: Optional[int] = None,
        from_rm_context_id: Optional[int] = None,
        to_rm_context_id: Optional[int] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ):
        return LoanShuffleLogsService.get_logs(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            shuffled_by_context_id=shuffled_by_context_id,
            from_agent_context_id=from_agent_context_id,
            to_agent_context_id=to_agent_context_id,
            from_rm_context_id=from_rm_context_id,
            to_rm_context_id=to_rm_context_id,
            from_date=from_date,
            to_date=to_date,
            page=page,
            limit=limit,
        )