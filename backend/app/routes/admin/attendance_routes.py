# backend/app/routes/attendance_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.dependency.get_access_control_dependency import check_permission
from app.controllers.attendance_controller import (
    my_attendance as get_my_attendance,
)

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


@router.get("")
def my_attendance(
    db: Session = Depends(get_db),
    employee=Depends(check_permission("attendance:view")),
):
    return get_my_attendance(
        db_session=db,
        employee=employee,
    )