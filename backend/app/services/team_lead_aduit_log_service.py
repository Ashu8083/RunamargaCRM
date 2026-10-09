# backend/app/services/team_lead_aduit_log_service.py

from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.employee_contexts import EmployeeContext
from app.models.team_lead_audit_logs import TeamLeadLogs
from app.services.auditl_log_service import AuditLogService
from app.core.log_config import logger


class TeamLeadAuditLogService(AuditLogService[TeamLeadLogs]):

    @staticmethod
    def log_audit_log(
        db: Session,
        action: Optional[str] = None,
        action_by: Optional[int] = None,  # employee_context_id performing action
        action_on: Optional[int] = None,  # team_lead_id (EmployeeContext.id) target
        report_to: Optional[int] = None,  # employee_context_id of reporting manager
        date_and_time: Optional[datetime] = None,
        delete: Optional[datetime] = None,
        commit: bool = False,
    ) -> TeamLeadLogs:
        """
        Creates an audit log entry for team lead operations (create, update, delete).
        Stores employee_context_id for action_by, team_lead_id, and report_to.
        Auto-resolves report_to from EmployeeContext hierarchy if not explicitly provided.
        """
        # Auto-resolve report_to (manager's employee_context_id)
        if report_to is None:
            if action_by:
                performer_ctx = (
                    db.query(EmployeeContext)
                    .filter(
                        EmployeeContext.id == action_by,
                        EmployeeContext.deleted_at.is_(None),
                    )
                    .first()
                )
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

            if report_to is None and action_on:
                target_ctx = (
                    db.query(EmployeeContext)
                    .filter(
                        EmployeeContext.id == action_on,
                        EmployeeContext.deleted_at.is_(None),
                    )
                    .first()
                )
                if not target_ctx:
                    target_ctx = (
                        db.query(EmployeeContext)
                        .filter(
                            EmployeeContext.employee_id == action_on,
                            EmployeeContext.deleted_at.is_(None),
                        )
                        .first()
                    )
                if target_ctx and target_ctx.reports_to_id:
                    report_to = target_ctx.reports_to_id

        log_entry = TeamLeadLogs(
            action=action,
            action_by_id=action_by,
            team_lead_id=action_on,
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
    ) -> List[TeamLeadLogs]:
        """
        Retrieves team lead audit logs with optional filtering.
        """
        query = db.query(TeamLeadLogs).filter(TeamLeadLogs.deleted_at.is_(None))

        if action:
            query = query.filter(TeamLeadLogs.action == action)
        if action_by:
            query = query.filter(TeamLeadLogs.action_by_id == action_by)
        if action_on:
            query = query.filter(TeamLeadLogs.team_lead_id == action_on)
        if report_to:
            query = query.filter(TeamLeadLogs.report_to_id == report_to)

        return query.order_by(TeamLeadLogs.date_and_time.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_team_lead_audit_log_by_id(
        db: Session,
        log_id: int,
    ) -> Optional[TeamLeadLogs]:
        """
        Retrieves a single team lead audit log by ID.
        """
        return (
            db.query(TeamLeadLogs)
            .filter(
                TeamLeadLogs.id == log_id,
                TeamLeadLogs.deleted_at.is_(None),
            )
            .first()
        )
