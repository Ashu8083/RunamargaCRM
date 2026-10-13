from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controllers.Logs.duplicate_lead_approval_log_controller import (
    get_duplicate_lead_approval_logs,
)

# Use the same authentication dependencies as your existing routes.
# Update these imports to match your project's existing route pattern.
from app.core.security import get_current_employee


router = APIRouter(
    prefix="/duplicate-lead-approval-logs",
    tags=["Duplicate Lead Approval Logs"],
)


@router.get("/")
def list_duplicate_lead_approval_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status: str | None = Query(None),
    duplicate_approval_id: int | None = Query(None, ge=1),
    loan_id: int | None = Query(None, ge=1),
    db: Session = Depends(get_db),
    employee=Depends(get_current_employee),
):
    return get_duplicate_lead_approval_logs(
        db=db,
        employee=employee,
        skip=skip,
        limit=limit,
        status=status,
        duplicate_approval_id=duplicate_approval_id,
        loan_id=loan_id,
    )