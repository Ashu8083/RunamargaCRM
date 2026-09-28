from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.admin_log_schema import AdminLogResponse
from app.controllers.admin_log_controller import (
    get_admin_logs_controller,
    get_admin_log_by_id_controller,
)

router = APIRouter(
    prefix="/admin-logs",
    tags=["Admin Logs"],
)


@router.get(
    "",
    response_model=List[AdminLogResponse],
)
def get_admin_logs_route(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    action: Optional[str] = Query(None),
    action_by: Optional[int] = Query(None, description="employee_context_id of admin performing action"),
    action_on: Optional[int] = Query(None, description="employee_context_id of target admin"),
    db: Session = Depends(get_db),
):
    """
    Read-only GET route to fetch admin logs.
    """
    return get_admin_logs_controller(
        db=db,
        skip=skip,
        limit=limit,
        action=action,
        action_by=action_by,
        action_on=action_on,
    )


@router.get(
    "/{log_id}",
    response_model=AdminLogResponse,
)
def get_admin_log_by_id_route(
    log_id: int,
    db: Session = Depends(get_db),
):
    """
    Read-only GET route to fetch a specific admin log by ID.
    """
    return get_admin_log_by_id_controller(db=db, log_id=log_id)
