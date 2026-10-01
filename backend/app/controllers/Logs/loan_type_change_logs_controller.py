# backend/app/controllers/Logs/loan_type_change_logs_controller.py

from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.logs.loan_type_change_logs_service import (
    LoanChangeTypeLogsService,
)


class LoanTypeChangeLogController:

    @staticmethod
    def get_logs(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        search: Optional[str] = None,
        changed_by_id: Optional[int] = None,
        reports_to_id: Optional[int] = None,
        from_loan_type_id: Optional[int] = None,
        to_loan_type_id: Optional[int] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ):

        return LoanChangeTypeLogsService.get_logs(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            changed_by_id=changed_by_id,
            reports_to_id=reports_to_id,
            from_loan_type_id=from_loan_type_id,
            to_loan_type_id=to_loan_type_id,
            from_date=from_date,
            to_date=to_date,
            page=page,
            limit=limit,
        )