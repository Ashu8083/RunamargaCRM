# backend\app\routes\admin\AgentAnalytics\trends_routes.py
from datetime import date
from typing import Literal, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controllers.AgentAnalytics.trends_controller import (
    AgentAnalyticsTrendsController,
)
from app.core.security import get_current_employee
from app.models.employees import Employee
from app.schemas.AgentAnalytics.trends_schema import (
    AgentAnalyticsTrendsResponse,
)


router = APIRouter(
    prefix="/agent-analytics",
    tags=["Agent Analytics"],
)


@router.get(
    "/trends",
    response_model=AgentAnalyticsTrendsResponse,
)
def get_agent_analytics_trends(
    type: Literal["agent", "rm"] = Query(...),

    team_lead_context_id: Optional[int] = Query(
        default=None
    ),

    agent_context_id: Optional[int] = Query(
        default=None
    ),

    rm_context_id: Optional[int] = Query(
        default=None
    ),

    loan_type_id: Optional[int] = Query(
        default=None
    ),

    from_date: Optional[date] = Query(
        default=None
    ),

    to_date: Optional[date] = Query(
        default=None
    ),

    context_id: Optional[int] = Query(
        default=None
    ),

    db: Session = Depends(get_db),

    employee: Employee = Depends(
        get_current_employee
    ),
):
    return AgentAnalyticsTrendsController.get_trends(
        db=db,
        employee=employee,
        analytics_type=type,
        team_lead_context_id=team_lead_context_id,
        agent_context_id=agent_context_id,
        rm_context_id=rm_context_id,
        loan_type_id=loan_type_id,
        from_date=from_date,
        to_date=to_date,
        context_id=context_id,
    )   