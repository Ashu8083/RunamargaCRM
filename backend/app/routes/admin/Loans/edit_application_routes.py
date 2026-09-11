# backend/app/routes/edit_application_routes.py

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee
from app.controllers.Loans.edit_controller import (
    get_applications,
    view_application,
    update_application_loan_type,
    update_application_status,update_application_header,update_application_loan_details,add_application_address,add_application_reference,add_application_co_applicant
)
from app.schemas.application_schema import (
    UpdateApplicationLoanTypeRequest,
    UpdateApplicationStatusRequest,ApplicationHeaderUpdate,ApplicationLoanDetailsUpdate,AddApplicationAddressRequest,AddApplicationReferenceRequest,AddApplicationCoApplicantRequest
)

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


@router.patch("/{application_id}/header")
def update_application_header_route(
    application_id: str,
    payload: ApplicationHeaderUpdate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return update_application_header(
        db=db,
        employee=employee,
        application_id=application_id,
        payload=payload,
    )



@router.patch("/{application_id}/loan-details")
def update_application_loan_details_route(
    application_id: str,
    payload: ApplicationLoanDetailsUpdate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return update_application_loan_details(
        db=db,
        employee=employee,
        application_id=application_id,
        payload=payload,
    )

@router.post("/{application_id}/addresses")
def add_application_address_route(
    application_id: str,
    payload: AddApplicationAddressRequest,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return add_application_address(
        db=db,
        employee=employee,
        application_id=application_id,
        payload=payload,
    )

@router.post("/{application_id}/references")
def add_application_reference_route(
    application_id: str,
    payload: AddApplicationReferenceRequest,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return add_application_reference(
        db=db,
        employee=employee,
        application_id=application_id,
        payload=payload,
    )


@router.post("/{application_id}/co-applicants")
def add_application_co_applicant_route(
    application_id: str,
    payload: AddApplicationCoApplicantRequest,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return add_application_co_applicant(
        db=db,
        employee=employee,
        application_id=application_id,
        payload=payload,
    )