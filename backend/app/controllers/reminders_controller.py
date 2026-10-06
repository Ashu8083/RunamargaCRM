# backend\app\controllers\reminders_controller.py

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.reminders_schema import (
    ReminderCreateSchema,
)
from app.services.reminders_service import ReminderService


# ============================================================
# CREATE REMINDER
# ============================================================

def create_reminder(
    data: ReminderCreateSchema,
    db: Session,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.create_reminder(
        employee_id=current_employee.id,
        data=data,
    )


# ============================================================
# LIST REMINDERS
# ============================================================

def get_reminders(
    db: Session,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.get_reminders(
        employee_id=current_employee.id,
    )


# ============================================================
# GET SINGLE REMINDER
# ============================================================

def get_reminder(
    reminder_id: int,
    db: Session,
    current_employee: Employee,
):
    service = ReminderService(db)

    reminder = service.get_reminder(
        reminder_id=reminder_id,
        employee_id=current_employee.id,
    )

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found",
        )

    return reminder


# ============================================================
# COMPLETE REMINDER
# ============================================================

def complete_reminder(
    reminder_id: int,
    db: Session,
    current_employee: Employee,
):
    service = ReminderService(db)

    reminder = service.complete_reminder(
        reminder_id=reminder_id,
        employee_id=current_employee.id,
    )

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found",
        )

    return reminder


# ============================================================
# CANCEL REMINDER
# ============================================================

def cancel_reminder(
    reminder_id: int,
    db: Session,
    current_employee: Employee,
):
    service = ReminderService(db)

    reminder = service.cancel_reminder(
        reminder_id=reminder_id,
        employee_id=current_employee.id,
    )

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found",
        )

    return reminder


# ============================================================
# DELETE REMINDER
# ============================================================

def delete_reminder(
    reminder_id: int,
    db: Session,
    current_employee: Employee,
):
    service = ReminderService(db)

    deleted = service.delete_reminder(
        reminder_id=reminder_id,
        employee_id=current_employee.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found",
        )

    return {
        "message": "Reminder deleted successfully",
    }


# ============================================================
# NOTIFICATIONS
# ============================================================

def get_notifications(
    db: Session,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.get_notifications(
        employee_id=current_employee.id,
    )