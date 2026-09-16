# Path: backend/app/controllers/CallAnalytics/Trends/ad_number_trend_controller.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.CallAnalytics.Trends.ad_number_trend_schema import (
    CallAnalyticsAdNumberTrendResponse,
)
from app.services.CallAnalytics.Trends.ad_number_trend_service import (
    CallAnalyticsAdNumberTrendService,
)


def get_ad_number_trend(
    db: Session,
    employee: Employee,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    phone_id: Optional[int] = None,
    team_lead_id: Optional[int] = None,
    rm_id: Optional[int] = None,
) -> CallAnalyticsAdNumberTrendResponse:
    return CallAnalyticsAdNumberTrendService.get_trend(
        db=db,
        employee=employee,
        from_date=from_date,
        to_date=to_date,
        phone_id=phone_id,
        team_lead_id=team_lead_id,
        rm_id=rm_id,
    )