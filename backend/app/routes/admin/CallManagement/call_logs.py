# backend/app/routes/admin/CallManagement/call_logs.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.employees import Employee
from app.controllers.CallManagement.call_logs_controller import (
    get_call_logs,
    get_call_history,
)
from app.core.security import get_current_employee


router = APIRouter(
    prefix="/call-logs",
    tags=["Call Logs"],
)


@router.get("")
def get_call_logs_route(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_call_logs(
        db=db,
        employee=employee,
    )


@router.get("/{phone_number}/history")
def get_call_history_route(
    phone_number: str,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_call_history(
        db=db,
        employee=employee,
        phone_number=phone_number,
    )