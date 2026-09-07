# backend/app/routes/duplicate_approval_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.dependency.get_access_control_dependency import (
    check_permission,
)
from app.controllers.duplicate_approval_controller import (
    create_duplicate_approval,
)
from app.schemas.duplicate_approval_schema import (
    DuplicateApprovalCreateRequest,
)


router = APIRouter(
    prefix="/duplicate-approvals",
    tags=["Duplicate Approvals"],
)


@router.post("")
def create_duplicate_approval_route(
    payload: DuplicateApprovalCreateRequest,
    db: Session = Depends(get_db),
    employee=Depends(
        check_permission("loans:create")
    ),
):
    return create_duplicate_approval(
        db=db,
        employee=employee,
        payload=payload,
    )