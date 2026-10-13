# backend/app/routes/admin/phone_number_audit_log_routes.py

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.phone_number_audit_log_schema import PhoneNumberAuditLogResponse
from app.controllers.phone_number_audit_log_controller import (
    get_phone_number_audit_logs_controller,
    get_phone_number_audit_log_by_id_controller,
)
from app.core.security import get_current_employee
from app.models.employees import Employee
router = APIRouter(
    prefix="/phone-number-audit-logs",
    tags=["Phone Number Audit Logs"],
)


@router.get(
    "",
    response_model=List[PhoneNumberAuditLogResponse],
)
def get_phone_number_audit_logs_route(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    action: Optional[str] = Query(None),
    action_by: Optional[int] = Query(None),
    action_on: Optional[int] = Query(None),
    report_to: Optional[int] = Query(None),
    phone_number_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_phone_number_audit_logs_controller(
        db=db,
        skip=skip,
        limit=limit,
        action=action,
        action_by=action_by,
        action_on=action_on,
        report_to=report_to,
        phone_number_id=phone_number_id,
    )

@router.get(
    "/{log_id}",
    response_model=PhoneNumberAuditLogResponse,
)
def get_phone_number_audit_log_by_id_route(
    log_id: int,
    db: Session = Depends(get_db),
):
    """
    GET route to fetch a specific phone number audit log by ID.
    """
    return get_phone_number_audit_log_by_id_controller(db=db, log_id=log_id)
