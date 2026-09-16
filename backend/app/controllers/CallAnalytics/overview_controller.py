# backend/app/controllers/CallAnalytics/overview_controller.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.CallAnalytics.overview_schema import (
    CallAnalyticsOverviewResponse,
)
from app.services.CallAnalytics.overview_service import (
    CallAnalyticsOverviewService,
)


class CallAnalyticsOverviewController:
    """
    Controller for Call Analytics Overview.

    Responsibilities:
    - Receive request parameters from the route.
    - Receive the authenticated employee.
    - Pass the authenticated employee identity to the service.
    - Pass the selected EmployeeDropdown ID as a normal filter.
    - Return the validated response schema.

    The controller does not implement business logic.
    """

    # =========================================================
    # GET OVERVIEW
    # =========================================================

    @staticmethod
    def get_overview(
        db: Session,
        employee: Employee,
        employee_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        call_type: Optional[str] = None,
        status: Optional[str] = None,
        context_id: Optional[int] = None,
    ) -> CallAnalyticsOverviewResponse:
        """
        Get Call Analytics Overview for the authenticated employee.

        employee:
            The employee who is currently logged in.

        employee_id:
            The employee selected in the EmployeeDropdown.
            This is only a filter and does not determine
            authorization.

        from_date / to_date:
            Optional date filters.
            If both are omitted, the service automatically
            uses the current month.

        call_type:
            Optional incoming/outgoing filter.

        status:
            Optional call status filter.

        context_id:
            Optional active EmployeeContext selector.
        """

        # =====================================================
        # AUTHENTICATED EMPLOYEE
        # =====================================================

        if not employee:
            raise PermissionError(
                "Authenticated employee is required."
            )

        # =====================================================
        # CALL ANALYTICS SERVICE
        # =====================================================

        result = (
            CallAnalyticsOverviewService.get_overview(
                db=db,

                # -------------------------------------------------
                # Selected EmployeeDropdown value
                # -------------------------------------------------
                #
                # This remains a normal filter.
                #
                # It is NOT used as the authenticated employee.
                #
                employee_id=employee_id,

                # -------------------------------------------------
                # Date filters
                # -------------------------------------------------

                from_date=from_date,
                to_date=to_date,

                # -------------------------------------------------
                # Call filters
                # -------------------------------------------------

                call_type=call_type,
                status=status,

                # -------------------------------------------------
                # Authenticated employee
                # -------------------------------------------------
                #
                # The service uses this to determine hierarchy
                # visibility from EmployeeContext.
                #
                logged_in_employee_id=employee.id,

                # -------------------------------------------------
                # Optional active EmployeeContext
                # -------------------------------------------------

                context_id=context_id,
            )
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        return CallAnalyticsOverviewResponse(
            **result
        )