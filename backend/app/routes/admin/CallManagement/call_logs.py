# backend/app/routes/admin/CallManagement/call_logs.py

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controllers.CallManagement.call_logs_controller import (
    get_call_history,
    get_call_logs,
)
from app.core.security import get_current_employee
from app.models.employees import Employee


router = APIRouter(
    prefix="/call-logs",
    tags=["Call Logs"],
)


@router.get("")
def get_call_logs_route(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(10),
    search: Optional[str] = Query(None),
    agent_id: Optional[int] = Query(None),
    call_type: Optional[str] = Query(None),
    mobile_status: Optional[str] = Query(None),
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_call_logs(
        db=db,
        employee=employee,
        context_id=getattr(
            request.state,
            "employee_context_id",
            None,
        ),
        search=search,
        page=page,
        page_size=page_size,
        agent_id=agent_id,
        call_type=call_type,
        mobile_status=mobile_status,
        from_date=from_date,
        to_date=to_date,
    )


@router.get("/{phone_number}/history")
def get_call_history_route(
    phone_number: str,
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(10),
    search: Optional[str] = Query(None),
    agent_id: Optional[int] = Query(None),
    call_type: Optional[str] = Query(None),
    mobile_status: Optional[str] = Query(None),
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_call_history(
        db=db,
        employee=employee,
        phone_number=phone_number,
        context_id=getattr(
            request.state,
            "employee_context_id",
            None,
        ),
        search=search,
        page=page,
        page_size=page_size,
        agent_id=agent_id,
        call_type=call_type,
        mobile_status=mobile_status,
        from_date=from_date,
        to_date=to_date,
    )
