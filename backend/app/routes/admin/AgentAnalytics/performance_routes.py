# backend/app/routes/AgentAnalytics/performance.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.controllers.AgentAnalytics.performance_controller import (
    AgentAnalyticsPerformanceController,
)
from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee
from app.schemas.AgentAnalytics.performance_schema import (
    AgentAnalyticsPerformanceResponse,
)

router = APIRouter(
    prefix="/agent-analytics",
    tags=["Agent Analytics"],
)


@router.get(
    "/performance",
    response_model=AgentAnalyticsPerformanceResponse,
)
def get_performance(
    analytics_type: str = Query(
        default="agent",
        description="Analytics type: agent or rm",
    ),
    team_lead_context_id: Optional[int] = Query(
        default=None,
    ),
    agent_context_id: Optional[int] = Query(
        default=None,
    ),
    rm_context_id: Optional[int] = Query(
        default=None,
    ),
    loan_type_id: Optional[int] = Query(
        default=None,
    ),
    from_date: Optional[date] = Query(
        default=None,
    ),
    to_date: Optional[date] = Query(
        default=None,
    ),
    context_id: Optional[int] = Query(
        default=None,
    ),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return AgentAnalyticsPerformanceController.get_performance(
        db=db,
        employee=employee,
        analytics_type=analytics_type,
        team_lead_context_id=team_lead_context_id,
        agent_context_id=agent_context_id,
        rm_context_id=rm_context_id,
        loan_type_id=loan_type_id,
        from_date=from_date,
        to_date=to_date,
        context_id=context_id,
    )