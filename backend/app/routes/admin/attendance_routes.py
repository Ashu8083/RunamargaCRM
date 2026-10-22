
# backend/app/routes/attendance_routes.py

from datetime import date
from typing import Literal

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field, model_validator
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.dependency.get_access_control_dependency import check_permission

from app.controllers.attendance_controller import (
    my_attendance as get_my_attendance,
    apply_leave as apply_my_leave,
    view_leave as view_my_leave,
    update_leave as update_my_leave,
    cancel_leave as cancel_my_leave,
)


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


# =============================================================
# LEAVE REQUEST VALIDATION
# =============================================================

class LeaveRequest(BaseModel):
    from_date: date
    to_date: date
    leave_type: Literal["Full Day Leave", "WFH"]
    reason: str = Field(..., min_length=1)

    @model_validator(mode="after")
    def validate_dates_and_reason(self):
        if self.to_date < self.from_date:
            raise ValueError(
                "to_date cannot be before from_date"
            )

        if not self.reason.strip():
            raise ValueError("Reason cannot be empty")

        return self


# =============================================================
# MY ATTENDANCE
# GET /attendance?month=2026-10
# =============================================================

@router.get("")
def my_attendance(
    month: str | None = Query(
        default=None,
        pattern=r"^\d{4}-(0[1-9]|1[0-2])$",
        description="Selected month in YYYY-MM format",
    ),
    db: Session = Depends(get_db),
    employee=Depends(check_permission("attendance:view")),
):
    return get_my_attendance(
        db_session=db,
        employee=employee,
        month=month,
    )


# =============================================================
# APPLY FOR LEAVE
# POST /attendance/apply/leave
# =============================================================

@router.post("/apply/leave", status_code=201)
def apply_leave(
    data: LeaveRequest,
    db: Session = Depends(get_db),
    employee=Depends(check_permission("attendance:view")),
):
    return apply_my_leave(
        db_session=db,
        employee=employee,
        data=data.model_dump(),
    )


# =============================================================
# VIEW MY LEAVE REQUESTS AND BALANCE
# GET /attendance/view/leave
# =============================================================

@router.get("/view/leave")
def view_leave(
    db: Session = Depends(get_db),
    employee=Depends(check_permission("attendance:view")),
):
    return view_my_leave(
        db_session=db,
        employee=employee,
    )


# =============================================================
# UPDATE PENDING LEAVE
# PUT /attendance/update/leave/{leave_id}
# =============================================================

@router.put("/update/leave/{leave_id}")
def update_leave(
    leave_id: int,
    data: LeaveRequest,
    db: Session = Depends(get_db),
    employee=Depends(check_permission("attendance:view")),
):
    return update_my_leave(
        db_session=db,
        employee=employee,
        leave_id=leave_id,
        data=data.model_dump(),
    )


# =============================================================
# CANCEL PENDING LEAVE
# PATCH /attendance/cancel/leave/{leave_id}
# =============================================================

@router.patch("/cancel/leave/{leave_id}")
def cancel_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    employee=Depends(check_permission("attendance:view")),
):
    return cancel_my_leave(
        db_session=db,
        employee=employee,
        leave_id=leave_id,
    )
