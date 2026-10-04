# backend/app/services/CallManagement/call_assignment_audit_log_service.py

from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.employee_contexts import EmployeeContext
from app.models.call_assignment_audit_logs import CallAssignmentAuditLogs
from app.services.auditl_log_service import AuditLogService


class CallAssignmentAuditLogService(AuditLogService[CallAssignmentAuditLogs]):

    @staticmethod
    def log_audit_log(
        db: Session,
        action: Optional[str] = None,
        action_by: Optional[int] = None,       # employee_context.id performing action
        action_on: Optional[int] = None,       # employee_context.id assigned to
        report_to: Optional[int] = None,       # employee_context.id manager
        date_and_time: Optional[datetime] = None,
        delete: Optional[datetime] = None,
        commit: bool = False,
        phone: Optional[str] = None,
        assigned_to_phone: Optional[int] = None, # phone_numbers.id
    ) -> CallAssignmentAuditLogs:

        # Auto-resolve report_to (manager's employee_context.id) if not provided
        if report_to is None:
            ctx_id_to_check = action_on or action_by
            if ctx_id_to_check:
                target_ctx = (
                    db.query(EmployeeContext)
                    .filter(
                        EmployeeContext.id == ctx_id_to_check,
                        EmployeeContext.deleted_at.is_(None),
                    )
                    .first()
                )
                if target_ctx and target_ctx.reports_to_id:
                    report_to = target_ctx.reports_to_id

        log_service = CallAssignmentAuditLogs(
            action=action,
            customer_phone=phone,
            assigned_to_id=action_on,
            assigned_to_phone=assigned_to_phone,
            assigned_by_id=action_by,
            report_to_id=report_to,
            date_and_time=date_and_time or datetime.now(),
            deleted_at=delete,  # Populated only when delete timestamp is passed
        )
        db.add(log_service)

        if commit:
            db.commit()
            db.refresh(log_service)

        return log_service

    @staticmethod
    def get_audit_logs(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        action: Optional[str] = None,
        action_by: Optional[int] = None,
        action_on: Optional[int] = None,
        report_to: Optional[int] = None,
    ) -> List[CallAssignmentAuditLogs]:
        """
        Retrieves call assignment audit logs with optional filtering.
        """
        query = db.query(CallAssignmentAuditLogs).filter(
            CallAssignmentAuditLogs.deleted_at.is_(None)
        )

        if action:
            query = query.filter(CallAssignmentAuditLogs.action == action)
        if action_by:
            query = query.filter(CallAssignmentAuditLogs.assigned_by_id == action_by)
        if action_on:
            query = query.filter(CallAssignmentAuditLogs.assigned_to_id == action_on)
        if report_to:
            query = query.filter(CallAssignmentAuditLogs.report_to_id == report_to)

        return (
            query.order_by(CallAssignmentAuditLogs.date_and_time.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_employee_audit_log_by_id(
        db: Session,
        log_id: int,
    ) -> Optional[CallAssignmentAuditLogs]:
        """
        Retrieves a single call assignment audit log by ID.
        """
        return (
            db.query(CallAssignmentAuditLogs)
            .filter(
                CallAssignmentAuditLogs.id == log_id,
                CallAssignmentAuditLogs.deleted_at.is_(None),
            )
            .first()
        )
