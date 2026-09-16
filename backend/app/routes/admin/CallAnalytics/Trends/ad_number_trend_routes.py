# Path: backend/app/routes/admin/CallAnalytics/Trends/ad_number_trend_routes.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.controllers.CallAnalytics.Trends.ad_number_trend_controller import (
    get_ad_number_trend,
)
from app.models.employees import Employee
from app.schemas.CallAnalytics.Trends.ad_number_trend_schema import (
    CallAnalyticsAdNumberTrendResponse,
)


router = APIRouter(
    prefix="/call-analytics",
    tags=["Call Analytics"],
)


@router.get(
    "/trends/ad-number",
    response_model=CallAnalyticsAdNumberTrendResponse,
)
def get_ad_number_trend_route(
    team_lead_id: Optional[int] = Query(
        default=None
    ),
    rm_id: Optional[int] = Query(
        default=None
    ),
    phone_id: Optional[int] = Query(
        default=None
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
    return get_ad_number_trend(
        db=db,
        employee=employee,
        from_date=from_date,
        to_date=to_date,
        phone_id=phone_id,
        team_lead_id=team_lead_id,
        rm_id=rm_id,
    )