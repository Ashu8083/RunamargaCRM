# backend/app/routes/admin/Dashboard/application_status.py


from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.employees import Employee
from app.core.security import get_current_employee

from app.controllers.Dashboard.application_status_controller import (
    get_application_status,
)


router = APIRouter(
    prefix="/dashboard/application-status",
    tags=["Dashboard - Application Status"],
)


@router.get("")
async def get_application_status_route(
    request: Request,
    from_date: str | None = Query(default=None),
    to_date: str | None = Query(default=None),
    loan_type_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return await get_application_status(
        request=request,
        db=db,
        employee=employee,
        from_date=from_date,
        to_date=to_date,
        loan_type_id=loan_type_id,
    )