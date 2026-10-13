from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.employee_audit_logs import EmployeeAuditLog
from app.models.employee_contexts import EmployeeContext
from app.Enums.LogAction import LogAction
from app.schemas.employee_audit_log_schema import EmployeeAuditLogCreate


def log_employee_action(
    db: Session,
    action: LogAction | str,
    action_by: Optional[int] = None,  # employee_id performing action (who created)
    action_on: Optional[int] = None,  # employee_id target employee (to whom)
    report_to: Optional[int] = None,  # employee_id of reporting manager
    date_and_time: Optional[datetime] = None,
    commit: bool = False,
) -> EmployeeAuditLog:


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

    log_entry = EmployeeAuditLog(
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



create_employee_audit_log_helper = log_employee_action


def create_employee_audit_log(
    db: Session,
    log_data: EmployeeAuditLogCreate,
    commit: bool = True,
) -> EmployeeAuditLog:
    """
    Creates an employee audit log entry from schema data.
    """
    return log_employee_action(
        db=db,
        action=log_data.action,
        action_by=log_data.action_by,
        action_on=log_data.action_on,
        report_to=log_data.report_to,
        date_and_time=log_data.date_and_time,
        commit=commit,
    )


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
    query = db.query(EmployeeAuditLog).filter(EmployeeAuditLog.deleted_at.is_(None))

    if action:
        query = query.filter(EmployeeAuditLog.action == action)
    if action_by:
        query = query.filter(EmployeeAuditLog.action_by == action_by)
    if action_on:
        query = query.filter(EmployeeAuditLog.action_on == action_on)
    if report_to:
        query = query.filter(EmployeeAuditLog.report_to == report_to)

    return query.order_by(EmployeeAuditLog.date_and_time.desc()).offset(skip).limit(limit).all()


def get_employee_audit_log_by_id(
    db: Session,
    log_id: int,
) -> Optional[EmployeeAuditLog]:
    """
    Retrieves a single employee audit log by ID.
    """
    return db.query(EmployeeAuditLog).filter(
        EmployeeAuditLog.id == log_id,
        EmployeeAuditLog.deleted_at.is_(None),
    ).first()
