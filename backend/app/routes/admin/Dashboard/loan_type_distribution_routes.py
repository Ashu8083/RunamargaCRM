# backend/app/routes/admin/Dashboard/loan_type_distribution_routes.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee

from app.controllers.Dashboard.LoanTypeDistributionController import (
    LoanTypeDistributionController,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/loan-type-distribution")
async def get_loan_type_distribution(
    from_date: Optional[date] = Query(default=None),
    to_date: Optional[date] = Query(default=None),
    status: str = Query(default="In Process"),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return await LoanTypeDistributionController.get_loan_type_distribution(
        db=db,
        from_date=from_date,
        to_date=to_date,
        status=status,
    )