# backend/app/controllers/Dashboard/ApplicationStatusApplicationsController.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee

from app.services.Dashboard.application_status_applications_service import (
    get_application_status_applications,
)


class ApplicationStatusApplicationsController:

    @staticmethod
    async def get_application_status_applications(
        db: Session,
        employee: Employee,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        loan_type_id: Optional[int] = None,
        status: Optional[str] = None,
    ):
        return get_application_status_applications(
            db=db,
            employee=employee,
            from_date=from_date,
            to_date=to_date,
            loan_type_id=loan_type_id,
            status=status,
        )