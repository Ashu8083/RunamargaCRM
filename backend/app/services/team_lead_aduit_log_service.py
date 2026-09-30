from sqlalchemy import false
from sqlalchemy.orm import Session

from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.employee_audit_logs import EmployeeAuditLog
from app.models.employee_contexts import EmployeeContext
from app.Enums.LogAction import LogAction
from app.schemas.employee_audit_log_schema import EmployeeAuditLogCreate
from app.core.log_config import logger



from app.models.team_lead_audit_logs import TeamLeadLogs
from app.services.auditl_log_service import AuditLogService


class TeamLeadAuditLogService(AuditLogService[TeamLeadLogs]):

    @staticmethod
    def log_audit_log(
            db: Session,
            action: Optional[str] = None,
            action_by: Optional[int] = None,
            action_on: Optional[int] = None,
            report_to: Optional[int] = None,
            date_and_time: Optional[datetime] = None,
            delete: Optional[datetime] = None,
            commit: bool = False,
    )-> List [TeamLeadLogs]:

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
        if delete :
            delete_at = delete
            log_entry = TeamLeadLogs(
                action=action,
                action_by_id=action_by,
                team_lead_id=action_on,
                report_to_id=report_to,
                date_and_time=date_and_time or datetime.now(),
                deleted_at=delete_at
            )   
            db.add(log_entry)

        logger.info(f"<--------------------------- report_to: {report_to}------------------->")
        logger.info(f"<--------------------------- team_lead_id: {action_on}---------------------->")

        log_entry = TeamLeadLogs(
            action=action,
            action_by_id=action_by,
            team_lead_id=action_on,
            report_to_id=report_to,
            date_and_time=date_and_time or datetime.now(),
        )
        db.add(log_entry)

        if commit:
            db.commit()
            db.refresh(log_entry)

        return log_entry

    @staticmethod
    def get_employee_audit_logs(
            db: Session,
            skip: int = 0,
            limit: int = 100,
            action: Optional[str] = None,
            action_by: Optional[int] = None,
            action_on: Optional[int] = None,
            report_to: Optional[int] = None,
    ) -> List[EmployeeAuditLog]:
        """
        Retrieves employee audit logs with optional filtering.
        """
        query = db.query(EmployeeAuditLog).filter(TeamLeadLogs.deleted_at.is_(None))

        if action:
            query = query.filter(TeamLeadLogs.action == action)
        if action_by:
            query = query.filter(TeamLeadLogs.action_by == action_by)
        if action_on:
            query = query.filter(TeamLeadLogs.action_on == action_on)
        if report_to:
            query = query.filter(TeamLeadLogs.report_to == report_to)

        return query.order_by(TeamLeadLogs.date_and_time.desc()).offset(skip).limit(limit).all()

