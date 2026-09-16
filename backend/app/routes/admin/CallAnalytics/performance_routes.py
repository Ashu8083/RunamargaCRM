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
            "Filter performance by selected employee ID. "
            "This value comes from the Agent/Employee dropdown."
        ),
    ),

    from_date: Optional[date] = Query(
        default=None,
        description=(
            "Start date for call performance. "
            "If both dates are omitted, the current month is used."
        ),
    ),

    to_date: Optional[date] = Query(
        default=None,
        description=(
            "End date for call performance. "
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
    Return Call Analytics Performance.

    Authentication:
        get_current_employee()

    Authorization / hierarchy:
        Handled inside CallAnalyticsPerformanceService using
        the authenticated employee's EmployeeContext.

    Employee filter:
        employee_id is passed as a normal selected-agent filter
        after hierarchy visibility is determined by the service.

    Date behavior:
        If from_date and to_date are both omitted,
        the service automatically uses the current month.

    Call filters:
        call_type and status are applied to call metrics.

    Context:
        context_id represents the active EmployeeContext ID.
    """

    return (
        CallAnalyticsPerformanceController.get_performance(
            db=db,

            # --------------------------------------------------------------
            # Authenticated employee
            # --------------------------------------------------------------
            #
            # This is the employee who is actually logged in.
            #
            employee=employee,

            # --------------------------------------------------------------
            # Selected Employee / Agent ID
            # --------------------------------------------------------------
            #
            # This remains a filter.
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