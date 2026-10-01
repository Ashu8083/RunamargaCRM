# backend/app/routes/admin/CallAnalytics/overview_routes.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee
from app.controllers.CallAnalytics.overview_controller import (
    get_overview,
)


router = APIRouter(
    prefix="/call-analytics",
    tags=["Call Analytics"],
)


@router.get("/overview")
def call_analytics_overview(
    employee_id: Optional[int] = Query(
        default=None,
        description="Employee ID of the selected Agent or RM",
    ),
    from_date: Optional[date] = Query(
        default=None,
        description="Start date",
    ),
    to_date: Optional[date] = Query(
        default=None,
        description="End date",
    ),
    call_type: Optional[str] = Query(
        default=None,
        description="Call direction/type",
    ),
    status: Optional[str] = Query(
        default=None,
        description="Call/mobile status",
    ),
    context_id: Optional[int] = Query(
        default=None,
        description="Current employee context ID",
    ),
    team_lead_context_id: Optional[int] = Query(
        default=None,
        description="Selected Team Lead employee context ID",
    ),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_overview(
        db=db,
        employee=employee,
        employee_id=employee_id,
        from_date=from_date,
        to_date=to_date,
        call_type=call_type,
        status=status,
        context_id=context_id,
        team_lead_context_id=team_lead_context_id,
    )