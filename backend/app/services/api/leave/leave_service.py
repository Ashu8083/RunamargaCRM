# backend/app/services/api/leave/leave_service.py

from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.models.leave_managements import LeaveManagement


def apply_leave(
    db: Session,
    employee: Employee,
    from_date: date,
    to_date: date,
    leave_type: str,
    reason: str,
) -> dict:
    """
    Create a leave request for the authenticated employee.
    No permission check — the employee applies for their own leave.
    """

    if to_date < from_date:
        raise HTTPException(
            status_code=422,
            detail="to_date cannot be before from_date.",
        )

    reason = reason.strip()
    if not reason:
        raise HTTPException(
            status_code=422,
            detail="Reason cannot be empty.",
        )

    allowed_types = {"Full Day Leave", "Half Day Leave", "WFH"}
    if leave_type not in allowed_types:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid leave_type. Allowed: {sorted(allowed_types)}.",
        )

    leave = LeaveManagement(
        applied_by=employee.id,
        from_date=from_date,
        to_date=to_date,
        leave_type=leave_type,
        reason=reason,
        status="Pending",
    )

    try:
        db.add(leave)
        db.commit()
        db.refresh(leave)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to submit leave request. Please try again.",
        )

    return {
        "id": leave.id,
        "employee_id": leave.applied_by,
        "employee_name": getattr(employee, "name", None),
        "from_date": leave.from_date.isoformat(),
        "to_date": leave.to_date.isoformat(),
        "days": (leave.to_date - leave.from_date).days + 1,
        "leave_type": leave.leave_type,
        "reason": leave.reason,
        "status": leave.status,
        "created_at": leave.created_at.isoformat() if leave.created_at else None,
    }


# ------------------------------------------------------------------------
# GET OWN LEAVE HISTORY
# ------------------------------------------------------------------------

def get_my_leaves(
    db: Session,
    employee: Employee,
    status: str | None = None,
    page: int = 1,
    limit: int = 10,
) -> dict:
    """
    Return the authenticated employee's own leave requests (paginated).
    Optionally filter by status: 'Pending', 'Approved', 'Rejected'.
    """

    query = (
        db.query(LeaveManagement)
        .filter(LeaveManagement.applied_by == employee.id)
    )

    if status:
        allowed = {"Pending", "Approved", "Rejected"}
        if status not in allowed:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid status. Allowed: {sorted(allowed)}.",
            )
        query = query.filter(LeaveManagement.status == status)

    total = query.count()
    total_pages = max(1, -(-total // limit))  # ceiling division

    leaves = (
        query
        .order_by(LeaveManagement.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "data": [
            {
                "id": leave.id,
                "employee_id": leave.applied_by,
                "employee_name": getattr(employee, "name", None),
                "from_date": leave.from_date.isoformat(),
                "to_date": leave.to_date.isoformat(),
                "days": (leave.to_date - leave.from_date).days + 1,
                "leave_type": leave.leave_type,
                "reason": leave.reason,
                "status": leave.status,
                "review_remarks": leave.review_remarks,
                "reviewed_at": leave.reviewed_at.isoformat() if leave.reviewed_at else None,
                "created_at": leave.created_at.isoformat() if leave.created_at else None,
            }
            for leave in leaves
        ],
    }
