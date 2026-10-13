from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.employee_audit_log_schema import (
    EmployeeAuditLogCreate,
    EmployeeAuditLogResponse,
)
from app.controllers.employee_audit_log_controller import (
    create_employee_audit_log_controller,
    get_employee_audit_logs_controller,
    get_employee_audit_log_by_id_controller,
)

router = APIRouter(
    prefix="/employee-audit-logs",
    tags=["Employee Audit Logs"],
)



@router.get(
    "",
    response_model=List[EmployeeAuditLogResponse],
)
def get_employee_audit_logs_route(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    action: Optional[str] = Query(None, description="Log action type: create, update, delete"),
    action_by: Optional[int] = Query(None, description="employee_context_id of employee who created / performed action"),
    action_on: Optional[int] = Query(None, description="employee_context_id of target employee"),
    report_to: Optional[int] = Query(None, description="employee_context_id of reporting manager"),
    db: Session = Depends(get_db),
):
    """
    GET route to fetch employee audit logs with optional filters.
    """
    return get_employee_audit_logs_controller(
        db=db,
        skip=skip,
        limit=limit,
        action=action,
        action_by=action_by,
        action_on=action_on,
        report_to=report_to,
    )


@router.get(
    "/{log_id}",
    response_model=EmployeeAuditLogResponse,
)
def get_employee_audit_log_by_id_route(
    log_id: int,
    db: Session = Depends(get_db),
):
    """
    GET route to fetch a specific employee audit log by ID.
    """
    return get_employee_audit_log_by_id_controller(db=db, log_id=log_id)
