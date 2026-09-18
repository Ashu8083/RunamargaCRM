# backend/app/routes/admin/ApplicationFilter/application_filter_routes.py

from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.core.security import (
    get_current_employee,
)

from app.models.employees import Employee

from app.controllers.ApplicationFilter.application_filter_controller import (
    get_application_filter,
    get_application_filter_options,
)

router = APIRouter(
    prefix="/application-filter",
    tags=["Application Filter"],
)


# =========================================================
# GET APPLICATION FILTER
# =========================================================

@router.get("")
def get_application_filter_route(
    context_id: int | None = Query(default=None),
    search: str | None = Query(
        default=None,
    ),

    agent_context_id: int | None = Query(default=None),
    rm_context_id: int | None = Query(default=None),

    loan_type_id: int | None = Query(
        default=None,
    ),

    status: str | None = Query(
        default=None,
    ),

    month: int | None = Query(
        default=None,
        ge=1,
        le=12,
    ),

    year: int | None = Query(
        default=None,
    ),

    from_date: str | None = Query(
        default=None,
    ),

    to_date: str | None = Query(
        default=None,
    ),

    page: int = Query(
        default=1,
        ge=1,
    ),

    limit: int = Query(
        default=30,
        ge=1,
        le=100,
    ),

    db: Session = Depends(
        get_db
    ),

    employee: Employee = Depends(
        get_current_employee
    ),
):

    return get_application_filter(
        db=db,
        context_id=context_id,
        employee=employee,

        search=search,
        agent_context_id=agent_context_id,
        rm_context_id=rm_context_id,
        loan_type_id=loan_type_id,

        status=status,

        month=month,
        year=year,

        from_date=from_date,
        to_date=to_date,

        page=page,
        limit=limit,
    )

# =========================================================
# GET APPLICATION FILTER OPTIONS
# =========================================================

@router.get("/options")
def get_application_filter_options_route(
    context_id: int | None = Query(
        default=None,
    ),

    db: Session = Depends(
        get_db
    ),

    employee: Employee = Depends(
        get_current_employee
    ),
):

    return get_application_filter_options(
        db=db,
        employee=employee,
        context_id=context_id,
    )