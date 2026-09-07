# backend/app/routes/application_routes.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.dependency.get_access_control_dependency import check_permission
from app.config.database import get_db
from app.core.security import get_current_employee
from app.controllers.Loans.application_controller import (
    get_applications,
    view_application,
    create_application
)

from app.schemas.application_schema import (
   LoanApplicationCreateRequest
)
from app.models.employees import Employee


router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


@router.get("")
def get_applications_route(
    context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_applications(
        db=db,
        employee=employee,
        context_id=context_id,
    )


@router.get("/{application_id}")
def view_application_route(
    application_id: str,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    application = view_application(
        db=db,
        employee=employee,
        application_id=application_id,
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return {
        "success": True,
        "data": application,
    }


@router.post("/create")
def create_loan_application(
    payload: LoanApplicationCreateRequest,
    db: Session = Depends(get_db),
    employee=Depends(check_permission("loans:create")),
):
    return create_application(
        db=db,
        employee=employee,
        payload=payload,
    )
