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

        context_id: Optional[int] = None,

        from_date: Optional[date] = None,
        to_date: Optional[date] = None,

        loan_type_id: Optional[int] = None,
        status: Optional[str] = None,

        # New filters
        search: Optional[str] = None,
        rm_id: Optional[int] = None,
        agent_id: Optional[int] = None,
        team_lead_id: Optional[int] = None,

        # Pagination
        page: int = 1,
        page_size: int = 10,
    ):
        return get_application_status_applications(
            db=db,
            employee=employee,

            context_id=context_id,

            from_date=from_date,
            to_date=to_date,

            loan_type_id=loan_type_id,
            status=status,

            search=search,
            rm_id=rm_id,
            agent_id=agent_id,
            team_lead_id=team_lead_id,

            page=page,
            page_size=page_size,
        )