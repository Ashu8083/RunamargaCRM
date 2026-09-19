# backend/app/routes/admin/Loans/reverted_loans_routes.py


from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from app.config.database import get_db
from app.core.security import get_current_employee

from app.controllers.Loans.revert_application_controller import (
    get_reverted_applications,
    get_revert_history,
)

from app.models.employees import Employee


router = APIRouter(
    prefix="/reverted-applications",
    tags=["Reverted Applications"],
)


# =========================================================
# GET REVERTED APPLICATIONS
# =========================================================

@router.get("")
def get_reverted_applications_route(
    context_id: int | None = Query(default=None),
    page: int = Query(
        default=1,
        ge=1,
    ),

    page_size: int = Query(
        default=10,
        ge=1,
        le=100,
    ),

    search: str | None = Query(
        default=None,
    ),

    loan_type_id: int | None = Query(
        default=None,
    ),

    reverted_by_id: int | None = Query(
        default=None,
    ),

    reverted_date: str | None = Query(
        default=None,
    ),

    db=Depends(get_db),

    employee: Employee = Depends(
        get_current_employee
    ),
):

    return get_reverted_applications(
        db=db,
        employee=employee,
        page=page,
        context_id=context_id,
        page_size=page_size,
        search=search,
        loan_type_id=loan_type_id,
        reverted_by_id=reverted_by_id,
        reverted_date=reverted_date,
    )


# =========================================================
# GET REVERT HISTORY
# =========================================================

@router.get("/{loan_id}/history")
def get_revert_history_route(
    loan_id: int,

    db=Depends(get_db),
    context_id: int | None = Query(default=None),
    employee: Employee = Depends(
        get_current_employee
    ),
):

    return get_revert_history(
        db=db,
        employee=employee,
        context_id=context_id,
        loan_id=loan_id,
    )