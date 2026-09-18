# backend/app/controllers/Dashboard/ApplicationFunnelController.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.Dashboard.application_funnel_service import (
    get_application_funnel,
)


class ApplicationFunnelController:

    @staticmethod
    async def get_application_funnel(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        loan_type: Optional[int] = None,
    ):
        return get_application_funnel(
            db=db,
            employee=employee,
            context_id=context_id,
            from_date=from_date,
            to_date=to_date,
            loan_type=loan_type,
        )