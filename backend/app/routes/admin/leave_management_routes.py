# backend/app/routes/admin/leave_management_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.dependency.get_access_control_dependency import check_permission

from app.schemas.leave_management_schema import (
    LeaveManagementCreate,
    LeaveManagementReview,
    LeaveManagementResponse,
)

from app.controllers.leave_management_controller import (
    create_leave_request_controller,
    get_leave_requests_controller,
    review_leave_request_controller,
)


router = APIRouter(
    prefix="/leave-management",
    tags=["Leave Management"],
    dependencies=[Depends(get_current_employee)],
    responses={
        404: {"description": "Not found"},
    },
)


@router.post(
    "/",
    response_model=LeaveManagementResponse,
    status_code=201,
)
def create_leave_request(
    leave_data: LeaveManagementCreate,
    employee=Depends(check_permission("leave:create")),
    db: Session = Depends(get_db),
):
    return create_leave_request_controller(
        db=db,
        employee=employee,
        data=leave_data,
    )


@router.get(
    "/",
    response_model=list[LeaveManagementResponse],
)
def get_leave_requests(
    employee=Depends(check_permission("leave:view")),
    db: Session = Depends(get_db),
):
    return get_leave_requests_controller(
        db=db,
        employee=employee,
    )


@router.patch(
    "/{leave_id}/review",
    response_model=LeaveManagementResponse,
)
def review_leave_request(
    leave_id: int,
    review_data: LeaveManagementReview,
    employee=Depends(check_permission("leave:update")),
    db: Session = Depends(get_db),
):
    return review_leave_request_controller(
        db=db,
        employee=employee,
        leave_id=leave_id,
        data=review_data,
    )