# backend/app/controllers/api/leave/leave_controller.py

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.api.leave.leave_schema import (
    ApplyLeaveRequest,
    ApplyLeaveResponse,
    LeaveHistoryResponse,
    LeaveRecordResponse,
)
from app.services.api.leave.leave_service import apply_leave, get_my_leaves


async def apply_leave_controller(
    db: Session,
    employee_id: int,
    data: ApplyLeaveRequest,
) -> ApplyLeaveResponse:
    """Employee ID is always taken from the JWT token."""

    result = apply_leave(
        db=db,
        employee_id=employee_id,
        from_date=data.from_date,
        to_date=data.to_date,
        leave_type=data.leave_type,
        reason=data.reason,
    )

    return ApplyLeaveResponse(
        message="Leave request submitted successfully.",
        **result,
    )


async def get_my_leaves_controller(
    db: Session,
    employee_id: int,
    status: str | None = None,
    page: int = 1,
    limit: int = 10,
) -> LeaveHistoryResponse:
    """Return the authenticated employee's leave history (paginated)."""

    result = get_my_leaves(
        db=db,
        employee_id=employee_id,
        status=status,
        page=page,
        limit=limit,
    )

    return LeaveHistoryResponse(
        total=result["total"],
        page=result["page"],
        limit=result["limit"],
        total_pages=result["total_pages"],
        data=[LeaveRecordResponse(**r) for r in result["data"]],
    )
