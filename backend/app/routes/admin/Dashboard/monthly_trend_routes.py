# backend/app/routes/admin/Dashboard/monthly_trend_routes.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee

from app.controllers.Dashboard.MonthlyTrendController import (
    MonthlyTrendController,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/monthly-trend")
async def get_monthly_trend(
    period: int = Query(default=3),
    context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return await MonthlyTrendController.get_monthly_trend(
        db=db,
        employee=employee,
        context_id=context_id,
        period=period,
    )