from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.schemas.admin_log_schema import AdminLogResponse
from app.services.admin_log_service import (
    get_admin_logs,
    get_admin_log_by_id,
)


def get_admin_logs_controller(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    action_by: Optional[int] = None,
    action_on: Optional[int] = None,
) -> List[AdminLogResponse]:
    """
    Read-only controller to fetch list of admin logs.
    """
    return get_admin_logs(
        db=db,
        skip=skip,
        limit=limit,
        action=action,
        action_by=action_by,
        action_on=action_on,
    )


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
