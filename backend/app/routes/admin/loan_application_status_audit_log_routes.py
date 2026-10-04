# backend/app/routes/admin/loan_application_status_audit_log_routes.py

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.loan_application_status_audit_log_schema import LoanApplicationStatusAuditLogResponse
from app.controllers.loan_application_status_audit_log_controller import (
    get_loan_application_status_audit_logs_controller,
    get_loan_application_status_audit_log_by_id_controller,
)

router = APIRouter(
    prefix="/loan-application-status-audit-logs",
    tags=["Loan Application Status Audit Logs"],
)


@router.get(
    "",
    response_model=List[LoanApplicationStatusAuditLogResponse],
)
def get_loan_application_status_audit_logs_route(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    action: Optional[str] = Query(None, description="Log action type"),
    action_by: Optional[int] = Query(None, description="employee_context_id of employee performing action"),
    action_on: Optional[int] = Query(None, description="loan_application_id of target loan application"),
    report_to: Optional[int] = Query(None, description="employee_context_id of reporting manager"),
    from_status: Optional[str] = Query(None, description="Status before the change"),
    to_status: Optional[str] = Query(None, description="Status after the change"),
    db: Session = Depends(get_db),
):
    """
    GET route to fetch loan application status audit logs with optional filters.
    """
    return get_loan_application_status_audit_logs_controller(
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


@router.get(
    "/{log_id}",
    response_model=LoanApplicationStatusAuditLogResponse,
)
def get_loan_application_status_audit_log_by_id_route(
    log_id: int,
    db: Session = Depends(get_db),
):
    """
    GET route to fetch a specific loan application status audit log by ID.
    """
    return get_loan_application_status_audit_log_by_id_controller(db=db, log_id=log_id)
