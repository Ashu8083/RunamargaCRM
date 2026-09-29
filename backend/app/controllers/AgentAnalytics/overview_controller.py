# backend/app/controllers/AgentAnalytics/overview_controller.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.AgentAnalytics.overview_schema import (
    AgentAnalyticsOverviewResponse,
)
from app.services.AgentAnalytics.overview_service import (
    AgentAnalyticsOverviewService,
)


class AgentAnalyticsOverviewController:
    """
    Controller for Agent Analytics Overview.

    Responsibilities:
    - Receive request parameters from the route.
    - Receive the authenticated employee.
    - Pass filters to the service.
    - Return the validated count-only response.

    The controller does not contain:
    - hierarchy logic
    - visibility logic
    - analytics logic
    - business logic
    """

    # =========================================================
    # GET OVERVIEW
    # =========================================================

    @staticmethod
    def get_overview(
        db: Session,
        employee: Employee,
        analytics_type: str,
        team_lead_context_id: Optional[int] = None,
        agent_context_id: Optional[int] = None,
        rm_context_id: Optional[int] = None,
        loan_type_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        context_id: Optional[int] = None,
    ) -> AgentAnalyticsOverviewResponse:
        """
        Get count-only Agent Analytics Overview.

        analytics_type:

            agent
                Analytics are scoped using visible Agent
                EmployeeContexts from AccessControl.

            rm
                Analytics are scoped using visible RM
                EmployeeContexts from AccessControl.

        Date behavior:

            No dates
                -> today

            Only from_date
                -> from_date

            Only to_date
                -> to_date

        The service handles:
            - AccessControl
            - visibility
            - selected filters
            - event-date logic
            - application-cohort logic
            - count calculation
        """

        # =====================================================
        # AUTHENTICATED EMPLOYEE
        # =====================================================

        if not employee:
            raise PermissionError(
                "Authenticated employee is required."
            )

        # =====================================================
        # SERVICE
        # =====================================================

        result = (
            AgentAnalyticsOverviewService.get_overview(
                db=db,
                employee=employee,

                # -------------------------------------------------
                # Analytics Type
                # -------------------------------------------------

                analytics_type=analytics_type,

                # -------------------------------------------------
                # Team Lead Filter
                # -------------------------------------------------

                team_lead_context_id=(
                    team_lead_context_id
                ),

                # -------------------------------------------------
                # Agent Filter
                # -------------------------------------------------

                agent_context_id=(
                    agent_context_id
                ),

                # -------------------------------------------------
                # RM Filter
                # -------------------------------------------------

                rm_context_id=(
                    rm_context_id
                ),

                # -------------------------------------------------
                # Loan Type
                # -------------------------------------------------

                loan_type_id=(
                    loan_type_id
                ),

                # -------------------------------------------------
                # Date Filters
                # -------------------------------------------------

                from_date=from_date,
                to_date=to_date,

                # -------------------------------------------------
                # Active EmployeeContext
                # -------------------------------------------------

                context_id=context_id,
            )
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        return AgentAnalyticsOverviewResponse(
            **result
        )