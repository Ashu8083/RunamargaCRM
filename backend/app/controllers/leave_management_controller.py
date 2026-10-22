
# backend/app/controllers/leave_management_controller.py

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.leave_management_schema import (
    LeaveManagementCreate,
    LeaveManagementReview,
)
from app.services.leave_management_service import (
    create_leave_request,
    get_leave_requests,
    review_leave_request,
)


def create_leave_request_controller(
    db: Session,
    employee: Employee,
    data: LeaveManagementCreate,
    context_id: int | None = None,
):
    return create_leave_request(
        db=db,
        employee=employee,
        data=data,
        context_id=context_id,
    )


def get_leave_requests_controller(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
    team_lead_context_id: int | None = None,
):
    return get_leave_requests(
        db=db,
        employee=employee,
        context_id=context_id,
        team_lead_context_id=team_lead_context_id,
    )


def review_leave_request_controller(
    db: Session,
    employee: Employee,
    leave_id: int,
    data: LeaveManagementReview,
    context_id: int | None = None,
):
    return review_leave_request(
        db=db,
        employee=employee,
        leave_id=leave_id,
        data=data,
        context_id=context_id,
    )
