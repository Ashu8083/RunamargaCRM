# backend\app\routes\admin\reminders.routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.api_security import get_current_api_employee
from app.models.employees import Employee
from app.controllers.reminders_controller import create_reminder
from app.schemas.reminders_schema import ReminderCreateSchema


router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"],
)


@router.post("")
def create_reminder_route(
    data: ReminderCreateSchema,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(get_current_api_employee),
):
    return create_reminder(
        data=data,
        db=db,
        current_employee=current_employee,
    )