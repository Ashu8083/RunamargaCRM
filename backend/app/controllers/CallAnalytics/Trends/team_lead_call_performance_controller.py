# backend/app/controllers/CallAnalytics/Trends/team_lead_call_performance_controller.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.CallAnalytics.Trends.team_lead_call_performance_service import (
    CallAnalyticsTeamLeadCallPerformanceService,
)


from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee

from app.services.CallAnalytics.Trends.team_lead_call_performance_service import (
    CallAnalyticsTeamLeadCallPerformanceService,
)


def get_team_lead_call_performance(
    db: Session,
    employee: Employee,
    team_lead_context_id: Optional[int] = None,
    agent_context_id: Optional[int] = None,
    rm_context_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    context_id: Optional[int] = None,
):
    return (
        CallAnalyticsTeamLeadCallPerformanceService
        .get_performance(
            db=db,
            employee=employee,
            team_lead_context_id=team_lead_context_id,
            agent_context_id=agent_context_id,
            rm_context_id=rm_context_id,
            from_date=from_date,
            to_date=to_date,
            context_id=context_id,
        )
    )