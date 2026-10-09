# backend/app/routes/admin/AgentAnalytics/overview_routes.py

from datetime import date
from typing import Literal, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.controllers.AgentAnalytics.overview_controller import (
    AgentAnalyticsOverviewController,
)
from app.models.employees import Employee
from app.schemas.AgentAnalytics.overview_schema import (
    AgentAnalyticsOverviewResponse,
)


router = APIRouter(
    prefix="/agent-analytics",
    tags=["Agent Analytics"],
)


# ============================================================================
# GET /agent-analytics/overview
# ============================================================================

@router.get(
    "/overview",
    response_model=AgentAnalyticsOverviewResponse,
)
def get_agent_analytics_overview(
    # ------------------------------------------------------------------------
    # ANALYTICS TYPE
    # ------------------------------------------------------------------------

    type: Literal["agent", "rm"] = Query(
        ...,
        description=(
            "Analytics scope. "
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
    # LOAN TYPE
    # ------------------------------------------------------------------------

    loan_type_id: Optional[int] = Query(
        default=None,
        description="Filter by Loan Type ID.",
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
    """
    Return count-only Agent Analytics Overview.

    Analytics type:

        type=agent
            Uses AccessControl.get_visible_agents()
            as the primary application scope.

        type=rm
            Uses AccessControl.get_visible_rms()
            as the primary application scope.

    Authentication:
        get_current_employee()

    Authorization / Visibility:
        Handled by AgentAnalyticsOverviewService
        through AccessControl.

    Filters:
        - Team Lead
        - Agent
        - RM
        - Loan Type
        - From Date
        - To Date
        - Active EmployeeContext

    Returned sections:
        - Pipeline Insights
        - Application Pipeline
        - Applied Filters
        - Visibility

    No application detail rows are returned.
    """

    # ========================================================================
    # CONTROLLER
    # ========================================================================

    return (
        AgentAnalyticsOverviewController.get_overview(
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
            # Loan Type
            # ----------------------------------------------------------------

            loan_type_id=(
                loan_type_id
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
    )