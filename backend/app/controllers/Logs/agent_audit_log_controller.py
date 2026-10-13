# backend/app/controllers/Logs/agent_audit_log_controller.py

from typing import Optional

from sqlalchemy.orm import Session, joinedload
from app.models.employees import Employee
from app.models.agent_audit_logs import AgentAuditLog
from app.models.employee_contexts import EmployeeContext


def get_audit_logs_controller(
    db: Session,
    employee: Employee,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
    report_to: Optional[int] = None,
):
    if employee is None:
        raise HTTPException(
            status_code=401,
            detail="Employee not authenticated",
        )
    query = (
        db.query(AgentAuditLog)
        .options(
            joinedload(AgentAuditLog.target).joinedload(
                EmployeeContext.employee
            ),
            joinedload(AgentAuditLog.performer).joinedload(
                EmployeeContext.employee
            ),
            joinedload(AgentAuditLog.reporting_manager).joinedload(
                EmployeeContext.employee
            ),
        )
        .filter(AgentAuditLog.deleted_at.is_(None))
    )

    if action:
        query = query.filter(AgentAuditLog.action == action)

    if action_by is not None:
        query = query.filter(
            AgentAuditLog.action_by_id == action_by
        )

    if action_on is not None:
        query = query.filter(
            AgentAuditLog.agent_id == action_on
        )

    if report_to is not None:
        query = query.filter(
            AgentAuditLog.report_to_id == report_to
        )

    logs = (
        query
        .order_by(AgentAuditLog.date_and_time.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": log.id,
            "action": log.action,
            "agent_id": log.agent_id,
            "action_by_id": log.action_by_id,
            "report_to_id": log.report_to_id,

            # Agent's employee name
            "agent_name": (
                log.target.employee.name
                if log.target and log.target.employee
                else None
            ),

            # Performer's employee name
            "performer_name": (
                log.performer.employee.name
                if log.performer and log.performer.employee
                else None
            ),

            # Reporting manager's employee name
            "report_to_name": (
                log.reporting_manager.employee.name
                if log.reporting_manager
                and log.reporting_manager.employee
                else None
            ),

            "date_and_time": log.date_and_time,
        }
        for log in logs
    ]
