# backend/app/routes/admin/call_reassignment_audit_log_routes.py

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.call_reassignment_audit_log_schema import CallReassignmentAuditLogResponse
from app.controllers.call_reassignment_audit_log_controller import (
    get_call_reassignment_audit_logs_controller,
    get_call_reassignment_audit_log_by_id_controller,
)

router = APIRouter(
    prefix="/call-reassignment-audit-logs",
    tags=["Call Reassignment Audit Logs"],
)


@router.get(
    "",
    response_model=List[CallReassignmentAuditLogResponse],
)
def get_call_reassignment_audit_logs_route(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    action: Optional[str] = Query(None, description="Log action type"),
    action_by: Optional[int] = Query(None, description="employee_context_id of employee performing reassignment"),
    from_assigned_to: Optional[int] = Query(None, description="employee_context_id of previous assignee"),
    to_assigned_to: Optional[int] = Query(None, description="employee_context_id of new assignee"),
    report_to: Optional[int] = Query(None, description="employee_context_id of reporting manager (matches either side)"),
    db: Session = Depends(get_db),
):
    """
    GET route to fetch call reassignment audit logs with optional filters.
    """
    return get_call_reassignment_audit_logs_controller(
        db=db,
        skip=skip,
        limit=limit,
        action=action,
        action_by=action_by,
        from_assigned_to=from_assigned_to,
        to_assigned_to=to_assigned_to,
        report_to=report_to,
    )


@router.get(
    "/{log_id}",
    response_model=CallReassignmentAuditLogResponse,
)
def get_call_reassignment_audit_log_by_id_route(
    log_id: int,
    db: Session = Depends(get_db),
):
    """
    GET route to fetch a specific call reassignment audit log by ID.
    """
    return get_call_reassignment_audit_log_by_id_controller(db=db, log_id=log_id)
