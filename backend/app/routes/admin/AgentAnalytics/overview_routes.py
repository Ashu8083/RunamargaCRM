# backend/app/routes/admin/AgentAnalytics/overview_routes.py

from datetime import date
from typing import Optional

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
    team_lead_context_id: Optional[int] = Query(
        default=None,
        description="Filter by Team Lead EmployeeContext ID.",
    ),

    agent_context_id: Optional[int] = Query(
        default=None,
        description="Filter by Agent EmployeeContext ID.",
    ),

    rm_context_id: Optional[int] = Query(
        default=None,
        description="Filter by RM EmployeeContext ID.",
    ),

    loan_type_id: Optional[int] = Query(
        default=None,
        description="Filter by Loan Type ID.",
    ),

    from_date: Optional[date] = Query(
        default=None,
        description=(
            "Start date for Agent Analytics. "
            "If omitted with to_date, to_date is used. "
            "If both are omitted, today is used."
        ),
    ),

    to_date: Optional[date] = Query(
        default=None,
        description=(
            "End date for Agent Analytics. "
            "If omitted with from_date, from_date is used. "
            "If both are omitted, today is used."
        ),
    ),

    context_id: Optional[int] = Query(
        default=None,
        description="Optional active EmployeeContext ID.",
    ),

    db: Session = Depends(get_db),

    employee: Employee = Depends(
        get_current_employee
    ),
):
    """
    Return count-only Agent Analytics Overview.

    Authentication:
        get_current_employee()

    Authorization:
        Handled by AgentAnalyticsOverviewService
        through AccessControl.

    Returned metrics:
        - Lead Received
        - Logged In
        - Rejected
        - Sanctioned
        - Disbursed
        - Active Pipeline

    No daily analytics rows are returned.
    """

    return (
        AgentAnalyticsOverviewController.get_overview(
            db=db,
            employee=employee,

            # --------------------------------------------------------------
            # Hierarchy filters
            # --------------------------------------------------------------

            team_lead_context_id=(
                team_lead_context_id
            ),

            agent_context_id=(
                agent_context_id
            ),

            rm_context_id=(
                rm_context_id
            ),

            # --------------------------------------------------------------
            # Loan Type
            # --------------------------------------------------------------

            loan_type_id=(
                loan_type_id
            ),

            # --------------------------------------------------------------
            # Date filters
            # --------------------------------------------------------------

            from_date=from_date,
            to_date=to_date,

            # --------------------------------------------------------------
            # Active EmployeeContext
            # --------------------------------------------------------------

            context_id=context_id,
        )
    )