from datetime import datetime
from typing import Optional, List

from sqlalchemy.orm import Session
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

from app.models import CallAssignmentAuditLogs
from app.services.auditl_log_service import AuditLogService, T


class CallAssignmentAuditLogService(AuditLogService[CallAssignmentAuditLogs]) :

    @staticmethod
    def log_audit_log(
                      db: Session,
                      action : Optional[str] = None,
                      action_by: Optional[int] = None,
                      action_on : Optional[int]= None,
                      report_to : Optional[int] = None,
                      date_and_time: Optional[datetime] = None,
                      delete : Optional[datetime] = None,
                      commit: bool = False,
                      phone: Optional[str] = None,
                      assigned_to_phone: Optional[int] = None,
                      ) -> CallAssignmentAuditLogs:

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
        if delete:
            log_service = CallAssignmentAuditLogs(
                action=action,
                customer_phone=phone,
                assigned_to_id=action_on,
                assigned_to_phone=assigned_to_phone,
                assigned_by_id=action_by,
                report_to_id=report_to,
                date_and_time=date_and_time,
            )
            db.add(log_service)


        log_service = CallAssignmentAuditLogs(
                        action=action,
                        customer_phone=phone,
                        assigned_to_id=action_on,
                        assigned_to_phone =  assigned_to_phone,
                        assigned_by_id=action_by,
                        report_to_id=report_to,
                        date_and_time=date_and_time,
        )
        db.add(log_service)

        if commit:
            db.commit()
            db.refresh(log_service)

        return log_service

    def get_audit_logs(
                db: Session,
                skip: int = 0,
                limit: int = 100,
                action: Optional[str] = None,
                action_by: Optional[int] = None,
                action_on: Optional[int] = None,
                report_to: Optional[int] = None,
        ) -> list[type[CallAssignmentAuditLogs]]:
            """
            Retrieves employee audit logs with optional filtering.
            """
            query = db.query(CallAssignmentAuditLogs).filter(CallAssignmentAuditLogs.deleted_at.is_(None))

            if action:
                query = query.filter(CallAssignmentAuditLogs.action == action)
            if action_by:
                query = query.filter(CallAssignmentAuditLogs.assigned_by_id == action_by)
            if action_on:
                query = query.filter(CallAssignmentAuditLogs.assigned_to_id == action_on)
            if report_to:
                query = query.filter(CallAssignmentAuditLogs.report_to_id == report_to)

            return query.order_by(CallAssignmentAuditLogs.date_and_time.desc()).offset(skip).limit(limit).all()

    def get_employee_audit_log_by_id(
                db: Session,
                log_id: int,
        ) -> type[CallAssignmentAuditLogs] | None:
            """
            Retrieves a single employee audit log by ID.
            """
            return db.query(CallAssignmentAuditLogs).filter(
                CallAssignmentAuditLogs.id == log_id,
                CallAssignmentAuditLogs.deleted_at.is_(None),
            ).first()


