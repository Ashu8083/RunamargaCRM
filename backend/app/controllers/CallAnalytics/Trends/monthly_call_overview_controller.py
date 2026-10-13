# backend/app/controllers/CallAnalytics/Overview/monthly_call_overview_controller.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.CallAnalytics.Trends.monthly_call_overview_service import (
    CallAnalyticsMonthlyCallOverviewService,
)


class CallAnalyticsMonthlyCallOverviewController:

    @staticmethod
    def get_monthly_call_overview(
        db: Session,
        employee: Employee,
        year: int,
        month: int,
        context_id: Optional[int] = None,
    ):

        return (
            CallAnalyticsMonthlyCallOverviewService
            .get_monthly_call_overview(
                db=db,
                employee=employee,
                year=year,
                month=month,
                context_id=context_id,
            )
        )