# backend/app/controllers/Loans/application_controller.py

from sqlalchemy.orm import Session
from app.models.employees import Employee
from app.services.Loans.application_service import ApplicationService
from app.core.access_control import AccessControl

def get_applications(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
):
    return ApplicationService.get_applications(
        db=db,
        employee=employee,
        context_id=context_id,
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
):
    return ApplicationService.create_application(
        db=db,
        employee=employee,
        payload=payload,
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