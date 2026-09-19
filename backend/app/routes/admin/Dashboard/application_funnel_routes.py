# backend/app/routes/admin/Dashboard/application_funnel_routes.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee

from app.controllers.Dashboard.ApplicationFunnelController import (
    ApplicationFunnelController,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/application-funnel")
async def get_application_funnel(
    context_id: int | None = Query(default=None),   
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    loan_type: Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return await ApplicationFunnelController.get_application_funnel(
        db=db,
        employee=employee,
        context_id=context_id,
        from_date=from_date,
        to_date=to_date,
        loan_type=loan_type,
    )