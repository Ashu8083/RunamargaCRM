# backend/app/routes/admin/CallManagement/call_assignments.py
from fastapi import APIRouter, Depends, Body, Request
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.employees import Employee

from app.controllers.CallManagement.call_assignment_controller import (
    get_call_assignments,
    create_call_assignment,
    get_available_call_numbers,
    exchange_assignment,
    delete_call_assignment,
)

from app.dependency.get_access_control_dependency import (
    get_current_employee,
)


router = APIRouter(
    prefix="/call-assignments",
    tags=["Call Assignments"],
)


# =============================================================
# GET CALL ASSIGNMENTS
# =============================================================

@router.get("")
def get_call_assignments_route(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_call_assignments(
        db=db,
        employee=employee,
    )


# =============================================================
# CREATE CALL ASSIGNMENT
# =============================================================

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


# =============================================================
# GET AVAILABLE CALL NUMBERS
# =============================================================

@router.get("/available")
def get_available_call_numbers_route(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_available_call_numbers(
        db=db,
        employee=employee,
    )


# =============================================================
# EXCHANGE CALL ASSIGNMENT
# =============================================================

@router.post("/exchange")
async def exchange_assignment_route(
    request: Request,
    db: Session = Depends(get_db),
    payload: dict = Body(...),
    employee: Employee = Depends(get_current_employee),
):
    return await exchange_assignment(
        request=request,
        db=db,
        payload=payload,
        employee=employee
    )


# =============================================================
# DELETE CALL ASSIGNMENT
# =============================================================

@router.delete("/{assignment_id}")
async def delete_call_assignment_route(
    assignment_id: int,
    request: Request,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return await delete_call_assignment(
        request=request,
        db=db,
        assignment_id=assignment_id,
        employee=employee,
    )