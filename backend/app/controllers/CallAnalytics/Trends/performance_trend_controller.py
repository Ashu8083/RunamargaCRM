# Path: backend/app/controllers/CallAnalytics/Trends/performance_trend_controller.py

from datetime import date
from typing import Literal, Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.CallAnalytics.Trends.performance_trend_service import (
    CallAnalyticsPerformanceTrendService,
)


def get_performance_trend(
    db: Session,
    employee: Employee,
    analytics_type: Literal["agent", "rm"],
    team_lead_context_id: Optional[int] = None,
    agent_context_id: Optional[int] = None,
    rm_context_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    context_id: Optional[int] = None,
):

    return (
        CallAnalyticsPerformanceTrendService
        .get_performance_trend(
            db=db,
            employee=employee,
            analytics_type=analytics_type,
            team_lead_context_id=team_lead_context_id,
            agent_context_id=agent_context_id,
            rm_context_id=rm_context_id,
            from_date=from_date,
            to_date=to_date,
            context_id=context_id,
        )
    )