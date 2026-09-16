# backend/app/controllers/CallAnalytics/performance_controller.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.CallAnalytics.performance_schema import (
    CallAnalyticsPerformanceResponse,
)
from app.services.CallAnalytics.performance_service import (
    CallAnalyticsPerformanceService,
)


class CallAnalyticsPerformanceController:
    """
    Controller for Call Analytics Performance.

    Responsibilities:
    - Receive the authenticated employee.
    - Pass request filters to the service.
    - Convert the service result into the response schema.
    """

    # =========================================================
    # GET PERFORMANCE
    # =========================================================

    @staticmethod
    def get_performance(
        db: Session,
        employee: Employee,
        employee_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        call_type: Optional[str] = None,
        status: Optional[str] = None,
        context_id: Optional[int] = None,
    ) -> CallAnalyticsPerformanceResponse:

        # -----------------------------------------------------
        # AUTHENTICATED EMPLOYEE
        # -----------------------------------------------------

        if not employee:
            raise PermissionError(
                "Authenticated employee is required."
            )

        # -----------------------------------------------------
        # SERVICE
        # -----------------------------------------------------

        result = (
            CallAnalyticsPerformanceService
            .get_performance(
                db=db,
                employee=employee,
                employee_id=employee_id,
                from_date=from_date,
                to_date=to_date,
                direction=call_type,
                status=status,
                context_id=context_id,
            )
        )

        # -----------------------------------------------------
        # RESPONSE
        # -----------------------------------------------------

        return CallAnalyticsPerformanceResponse(
            **result
        )