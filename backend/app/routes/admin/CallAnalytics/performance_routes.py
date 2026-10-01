# backend/app/routes/admin/CallAnalytics/performance_routes.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.controllers.CallAnalytics.performance_controller import (
    CallAnalyticsPerformanceController,
)
from app.models.employees import Employee
from app.schemas.CallAnalytics.performance_schema import (
    CallAnalyticsPerformanceResponse,
)


router = APIRouter(
    prefix="/call-analytics",
    tags=["Call Analytics"],
)


# ============================================================================
# GET /call-analytics/performance
# ============================================================================

@router.get(
    "/performance",
    response_model=CallAnalyticsPerformanceResponse,
)
def get_call_analytics_performance(
    employee_id: Optional[int] = Query(
        default=None,
        description=(
            "Optional Employee.id filter. "
            "The selected employee must be visible to the "
            "authenticated employee."
        ),
    ),

    from_date: Optional[date] = Query(
        default=None,
        description=(
            "Start date for performance analytics. "
            "If both from_date and to_date are omitted, "
            "TODAY is used."
        ),
    ),

    to_date: Optional[date] = Query(
        default=None,
        description=(
            "End date for performance analytics. "
            "If both from_date and to_date are omitted, "
            "TODAY is used."
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

    db: Session = Depends(
        get_db
    ),

    employee: Employee = Depends(
        get_current_employee
    ),
):
    """
    Return Call Analytics Performance.

    Authentication:
        get_current_employee()

    Authorization:
        Handled by CallAnalyticsPerformanceService through
        AccessControl.

    Employee filter:
        employee_id is the Employee.id selected from the
        Agent/RM dropdown.

    Date behavior:
        No dates supplied:
            TODAY -> TODAY

        Explicit dates:
            supplied date range is used.

    Performance is calculated independently for every visible
    Agent/RM.

    Context:
        context_id represents the active EmployeeContext.
    """

    return (
        CallAnalyticsPerformanceController
        .get_performance(
            db=db,

            # --------------------------------------------------------------
            # AUTHENTICATED EMPLOYEE
            # --------------------------------------------------------------

            employee=employee,

            # --------------------------------------------------------------
            # SELECTED EMPLOYEE
            # --------------------------------------------------------------

            employee_id=employee_id,

            # --------------------------------------------------------------
            # DATE FILTERS
            # --------------------------------------------------------------

            from_date=from_date,
            to_date=to_date,

            # --------------------------------------------------------------
            # CALL FILTERS
            # --------------------------------------------------------------

            call_type=call_type,
            status=status,

            # --------------------------------------------------------------
            # ACTIVE CONTEXT
            # --------------------------------------------------------------

            context_id=context_id,
        )
    )