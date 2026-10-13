
# Path: backend/app/routes/admin/CallAnalytics/Trends/performance_trend_routes.py

from datetime import date
from typing import Optional, Literal
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.models.phone_numbers import PhoneNumber
from app.config.database import get_db
from app.core.security import get_current_employee
from app.controllers.CallAnalytics.Trends.performance_trend_controller import (
    get_performance_trend,
)
from app.models.employees import Employee


router = APIRouter(
    prefix="/call-analytics",
    tags=["Call Analytics"],

)
@router.get(
    "/trends/performance",
)
def get_performance_trend_route(
    
    type: Literal["agent", "rm"] = Query(
        ...,
        description=(
            "Call Analytics scope. "
            "'agent' uses visible Agent contexts. "
            "'rm' uses visible RM contexts."
        ),
    ),

    # ------------------------------------------------------------------------
    # TEAM LEAD
    # ------------------------------------------------------------------------

    team_lead_context_id: Optional[int] = Query(
        default=None,
        description="Filter by Team Lead EmployeeContext ID.",
    ),

    # ------------------------------------------------------------------------
    # AGENT
    # ------------------------------------------------------------------------

    agent_context_id: Optional[int] = Query(
        default=None,
        description="Filter by Agent EmployeeContext ID.",
    ),

    # ------------------------------------------------------------------------
    # RM
    # ------------------------------------------------------------------------

    rm_context_id: Optional[int] = Query(
        default=None,
        description="Filter by RM EmployeeContext ID.",
    ),

  
    # ------------------------------------------------------------------------
    # FROM DATE
    # ------------------------------------------------------------------------

    from_date: Optional[date] = Query(
        default=None,
        description=(
            "Start date for Agent Analytics. "
            "If omitted with to_date, to_date is used. "
            "If both are omitted, today is used."
        ),
    ),

    # ------------------------------------------------------------------------
    # TO DATE
    # ------------------------------------------------------------------------

    to_date: Optional[date] = Query(
        default=None,
        description=(
            "End date for Agent Analytics. "
            "If omitted with from_date, from_date is used. "
            "If both are omitted, today is used."
        ),
    ),

    # ------------------------------------------------------------------------
    # ACTIVE CONTEXT
    # ------------------------------------------------------------------------

    context_id: Optional[int] = Query(
        default=None,
        description="Optional active EmployeeContext ID.",
    ),

    # ------------------------------------------------------------------------
    # DATABASE
    # ------------------------------------------------------------------------

    db: Session = Depends(get_db),

    # ------------------------------------------------------------------------
    # AUTHENTICATED EMPLOYEE
    # ------------------------------------------------------------------------

    employee: Employee = Depends(
        get_current_employee
    ),
):
    return get_performance_trend(
            db=db,
            employee=employee,

            # ----------------------------------------------------------------
            # Analytics Type
            # ----------------------------------------------------------------

            analytics_type=type,

            # ----------------------------------------------------------------
            # Team Lead
            # ----------------------------------------------------------------

            team_lead_context_id=(
                team_lead_context_id
            ),

            # ----------------------------------------------------------------
            # Agent
            # ----------------------------------------------------------------

            agent_context_id=(
                agent_context_id
            ),

            # ----------------------------------------------------------------
            # RM
            # ----------------------------------------------------------------

            rm_context_id=(
                rm_context_id
            ),

            

            # ----------------------------------------------------------------
            # Dates
            # ----------------------------------------------------------------

            from_date=from_date,
            to_date=to_date,

            # ----------------------------------------------------------------
            # Active Context
            # ----------------------------------------------------------------

            context_id=context_id,
        )
    