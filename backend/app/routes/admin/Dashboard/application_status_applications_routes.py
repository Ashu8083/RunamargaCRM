# backend/app/routes/admin/Dashboard/application_status_applications_routes.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee

from app.controllers.Dashboard.ApplicationStatusApplicationsController import (
    ApplicationStatusApplicationsController,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/application-status/applications")
async def get_application_status_applications(
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    loan_type_id: Optional[int] = Query(default=None),
    status: Optional[str] = Query(default=None),
    # Existing RBAC context
    context_id: Optional[int] = Query(default=None),
    # New filters
    search: Optional[str] = Query(default=None),
    rm_id: Optional[int] = Query(default=None),
    agent_id: Optional[int] = Query(default=None),
    team_lead_id: Optional[int] = Query(default=None),

    # Pagination
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),

    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return await ApplicationStatusApplicationsController.get_application_status_applications(
        db=db,
        employee=employee,

        from_date=from_date,
        to_date=to_date,

        context_id=context_id,

        loan_type_id=loan_type_id,
        status=status,

        search=search,
        rm_id=rm_id,
        agent_id=agent_id,
        team_lead_id=team_lead_id,

        page=page,
        page_size=page_size,
    )