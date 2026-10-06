# backend/app/services/phone_number_audit_log_service.py

from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.phone_number_audit_logs import PhoneNumberAuditLog
from app.models.employee_contexts import EmployeeContext
from app.services.auditl_log_service import AuditLogService


class PhoneNumberAuditLogService(AuditLogService[PhoneNumberAuditLog]):

    @staticmethod
    def log_audit_log(
        db: Session,
        action: Optional[str] = None,
        action_by: Optional[int] = None,       # employee_context_id performing action
        action_on: Optional[int] = None,       # employee_context_id target assigned employee
        report_to: Optional[int] = None,       # employee_context_id of reporting manager
        phone_number_id: Optional[int] = None, # phone_numbers.id
        phone: Optional[str] = None,           # phone number string
        date_and_time: Optional[datetime] = None,
        delete: Optional[datetime] = None,
        commit: bool = False,
    ) -> PhoneNumberAuditLog:
        """
        Logs a phone number audit action using employee_context IDs.
        """
        # Auto-resolve report_to (manager's employee_context_id) if not provided
        if report_to is None:
            context_id_to_check = action_on or action_by
            if context_id_to_check:
                target_ctx = (
                    db.query(EmployeeContext)
                    .filter(
                        EmployeeContext.id == context_id_to_check,
                        EmployeeContext.deleted_at.is_(None),
                    )
                    .first()
                )
                if target_ctx and target_ctx.reports_to_id:
                    report_to = target_ctx.reports_to_id

        log_entry = PhoneNumberAuditLog(
            action=action,
            phone_number_id=phone_number_id,
            phone=phone,
            action_by_id=action_by,
            employee_context_id=action_on,
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
        phone_number_id: Optional[int] = None,
    ) -> List[PhoneNumberAuditLog]:
        """
        Retrieves phone number audit logs with optional filtering.
        """
        query = db.query(PhoneNumberAuditLog).filter(PhoneNumberAuditLog.deleted_at.is_(None))

        if action:
            query = query.filter(PhoneNumberAuditLog.action == action)
        if action_by:
            query = query.filter(PhoneNumberAuditLog.action_by_id == action_by)
        if action_on:
            query = query.filter(PhoneNumberAuditLog.employee_context_id == action_on)
        if report_to:
            query = query.filter(PhoneNumberAuditLog.report_to_id == report_to)
        if phone_number_id:
            query = query.filter(PhoneNumberAuditLog.phone_number_id == phone_number_id)

        return (
            query.order_by(PhoneNumberAuditLog.date_and_time.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_audit_log_by_id(
        db: Session,
        log_id: int,
    ) -> Optional[PhoneNumberAuditLog]:
        """
        Retrieves a single phone number audit log by ID.
        """
        return (
            db.query(PhoneNumberAuditLog)
            .filter(
                PhoneNumberAuditLog.id == log_id,
                PhoneNumberAuditLog.deleted_at.is_(None),
            )
            .first()
        )
