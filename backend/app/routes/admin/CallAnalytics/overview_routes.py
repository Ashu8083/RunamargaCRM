# backend/app/routes/admin/CallAnalytics/overview_routes.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.controllers.CallAnalytics.overview_controller import (
    CallAnalyticsOverviewController,
)
from app.models.employees import Employee
from app.schemas.CallAnalytics.overview_schema import (
    CallAnalyticsOverviewResponse,
)


router = APIRouter(
    prefix="/call-analytics",
    tags=["Call Analytics"],
)


# ============================================================================
# GET /call-analytics/overview
# ============================================================================

@router.get(
    "/overview",
    response_model=CallAnalyticsOverviewResponse,
)
def get_call_analytics_overview(
    employee_id: Optional[int] = Query(
        default=None,
        description=(
            "Filter calls by selected employee ID. "
            "This value comes from the EmployeeDropdown."
        ),
    ),

    from_date: Optional[date] = Query(
        default=None,
        description=(
            "Start date for call analytics. "
            "If both dates are omitted, the current month is used."
        ),
    ),

    to_date: Optional[date] = Query(
        default=None,
        description=(
            "End date for call analytics. "
            "If both dates are omitted, the current month is used."
        ),
    ),

    call_type: Optional[str] = Query(
        default=None,
        description=(
            "Filter by call direction: incoming or outgoing."
        ),
    ),

    status: Optional[str] = Query(
        default=None,
        description=(
            "Filter by call status."
        ),
    ),

    context_id: Optional[int] = Query(
        default=None,
        description=(
            "Optional active EmployeeContext ID."
        ),
    ),

    db: Session = Depends(get_db),

    employee: Employee = Depends(
        get_current_employee
    ),
):
    """
    Return Call Analytics Overview.

    Authentication:
        get_current_employee()

    Authorization / hierarchy:
        Handled inside CallAnalyticsOverviewService using
        the authenticated employee's EmployeeContext.

    EmployeeDropdown:
        employee_id is passed as a normal filter.

    Date behavior:
        If from_date and to_date are both omitted,
        the service automatically uses the current month.
    """

    return (
        CallAnalyticsOverviewController.get_overview(
            db=db,

            # --------------------------------------------------------------
            # Authenticated employee
            # --------------------------------------------------------------
            #
            # This is the employee who is actually logged in.
            #
            employee=employee,

            # --------------------------------------------------------------
            # Selected EmployeeDropdown ID
            # --------------------------------------------------------------
            #
            # This remains a filter only.
            #
            employee_id=employee_id,

            # --------------------------------------------------------------
            # Date filters
            # --------------------------------------------------------------

            from_date=from_date,
            to_date=to_date,

            # --------------------------------------------------------------
            # Call filters
            # --------------------------------------------------------------

            call_type=call_type,
            status=status,

            # --------------------------------------------------------------
            # Active EmployeeContext
            # --------------------------------------------------------------

            context_id=context_id,
        )
    )