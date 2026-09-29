from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.schemas.employee_audit_log_schema import (
    EmployeeAuditLogCreate,
    EmployeeAuditLogResponse,
)
from app.services.employee_audit_log_service import (
    create_employee_audit_log,
    get_employee_audit_logs,
    get_employee_audit_log_by_id,
)


def create_employee_audit_log_controller(
    db: Session,
    log_data: EmployeeAuditLogCreate,
) -> EmployeeAuditLogResponse:
    """
    Controller to create a new employee audit log entry.
    """
    return create_employee_audit_log(db=db, log_data=log_data, commit=True)


def get_employee_audit_logs_controller(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
    report_to: Optional[int] = None,
) -> List[EmployeeAuditLogResponse]:
    """
    Controller to fetch list of employee audit logs.
    """
    return get_employee_audit_logs(
        db=db,
        skip=skip,
        limit=limit,
        action=action,
        action_by=action_by,
        action_on=action_on,
        report_to=report_to,
    )


def get_employee_audit_log_by_id_controller(
    db: Session,
    log_id: int,
) -> EmployeeAuditLogResponse:
    """
    Controller to fetch a specific employee audit log by ID.
    """
    log_entry = get_employee_audit_log_by_id(db=db, log_id=log_id)
    if not log_entry:
        raise HTTPException(
            status_code=404,
            detail="Employee audit log not found",
        )
    return log_entry
