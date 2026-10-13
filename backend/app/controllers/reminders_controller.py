# backend/app/controllers/reminders_controller.py

from typing import Optional

from app.models.employees import Employee
from app.schemas.reminders_schema import ReminderCreateSchema
from app.services.reminders_service import ReminderService


# ============================================================
# CREATE REMINDER
# ============================================================

def create_reminder(
    data: ReminderCreateSchema,
    db,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.create_reminder(
        employee_id=current_employee.id,
        data=data,
    )


# ============================================================
# GET REMINDERS
# ============================================================

def get_reminders(
    db,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.get_reminders(
        employee_id=current_employee.id,
    )


# ============================================================
# GET REMINDERS MANAGEMENT
# ============================================================

def get_reminders_management(
    db,
    current_employee: Employee,
    page: int = 1,
    page_size: int = 25,
    search: Optional[str] = None,
    employee_id: Optional[int] = None,
    status: Optional[str] = None,
    context_id: Optional[int] = None,
    team_lead_context_id: Optional[int] = None,
):
    service = ReminderService(db)

    return service.get_reminders_management(
        employee=current_employee,
        page=page,
        page_size=page_size,
        search=search,
        employee_id=employee_id,
        status=status,
        context_id=context_id,
        team_lead_context_id=team_lead_context_id,
    )


# ============================================================
# GET SINGLE REMINDER
# ============================================================

def get_reminder(
    reminder_id: int,
    db,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.get_reminder(
        reminder_id=reminder_id,
        employee_id=current_employee.id,
    )


# ============================================================
# COMPLETE REMINDER
# ============================================================

def complete_reminder(
    reminder_id: int,
    db,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.complete_reminder(
        reminder_id=reminder_id,
        employee_id=current_employee.id,
    )


# ============================================================
# CANCEL REMINDER
# ============================================================

def cancel_reminder(
    reminder_id: int,
    db,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.cancel_reminder(
        reminder_id=reminder_id,
        employee_id=current_employee.id,
    )


# ============================================================
# DELETE REMINDER
# ============================================================

def delete_reminder(
    reminder_id: int,
    db,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.delete_reminder(
        reminder_id=reminder_id,
        employee_id=current_employee.id,
    )


# ============================================================
# NOTIFICATIONS
# ============================================================

def get_notifications(
    db,
    current_employee: Employee,
):
    service = ReminderService(db)

    return service.get_notifications(
        employee_id=current_employee.id,
    )