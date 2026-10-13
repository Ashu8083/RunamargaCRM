from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.call_assignment_audit_logs import CallAssignmentAuditLogs
from app.services.CallManagement.call_assignment_audit_log_service import (
    CallAssignmentAuditLogService,
)


def _serialize_log(log: CallAssignmentAuditLogs) -> dict:
    assigned_to = log.target
    assigned_by = log.performer
    reporting_manager = log.reporting_manager
    assigned_phone = log.target_phone_number

    return {
        "id": log.id,
        "action": log.action,
        "customer_phone": log.customer_phone,

        "assigned_to_id": log.assigned_to_id,
        "assigned_to_name": (
            assigned_to.employee.name
            if assigned_to and assigned_to.employee
            else None
        ),

        "assigned_by_id": log.assigned_by_id,
        "assigned_by_name": (
            assigned_by.employee.name
            if assigned_by and assigned_by.employee
            else None
        ),

        "report_to_id": log.report_to_id,
        "report_to_name": (
            reporting_manager.employee.name
            if reporting_manager and reporting_manager.employee
            else None
        ),

        "assigned_to_phone": log.assigned_to_phone,
        "assigned_phone": (
            getattr(assigned_phone, "phone_number", None)
            or getattr(assigned_phone, "phone", None)
            if assigned_phone
            else None
        ),

        "date_and_time": log.date_and_time,
        "deleted_at": log.deleted_at,
    }


def get_call_assignment_audit_logs_controller(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
    report_to: Optional[int] = None,
) -> list[dict]:
    try:
        logs = CallAssignmentAuditLogService.get_audit_logs(
            db=db,
            skip=skip,
            limit=limit,
            action=action,
            action_by=action_by,
            action_on=action_on,
            report_to=report_to,
        )
        return [_serialize_log(log) for log in logs]

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch call assignment audit logs.",
        ) from exc


def get_call_assignment_audit_log_by_id_controller(
    db: Session,
    log_id: int,
) -> dict:
    log = CallAssignmentAuditLogService.get_employee_audit_log_by_id(
        db=db,
        log_id=log_id,
    )

    if not log:
        raise HTTPException(
            status_code=404,
            detail="Call assignment audit log not found.",
        )

    return _serialize_log(log)