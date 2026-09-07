# backend/app/routes/edit_application_routes.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.dependency.get_access_control_dependency import check_permission
from app.config.database import get_db
from app.core.security import get_current_employee

from app.controllers.Loans.edit_controller import (
    update_application_loan_type,
    update_application_status,
)
from app.schemas.application_schema import (
    UpdateApplicationLoanTypeRequest,
    UpdateApplicationStatusRequest
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)

@router.patch("/{application_id}/loan-type")
def update_application_loan_type_route(
    application_id: int,
    payload: UpdateApplicationLoanTypeRequest,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return update_application_loan_type(
        db=db,
        employee=employee,
        application_id=application_id,
        loan_type_id=payload.loan_type_id,
    )

    
@router.patch("/{application_id}/status")
def update_application_status_route(
    application_id: int,
    payload: UpdateApplicationStatusRequest,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return update_application_status(
        db=db,
        employee=employee,
        application_id=application_id,
        status=payload.status,
        rejected_remarks=payload.rejected_remarks,
        revert_rejection_date=payload.revert_rejection_date,
    )
