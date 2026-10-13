# backend/app/controllers/Logs/team_lead_audit_log_controller.py

from typing import Optional

from sqlalchemy.orm import Session, joinedload
from app.models.employees import Employee
from app.models.team_lead_audit_logs import TeamLeadLogs
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
        db.query(TeamLeadLogs)
        .options(
            joinedload(TeamLeadLogs.target).joinedload(
                EmployeeContext.employee
            ),
            joinedload(TeamLeadLogs.performer).joinedload(
                EmployeeContext.employee
            ),
            joinedload(TeamLeadLogs.reporting_manager).joinedload(
                EmployeeContext.employee
            ),
        )
        .filter(TeamLeadLogs.deleted_at.is_(None))
    )

    if action:
        query = query.filter(TeamLeadLogs.action == action)

    if action_by is not None:
        query = query.filter(
            TeamLeadLogs.action_by_id == action_by
        )

    if action_on is not None:
        query = query.filter(
            TeamLeadLogs.team_lead_id == action_on
        )

    if report_to is not None:
        query = query.filter(
            TeamLeadLogs.report_to_id == report_to
        )

    logs = (
        query
        .order_by(TeamLeadLogs.date_and_time.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": log.id,
            "action": log.action,
            "team_lead_id": log.team_lead_id,
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
