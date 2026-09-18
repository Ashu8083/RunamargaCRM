from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.config.database import get_db

from app.dependency.get_access_control_dependency import (
    check_permission,
)

from app.schemas.duplicate_approval_schema import (
    DuplicateApprovalCreateRequest,
)

from app.controllers.Loans.duplicate_approval_controller import (
    create_duplicate_approval,
    get_duplicate_approvals,
    approve_duplicate_application,
)


router = APIRouter(
    prefix="/duplicate-approvals",
    tags=["Duplicate Approvals"],
)


# =============================================================
# GET DUPLICATE APPROVALS
# =============================================================

@router.get("")
def get_duplicate_approvals_route(
    status: str | None = Query(
        default=None
    ),

    search: str | None = Query(
        default=None
    ),

    loan_type_id: int | None = Query(
        default=None
    ),

    applied_by_id: int | None = Query(
        default=None
    ),
    context_id: int | None = Query(
        default=None
    ),
    db: Session = Depends(get_db),

    employee=Depends(
        check_permission("loans:view")
    ),
):
    applications = get_duplicate_approvals(
        db=db,
        employee=employee,
        status=status,
        search=search,
        context_id=context_id,
        loan_type_id=loan_type_id,
        applied_by_id=applied_by_id,
    )

    return {
        "success": True,
        "data": applications,
    }


# =============================================================
# CREATE DUPLICATE APPROVAL
# =============================================================

@router.post("")
def create_duplicate_approval_route(
    payload: DuplicateApprovalCreateRequest,

    context_id: int | None = Query(
        default=None
    ),

    db: Session = Depends(get_db),

    employee=Depends(
        check_permission("loans:create")
    ),
):
    return create_duplicate_approval(
        db=db,
        employee=employee,
        payload=payload,
        context_id=context_id,
    )


@router.patch("/{duplicate_approval_id}/approve")
def approve_duplicate_application_route(
    duplicate_approval_id: int,
    db: Session = Depends(get_db),
    employee=Depends(
        check_permission("loans:create")
    ),
    context_id: int | None = Query(
        default=None
    ),
):
    return approve_duplicate_application(
        db=db,
        employee=employee,
        duplicate_approval_id=duplicate_approval_id,
        context_id=context_id,
    )