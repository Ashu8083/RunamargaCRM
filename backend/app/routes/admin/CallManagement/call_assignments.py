# backend/app/routes/admin/CallManagement/call_assignments.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.employees import Employee
from app.controllers.CallManagement.call_assignment_controller import (
    get_call_assignments,
    create_call_assignment,
    get_available_call_numbers,
)
from app.dependency.get_access_control_dependency import get_current_employee


router = APIRouter(
    prefix="/call-assignments",
    tags=["Call Assignments"],
)


@router.get("")
def get_call_assignments_route(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_call_assignments(
        db=db,
        employee=employee,
    )


@router.post("")
def create_call_assignment_route(
    phone_number: str,
    assigned_to_id: int,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return create_call_assignment(
        db=db,
        employee=employee,
        phone_number=phone_number,
        assigned_to_id=assigned_to_id,
    )

@router.get("/available")
def get_available_call_numbers_route(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_available_call_numbers(
        db=db,
        employee=employee,
    )