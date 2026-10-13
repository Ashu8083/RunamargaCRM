# backend/app/controllers/call_reassignment_audit_log_controller.py

from typing import Optional, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.employees import Employee
from app.services.CallManagement.call_reassignment_audit_log_service import CallReassignmentAuditLogService
from app.schemas.call_reassignment_audit_log_schema import CallReassignmentAuditLogResponse


def get_call_reassignment_audit_logs_controller(
    db: Session,
    employee:Employee,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
    report_to: Optional[int] = None,
    from_assigned_to: Optional[int] = None,
    to_assigned_to: Optional[int] = None,
    
) -> List[CallReassignmentAuditLogResponse]:
    """
    Controller to retrieve call reassignment audit logs.
    """
    try:
        logs = CallReassignmentAuditLogService.get_audit_logs(
            db=db,
            employee=employee,
            skip=skip,
            limit=limit,
            action=action,
            action_by=action_by,
            action_on=action_on,
            report_to=report_to,
            from_assigned_to=from_assigned_to,
            to_assigned_to=to_assigned_to,
        )
        return logs
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch call reassignment audit logs: {str(e)}",
        )


