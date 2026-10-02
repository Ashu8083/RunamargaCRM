
# Path: backend/app/routes/admin/CallAnalytics/Trends/team_lead_call_performance_routes.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.controllers.CallAnalytics.Trends.team_lead_call_performance_controller import (
    get_team_lead_call_performance,
)
from app.models.employees import Employee


router = APIRouter(
    prefix="/call-analytics",
    tags=["Call Analytics"],
)


@router.get("/team-lead-performance")
def get_team_lead_call_performance_route(
    team_lead_context_id: Optional[int] = Query(
        default=None
    ),
    agent_context_id: Optional[int] = Query(
        default=None
    ),
    rm_context_id: Optional[int] = Query(
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
    employee: Employee = Depends(get_current_employee),
):
    return get_team_lead_call_performance(
        db=db,
        employee=employee,
        team_lead_context_id=team_lead_context_id,
        agent_context_id=agent_context_id,
        rm_context_id=rm_context_id,
        from_date=from_date,
        to_date=to_date,
        context_id=context_id,
    )