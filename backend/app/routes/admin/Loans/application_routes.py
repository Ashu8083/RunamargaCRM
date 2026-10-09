# backend/app/routes/application_routes.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.dependency.get_access_control_dependency import check_permission
from app.config.database import get_db
from app.core.security import get_current_employee
from app.controllers.Loans.application_controller import (
    get_applications,
    view_application,
    create_application,get_bank_processings,get_default_dsa
)

from app.schemas.application_schema import (
   LoanApplicationCreateRequest,AssignBankRequest
)
from app.models.employees import Employee


router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)

@router.get("")
def get_applications_route(
    context_id: int | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    no_chat_for_days: int | None = Query(default=None, ge=1),

    search: str | None = Query(default=None),
    loan_type_id: int | None = Query(default=None),
    rm_id: int | None = Query(default=None),
    team_lead_id: int | None = Query(default=None),
    agent_id: int | None = Query(default=None),
    status: str | None = Query(default=None),

    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_applications(
        db=db,
        employee=employee,
        context_id=context_id,
        page=page,
        page_size=page_size,
        no_chat_for_days=no_chat_for_days,
        search=search,
        loan_type_id=loan_type_id,
        rm_id=rm_id,
        team_lead_id=team_lead_id,
        agent_id=agent_id,
        status=status,
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


@router.get("/{application_id}/bank-processing")
def get_bank_processing_route(
    application_id: str,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_bank_processings(
        db=db,
        employee=employee,
        application_id=application_id,
    )


@router.get("/{application_id}/bank-processing/default-dsa/{bank_id}")
def get_default_dsa_route(
    application_id: str,
    bank_id: int,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_default_dsa(
        db=db,
        employee=employee,
        application_id=application_id,
        bank_id=bank_id,
    )


