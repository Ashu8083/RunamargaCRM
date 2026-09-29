from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.admin_logs import AdminLogs
from app.Enums.LogAction import LogAction


def log_admin_action(
    db: Session,
    action: LogAction | str,
    action_by: Optional[int] = None,  # employee_context_id performing action
    action_on: Optional[int] = None,  # employee_context_id target admin
    date_and_time: Optional[datetime] = None,
    commit: bool = False,
) -> AdminLogs:
    """
    Automates logging of admin service database changes (create, update, delete).
    
    Fields stored:
    - action: LogAction (create, update, delete)
    - action_by: employee_context_id (Foreign Key to employee_contexts.id)
    - action_on: employee_context_id (Foreign Key to employee_contexts.id)
    - date_and_time: Timestamp of the action
    """
    if isinstance(action, str):
        action = LogAction(action.lower())

    log_entry = AdminLogs(
        action=action,
        action_by_id=action_by,
        admin_id=action_on,
        date_and_time=date_and_time or datetime.now(),
    )
    db.add(log_entry)
    
    if commit:
        db.commit()
        db.refresh(log_entry)
        
    return log_entry


create_admin_log = log_admin_action


def get_admin_logs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
) -> List[AdminLogs]:
    """
    Retrieves admin logs (Read-Only Data Fetch).
    """
    query = db.query(AdminLogs)
    if action:
        query = query.filter(AdminLogs.action == action)
    if action_by:
        query = query.filter(AdminLogs.action_by == action_by)
    if action_on:
        query = query.filter(AdminLogs.action_on == action_on)
    return query.order_by(AdminLogs.date_and_time.desc()).offset(skip).limit(limit).all()


def get_admin_log_by_id(
    db: Session,
    log_id: int,
) -> Optional[AdminLogs]:
    """
    Retrieves a single admin log by ID (Read-Only Data Fetch).
    """
    return db.query(AdminLogs).filter(AdminLogs.id == log_id).first()
