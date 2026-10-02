# backend/app/routes/admin/CallAnalytics/Trends/daily_call_trend_routes.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee

from app.controllers.CallAnalytics.Trends.daily_call_trend_controller import (
    get_daily_call_trend as get_daily_call_trend_controller,
)

from app.models.employees import Employee


router = APIRouter(
    prefix="/call-analytics",
    tags=["Call Analytics"],
)


@router.get("/daily-call-trend")
def get_daily_call_trend_route(
    context_id: Optional[int] = Query(
        default=None,
        description="Optional active EmployeeContext ID.",
    ),

    from_date: Optional[date] = Query(
        default=None
    ),

    to_date: Optional[date] = Query(
        default=None
    ),

    employee: Employee = Depends(
        get_current_employee
    ),

    db: Session = Depends(
        get_db
    ),
):

    return get_daily_call_trend_controller(
        db=db,
        employee=employee,
        from_date=from_date,
        to_date=to_date,
        context_id=context_id,
    )