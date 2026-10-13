# backend/app/controllers/phone_number_audit_log_controller.py

from typing import Optional, List
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services.phone_number_audit_log_service import PhoneNumberAuditLogService
from app.schemas.phone_number_audit_log_schema import PhoneNumberAuditLogResponse


def get_phone_number_audit_logs_controller(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
    report_to: Optional[int] = None,
    phone_number_id: Optional[int] = None,
) -> List[PhoneNumberAuditLogResponse]:
    """
    Controller to retrieve phone number audit logs.
    """
    try:
        logs = PhoneNumberAuditLogService.get_audit_logs(
            db=db,
            skip=skip,
            limit=limit,
            action=action,
            action_by=action_by,
            action_on=action_on,
            report_to=report_to,
            phone_number_id=phone_number_id,
        )
        return logs
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch phone number audit logs: {str(e)}",
        )


def get_phone_number_audit_log_by_id_controller(
    db: Session,
    log_id: int,
) -> PhoneNumberAuditLogResponse:
    """
    Controller to retrieve a specific phone number audit log by ID.
    """
    log = PhoneNumberAuditLogService.get_audit_log_by_id(db=db, log_id=log_id)
    if not log:
        raise HTTPException(
            status_code=404,
            detail="Phone number audit log not found",
        )
    return log
