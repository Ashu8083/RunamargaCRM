# backend/app/routes/CallAnalytics/Overview/monthly_call_overview_routes.py

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controllers.CallAnalytics.Trends.monthly_call_overview_controller import (
    CallAnalyticsMonthlyCallOverviewController,
)

from app.models.employees import Employee

# Use your existing authenticated-employee dependency here.
# Replace the import below with the same dependency used by
# your Daily Call Trend route.

from app.core.security import get_current_employee


router = APIRouter(
    prefix="/call-analytics",
    tags=["Call Analytics"],
)


@router.get(
    "/monthly-call-overview"
)
def get_monthly_call_overview(
    year: int = Query(...),
    month: int = Query(...),

    context_id: Optional[int] = Query(
        default=None
    ),

    db: Session = Depends(get_db),

    employee: Employee = Depends(
        get_current_employee
    ),
):

    return (
        CallAnalyticsMonthlyCallOverviewController
        .get_monthly_call_overview(
            db=db,
            employee=employee,
            year=year,
            month=month,
            context_id=context_id,
        )
    )