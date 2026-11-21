# backend/app/routes/api/leave/leave_routes.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.api_security import get_current_api_employee
from app.models.employees import Employee
from app.controllers.api.leave.leave_controller import (
    apply_leave_controller,
    get_my_leaves_controller,
)
from app.schemas.api.leave.leave_schema import (
    ApplyLeaveRequest,
    ApplyLeaveResponse,
    LeaveHistoryResponse,
)

router = APIRouter(
    prefix="/leave",
    tags=["Android — Leave"],
)


# ========================================================================
# POST /leave/apply
# ========================================================================

@router.post(
    "/apply",
    response_model=ApplyLeaveResponse,
    summary="Apply for leave",
    description=(
        "Submit a leave request for the authenticated employee.\n\n"
        "- `employee_id` is extracted from the JWT token automatically.\n"
        "- `leave_type`: `Full Day Leave`, `Half Day Leave`, or `WFH`.\n"
        "- `from_date` must not be after `to_date`."
    ),
)
async def apply_leave_route(
    data: ApplyLeaveRequest,
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_api_employee),
):
    return await apply_leave_controller(
        db=db,
        employee_id=employee_id,
        data=data,
    )


# ========================================================================
# GET /leave/my
# ========================================================================

@router.get(
    "/my",
    response_model=LeaveHistoryResponse,
    summary="View my leave requests",
    description=(
        "Fetch the authenticated employee's own leave requests (paginated).\n\n"
        "- Filter by `status`: `Pending`, `Approved`, or `Rejected`.\n"
        "- Results ordered by most recent first."
    ),
)
async def get_my_leaves_route(
    status: str | None = Query(
        default=None,
        description="Filter by status: 'Pending', 'Approved', or 'Rejected'.",
    ),
    page: int = Query(default=1, ge=1, description="Page number (1-indexed)."),
    limit: int = Query(default=10, ge=1, le=100, description="Records per page."),
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_api_employee),
):
    return await get_my_leaves_controller(
        db=db,
        employee_id=employee_id,
        status=status,
        page=page,
        limit=limit,
    )
