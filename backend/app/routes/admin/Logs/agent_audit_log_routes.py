# backend/app/routes/admin/Logs/agent_audit_log_routes.py

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.security import get_current_employee
from app.config.database import get_db
from app.schemas.AgentAuditLog import AgentAuditLogResponse
from app.controllers.Logs.agent_audit_log_controller import (
    get_audit_logs_controller,
)

router = APIRouter(
    prefix="/agent-audit-logs",
    tags=["Agent Audit Logs"],
)


@router.get("", response_model=List[AgentAuditLogResponse])
def get_agent_audit_logs_route(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    action: Optional[str] = Query(None),
    action_by: Optional[int] = Query(None),
    action_on: Optional[int] = Query(None),
    report_to: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    employee=Depends(
        get_current_employee
    ),
):
    return get_audit_logs_controller(
        db=db,
        employee=employee,
        skip=skip,
        limit=limit,
        action=action,
        action_by=action_by,
        action_on=action_on,
        report_to=report_to,
    )


