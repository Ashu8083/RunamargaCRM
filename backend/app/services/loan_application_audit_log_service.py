# backend/app/services/loan_application_audit_log_service.py

from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.employee_contexts import EmployeeContext
from app.models.loan_applications import LoanApplication
from app.models.loan_application_audit_logs import LoanApplicationAuditLog
from app.services.auditl_log_service import AuditLogService


class LoanApplicationAuditLogService(AuditLogService[LoanApplicationAuditLog]):

    @staticmethod
    def log_audit_log(
        db: Session,
        action: Optional[str] = None,
        action_by: Optional[int] = None,   # employee_context_id performing action
        action_on: Optional[int] = None,   # loan_application_id target
        report_to: Optional[int] = None,   # employee_context_id of reporting manager
        date_and_time: Optional[datetime] = None,
        delete: Optional[datetime] = None,
        commit: bool = False,
    ) -> LoanApplicationAuditLog:
        """
        Creates an audit log entry for loan application operations/status changes.
        Stores employee_context_id for action_by and report_to (NOT employee_id).
        Auto-resolves report_to from EmployeeContext hierarchy if not explicitly provided.
        """
        # Auto-resolve report_to (manager's employee_context_id)
        if report_to is None:
            if action_by:
                # 1. Try matching action_by directly as employee_context_id
                performer_ctx = (
                    db.query(EmployeeContext)
                    .filter(
                        EmployeeContext.id == action_by,
                        EmployeeContext.deleted_at.is_(None),
                    )
                    .first()
                )
                # Fallback: if caller passed employee_id instead of context_id
                if not performer_ctx:
                    performer_ctx = (
                        db.query(EmployeeContext)
                        .filter(
                            EmployeeContext.employee_id == action_by,
                            EmployeeContext.deleted_at.is_(None),
                        )
                        .first()
                    )

                if performer_ctx and performer_ctx.reports_to_id:
                    report_to = performer_ctx.reports_to_id

            # 2. If report_to is still None, try resolving via target loan application context
            if report_to is None and action_on:
                loan_app = (
                    db.query(LoanApplication)
                    .filter(
                        LoanApplication.id == action_on,
                        LoanApplication.deleted_at.is_(None),
                    )
                    .first()
                )
                if loan_app:
                    target_ctx_id = loan_app.agent_context_id or loan_app.applied_by_context_id or loan_app.rm_context_id
                    if target_ctx_id:
                        target_ctx = (
                            db.query(EmployeeContext)
                            .filter(
                                EmployeeContext.id == target_ctx_id,
                                EmployeeContext.deleted_at.is_(None),
                            )
                            .first()
                        )
                        if target_ctx and target_ctx.reports_to_id:
                            report_to = target_ctx.reports_to_id

        log_entry = LoanApplicationAuditLog(
            action=action,
            action_by_id=action_by,
            loan_application_id=action_on,
            report_to_id=report_to,
            date_and_time=date_and_time or datetime.now(),
            deleted_at=delete,
        )
        db.add(log_entry)

        if commit:
            db.commit()
            db.refresh(log_entry)

        return log_entry

    @staticmethod
    def get_audit_logs(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        action: Optional[str] = None,
        action_by: Optional[int] = None,
        action_on: Optional[int] = None,
        report_to: Optional[int] = None,
    ) -> List[LoanApplicationAuditLog]:
        """
        Retrieves loan application audit logs with optional filtering.
        """
        query = db.query(LoanApplicationAuditLog).filter(LoanApplicationAuditLog.deleted_at.is_(None))

        if action:
            query = query.filter(LoanApplicationAuditLog.action == action)
        if action_by:
            query = query.filter(LoanApplicationAuditLog.action_by_id == action_by)
        if action_on:
            query = query.filter(LoanApplicationAuditLog.loan_application_id == action_on)
        if report_to:
            query = query.filter(LoanApplicationAuditLog.report_to_id == report_to)

        return query.order_by(LoanApplicationAuditLog.date_and_time.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_loan_application_audit_log_by_id(
        db: Session,
        log_id: int,
    ) -> Optional[LoanApplicationAuditLog]:
        """
        Retrieves a single loan application audit log by ID.
        """
        return (
            db.query(LoanApplicationAuditLog)
            .filter(
                LoanApplicationAuditLog.id == log_id,
                LoanApplicationAuditLog.deleted_at.is_(None),
            )
            .first()
        )


# Helper function alias
log_loan_application_action = LoanApplicationAuditLogService.log_audit_log
