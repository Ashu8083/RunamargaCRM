# backend/app/controllers/CallAnalytics/overview_controller.py

from datetime import date
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.CallAnalytics.overview_service import (
    get_overview as get_call_analytics_overview,
)


def get_overview(
    db: Session,
    employee: Employee,
    employee_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    call_type: Optional[str] = None,
    status: Optional[str] = None,
    context_id: Optional[int] = None,
    team_lead_context_id: Optional[int] = None,
):
    if employee is None:
        raise HTTPException(
            status_code=401,
            detail="Employee not authenticated",
        )

    if from_date and to_date and from_date > to_date:
        raise HTTPException(
            status_code=400,
            detail="from_date cannot be greater than to_date",
        )

    return get_call_analytics_overview(
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