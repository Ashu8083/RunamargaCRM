from typing import List, Optional

from sqlalchemy.orm import Session, joinedload
from app.models.admin_logs import AdminLogs
from app.models.employee_contexts import EmployeeContext
from app.schemas.admin_log_schema import AdminLogResponse


def get_admin_logs_controller(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
) -> List[AdminLogResponse]:

    query = (
        db.query(AdminLogs)
        .options(
            joinedload(AdminLogs.performer).joinedload(
                EmployeeContext.employee
            ),
            joinedload(AdminLogs.target).joinedload(
                EmployeeContext.employee
            ),
        )
    )

    if action:
        query = query.filter(AdminLogs.action == action)

    if action_by is not None:
        query = query.filter(
            AdminLogs.action_by_id == action_by
        )

    if action_on is not None:
        query = query.filter(
            AdminLogs.admin_id == action_on
        )

    logs = (
        query
        .order_by(AdminLogs.date_and_time.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [
        AdminLogResponse(
            id=log.id,
            action=log.action,
            action_by=log.action_by_id,
            action_on=log.admin_id,
            performed_by_name=(
                log.performer.employee.name
                if log.performer and log.performer.employee
                else None
            ),
            employee_name=(
                log.target.employee.name
                if log.target and log.target.employee
                else None
            ),
            date_and_time=log.date_and_time,
        )
        for log in logs
    ]

def get_admin_log_by_id_controller(
    db: Session,
    log_id: int,
) -> AdminLogResponse:
    """
    Read-only controller to fetch a specific admin log by ID.
    """
    log_entry = get_admin_log_by_id(db=db, log_id=log_id)
    if not log_entry:
        raise HTTPException(
            status_code=404,
            detail="Admin log not found",
        )
    return log_entry
