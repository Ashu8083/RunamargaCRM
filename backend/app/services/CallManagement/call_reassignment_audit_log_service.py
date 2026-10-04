# backend/app/services/CallManagement/call_reassignment_audit_log_service.py

from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.employee_contexts import EmployeeContext
from app.models.call_reassignment_audit_logs import CallReassignmentAuditLog
from app.services.auditl_log_service import AuditLogService


class CallReassignmentAuditLogService(AuditLogService[CallReassignmentAuditLog]):

    @staticmethod
    def log_audit_log(
        db: Session,
        action: Optional[str] = None,
        action_by: Optional[int] = None,           # employee_context_id performing reassignment
        action_on: Optional[int] = None,            # employee_context_id of new assignee (to_assigned_to)
        report_to: Optional[int] = None,            # not used directly; kept for interface compatibility
        from_assigned_to: Optional[int] = None,     # employee_context_id of previous assignee
        from_report_to: Optional[int] = None,       # report_to of previous assignee
        to_assigned_to: Optional[int] = None,       # employee_context_id of new assignee
        to_report_to: Optional[int] = None,         # report_to of new assignee
        date_and_time: Optional[datetime] = None,
        delete: Optional[datetime] = None,
        commit: bool = False,
        phone: Optional[str] = None,
        assigned_to_phone: Optional[int] = None,    # phone_numbers.id
    ) -> CallReassignmentAuditLog:
        """
        Creates a reassignment audit log entry for call assignment changes.
        Tracks from whom (previous assignee) to whom (new assignee) with
        report_to_id for both sides.
        Auto-resolves from_report_to and to_report_to from EmployeeContext
        hierarchy if not explicitly provided.
        """
        # If to_assigned_to not explicitly provided, fall back to action_on
        if to_assigned_to is None and action_on is not None:
            to_assigned_to = action_on

        # Auto-resolve from_report_to (previous assignee's manager)
        if from_report_to is None and from_assigned_to:
            from_ctx = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.id == from_assigned_to,
                    EmployeeContext.deleted_at.is_(None),
                )
                .first()
            )
            # Fallback: if caller passed employee_id instead of context_id
            if not from_ctx:
                from_ctx = (
                    db.query(EmployeeContext)
                    .filter(
                        EmployeeContext.employee_id == from_assigned_to,
                        EmployeeContext.deleted_at.is_(None),
                    )
                    .first()
                )
            if from_ctx and from_ctx.reports_to_id:
                from_report_to = from_ctx.reports_to_id

        # Auto-resolve to_report_to (new assignee's manager)
        if to_report_to is None and to_assigned_to:
            to_ctx = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.id == to_assigned_to,
                    EmployeeContext.deleted_at.is_(None),
                )
                .first()
            )
            # Fallback: if caller passed employee_id instead of context_id
            if not to_ctx:
                to_ctx = (
                    db.query(EmployeeContext)
                    .filter(
                        EmployeeContext.employee_id == to_assigned_to,
                        EmployeeContext.deleted_at.is_(None),
                    )
                    .first()
                )
            if to_ctx and to_ctx.reports_to_id:
                to_report_to = to_ctx.reports_to_id

        log_entry = CallReassignmentAuditLog(
            action=action,
            customer_phone=phone,
            reassigned_by_id=action_by,
            from_assigned_to_id=from_assigned_to,
            from_report_to_id=from_report_to,
            to_assigned_to_id=to_assigned_to,
            to_report_to_id=to_report_to,
            assigned_to_phone=assigned_to_phone,
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
        from_assigned_to: Optional[int] = None,
        to_assigned_to: Optional[int] = None,
    ) -> List[CallReassignmentAuditLog]:
        """
        Retrieves call reassignment audit logs with optional filtering.
        """
        query = db.query(CallReassignmentAuditLog).filter(
            CallReassignmentAuditLog.deleted_at.is_(None)
        )

        if action:
            query = query.filter(CallReassignmentAuditLog.action == action)
        if action_by:
            query = query.filter(CallReassignmentAuditLog.reassigned_by_id == action_by)
        if from_assigned_to:
            query = query.filter(CallReassignmentAuditLog.from_assigned_to_id == from_assigned_to)
        if to_assigned_to:
            query = query.filter(CallReassignmentAuditLog.to_assigned_to_id == to_assigned_to)
        if report_to:
            # Filter logs where either side has this report_to
            query = query.filter(
                (CallReassignmentAuditLog.from_report_to_id == report_to)
                | (CallReassignmentAuditLog.to_report_to_id == report_to)
            )

        return (
            query.order_by(CallReassignmentAuditLog.date_and_time.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_call_reassignment_audit_log_by_id(
        db: Session,
        log_id: int,
    ) -> Optional[CallReassignmentAuditLog]:
        """
        Retrieves a single call reassignment audit log by ID.
        """
        return (
            db.query(CallReassignmentAuditLog)
            .filter(
                CallReassignmentAuditLog.id == log_id,
                CallReassignmentAuditLog.deleted_at.is_(None),
            )
            .first()
        )


# Helper function alias
log_call_reassignment_action = CallReassignmentAuditLogService.log_audit_log
