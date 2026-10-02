# backend/app/controllers/CallAnalytics/Trends/daily_call_trend_controller.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee

from app.services.CallAnalytics.Trends.daily_call_trend_service import (
    CallAnalyticsDailyCallTrendService,
)


def get_daily_call_trend(
    db: Session,
    employee: Employee,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    context_id: Optional[int] = None,
):

    return (
        CallAnalyticsDailyCallTrendService
        .get_daily_call_trend(
            db=db,
            employee=employee,
            from_date=from_date,
            to_date=to_date,
            context_id=context_id,
        )
    )