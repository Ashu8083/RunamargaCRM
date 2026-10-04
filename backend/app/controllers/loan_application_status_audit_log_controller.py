# backend/app/controllers/loan_application_status_audit_log_controller.py

from typing import Optional, List
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services.loan_application_status_audit_log_service import LoanApplicationStatusAuditLogService
from app.schemas.loan_application_status_audit_log_schema import LoanApplicationStatusAuditLogResponse


def get_loan_application_status_audit_logs_controller(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
    report_to: Optional[int] = None,
    from_status: Optional[str] = None,
    to_status: Optional[str] = None,
) -> List[LoanApplicationStatusAuditLogResponse]:
    """
    Controller to retrieve loan application status audit logs.
    """
    try:
        logs = LoanApplicationStatusAuditLogService.get_audit_logs(
            db=db,
            skip=skip,
            limit=limit,
            action=action,
            action_by=action_by,
            action_on=action_on,
            report_to=report_to,
            from_status=from_status,
            to_status=to_status,
        )
        return logs
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch loan application status audit logs: {str(e)}",
        )


def get_loan_application_status_audit_log_by_id_controller(
    db: Session,
    log_id: int,
) -> LoanApplicationStatusAuditLogResponse:
    """
    Controller to retrieve a specific loan application status audit log by ID.
    """
    log = LoanApplicationStatusAuditLogService.get_loan_application_status_audit_log_by_id(db=db, log_id=log_id)
    if not log:
        raise HTTPException(
            status_code=404,
            detail="Loan application status audit log not found",
        )
    return log
