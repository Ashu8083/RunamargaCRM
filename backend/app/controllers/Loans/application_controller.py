# backend/app/controllers/Loans/application_controller.py

from sqlalchemy.orm import Session
from app.models.employees import Employee
from app.services.Loans.application_service import ApplicationService
from app.core.access_control import AccessControl
from app.models.loan_applications import LoanApplication
from datetime import datetime, timezone
from fastapi import HTTPException



def get_applications(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
    page: int = 1,
    page_size: int = 10,
    no_chat_for_days: int | None = None,
    search: str | None = None,
    loan_type_id: int | None = None,
    rm_id: int | None = None,
    team_lead_id: int | None = None,
    agent_id: int | None = None,
    status: str | None = None,
):
    return ApplicationService.get_applications(
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


def view_application(
    db: Session,
    employee: Employee,
    application_id: str,
):
    return ApplicationService.view_application(
        db=db,
        employee=employee,
        application_id=application_id,
    )

def create_application(
    db: Session,
    employee: Employee,
    payload,
    context_id: int | None = None,
):
    return ApplicationService.create_application(
        db=db,
        employee=employee,
        payload=payload,
        context_id=context_id,
    )

def find_existing_application_by_phone(
    db: Session,
    phone: str,
):
    return ApplicationService.find_existing_application_by_phone(
        db=db,
        phone=phone,
    )

def get_bank_processings(
    db: Session,
    employee: Employee,
    application_id: str,
):
    return ApplicationService.get_bank_processings(
        db=db,
        employee=employee,
        application_id=application_id,
    )


def get_default_dsa(
    db: Session,
    employee: Employee,
    application_id: str,
    bank_id: int,
):
    return ApplicationService.get_default_dsa(
        db=db,
        employee=employee,
        application_id=application_id,
        bank_id=bank_id,
    )



def delete_loan_application(
    db: Session,
    application_id: str,
    employee: Employee,
):
    """
    Soft-delete a loan application.

    Uses the application's unique_id and checks whether the
    employee is allowed to access the application.
    """

    # Apply the same application visibility rules used by the service.
    scoped_query = ApplicationService.apply_scope(
        query=db.query(LoanApplication),
        db=db,
        employee=employee,
    )

    application = (
        scoped_query
        .filter(
            LoanApplication.unique_id == application_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Loan application not found",
        )

    try:
        application.deleted_at = datetime.now(timezone.utc)

        db.commit()

        return {
            "success": True,
            "message": "Loan application deleted successfully",
            "application_id": application.unique_id,
        }

    except Exception as error:
        db.rollback()

      
        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete loan application",
        ) from error
