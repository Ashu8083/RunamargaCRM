# backend/app/controllers/Logs/bank_processing_logs_controller.py

from sqlalchemy.orm import Session

from app.services.logs.bank_processing_logs_service import (
    BankProcessingLogsService,
)


class BankProcessingLogsController:

    @staticmethod
    def get_logs(
        db: Session,
        employee,
        context_id=None,
        search=None,
        loan_id=None,
        bp_id=None,
        employee_context_id=None,
        event=None,
        from_date=None,
        to_date=None,
        page=1,
        limit=10,
    ):
        return BankProcessingLogsService.get_logs(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            loan_id=loan_id,
            bp_id=bp_id,
            employee_context_id=employee_context_id,
            event=event,
            from_date=from_date,
            to_date=to_date,
            page=page,
            limit=limit,
        )