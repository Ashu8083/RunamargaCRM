# backend/app/controllers/loan_application_audit_log_controller.py

from typing import Optional, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.employees import Employee
from app.services.loan_application_audit_log_service import LoanApplicationAuditLogService
from app.schemas.loan_application_audit_log_schema import LoanApplicationAuditLogResponse


def get_loan_application_audit_logs_controller(
    db: Session,
    employee: Employee,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
    report_to: Optional[int] = None,
) -> List[LoanApplicationAuditLogResponse]:
    try:
        logs = LoanApplicationAuditLogService.get_audit_logs(
            db=db,
            employee=employee,
            skip=skip,
            limit=limit,
            action=action,
            action_by=action_by,
            action_on=action_on,
            report_to=report_to,
        )

        return [
            LoanApplicationAuditLogResponse(
                id=log.id,
                action=log.action,
                action_by_id=log.action_by_id,
                loan_application_id=log.loan_application_id,
                report_to_id=log.report_to_id,
                performer_name=(
                    log.performer.employee.name
                    if log.performer and log.performer.employee
                    else None
                ),
                report_to_name=(
                    log.reporting_manager.employee.name
                    if log.reporting_manager
                    and log.reporting_manager.employee
                    else None
                ),
                loan_application_phone=(
                    str(log.loan_application.phone)
                    if log.loan_application
                    and log.loan_application.phone is not None
                    else None
                ),
                date_and_time=log.date_and_time,
                deleted_at=log.deleted_at,
            )
            for log in logs
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch loan application audit logs: {str(e)}",
        )