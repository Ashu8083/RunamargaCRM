from argparse import Action
from datetime import datetime
from typing import Optional, List

from sqlalchemy.orm import Session

from app.Enums.LogAction import LogAction
from app.models import EmployeeContext
from app.models.agent_audit_logs import AgentAuditLog
from app.services.auditl_log_service import AuditLogService


class AgentAuditLogService(AuditLogService[AgentAuditLog]):

    @staticmethod
    def log_audit_log(
    db: Session,
    action: Optional[str] =None,
    action_by: Optional[int] = None,  # employee_context_id performing action
    action_on: Optional[int] = None,# employee_context_id target admin
    report_to : Optional[int] = None,
    date_and_time: Optional[datetime] = None,
    commit: bool = False,
    ):
        # Auto-resolve report_to (manager's employee_id) from action_on's active EmployeeContext if not provided
        if report_to is None and action_on:
            target_ctx = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.employee_id == action_by,
                    EmployeeContext.deleted_at.is_(None),
                )
                .first()
            )
            if target_ctx and target_ctx.reports_to_id:
                manager_ctx = (
                    db.query(EmployeeContext)
                    .filter(EmployeeContext.id == target_ctx.reports_to_id)
                    .first()
                )
                if manager_ctx:
                    report_to = manager_ctx.id

        log_entry = AgentAuditLog(
            action=action,
            action_by_id=action_by,
            employee_id=action_on,
            report_to_id=report_to,
            date_and_time=date_and_time or datetime.now(),
        )
        db.add(log_entry)

        if commit:
            db.commit()
            db.refresh(log_entry)

        return log_entry

    def get_audit_logs(
            db: Session,
            skip: int = 0,
            limit: int = 100,
            action: Optional[str] = None,
            action_by: Optional[int] = None,
            action_on: Optional[int] = None,
            report_to: Optional[int] = None,
    ) -> List[AgentAuditLog]:
        """
        Retrieves employee audit logs with optional filtering.
        """
        query = db.query(AgentAuditLog).filter(AgentAuditLog.deleted_at.is_(None))

        if action:
            query = query.filter(AgentAuditLog.action == action)
        if action_by:
            query = query.filter(AgentAuditLog.action_by_id == action_by)
        if action_on:
            query = query.filter(AgentAuditLog.agent_id == action_on)
        if report_to:
            query = query.filter(AgentAuditLog.report_to_id == report_to)

        return query.order_by(AgentAuditLog.date_and_time.desc()).offset(skip).limit(limit).all()

    def get_employee_audit_log_by_id(
            db: Session,
            log_id: int,
    ) -> Optional[AgentAuditLog]:
        """
        Retrieves a single employee audit log by ID.
        """
        return db.query(AgentAuditLog).filter(
            AgentAuditLog.id == log_id,
            AgentAuditLog.deleted_at.is_(None),
        ).first()

