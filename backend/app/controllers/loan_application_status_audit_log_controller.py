# backend/app/controllers/loan_application_status_audit_log_controller.py

from typing import Optional, List
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.loan_application_status_audit_log_service import LoanApplicationStatusAuditLogService
from app.schemas.loan_application_status_audit_log_schema import LoanApplicationStatusAuditLogResponse


def get_loan_application_status_audit_logs_controller(
    db: Session,
    employee:Employee,
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
            employee=employee,
            skip=skip,
            limit=limit,
            action=action,
            action_by=action_by,
            action_on=action_on,
            report_to=report_to,
            from_status=from_status,
            to_status=to_status,
        )
        return [
            {
                "id": log.id,
                "action": log.action,

                # Keep IDs in the API for filtering
                "action_by_id": log.action_by_id,
                "loan_application_id": log.loan_application_id,
                "report_to_id": log.report_to_id,

                # Employee who performed the status change
                "performer_name": (
                    log.performer.employee.name
                    if log.performer and log.performer.employee
                    else None
                ),

                "performer_phone": (
                    log.performer.employee.phone
                    if (
                        log.performer
                        and log.performer.employee
                    )
                    else None
                ),

                # Reporting manager's name
                "report_to_name": (
                    log.reporting_manager.employee.name
                    if (
                        log.reporting_manager
                        and log.reporting_manager.employee
                    )
                    else None
                ),

                # Status information
                "from_status": log.from_status,
                "to_status": log.to_status,

                "date_and_time": log.date_and_time,
                "deleted_at": log.deleted_at,
            }
            for log in logs
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch loan application status audit logs: {str(e)}",
        )


