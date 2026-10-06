# backend\app\services\reminders_service.py
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.reminders import Reminder
from app.models.loan_applications import LoanApplication
from app.schemas.reminders_schema import (
    ReminderCreateSchema,
    ReminderListResponseSchema,
    ReminderNotificationListSchema,
    ReminderNotificationSchema,
    ReminderResponseSchema,
)


class ReminderService:

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # CREATE REMINDER
    # ========================================================

    def create_reminder(
        self,
        employee_id: int,
        data: ReminderCreateSchema,
    ):
        application = (
            self.db.query(LoanApplication)
            .filter(
                LoanApplication.id == data.application_id,
            )
            .first()
        )

        if not application:
            return None

        reminder = Reminder(
            employee_id=employee_id,
            application_id=data.application_id,
            reminder_at=data.reminder_at,
            note=data.note,
            status="pending",
        )

        self.db.add(reminder)
        self.db.commit()
        self.db.refresh(reminder)

        return ReminderResponseSchema.model_validate(reminder)

    # ========================================================
    # GET ALL REMINDERS
    # ========================================================

    def get_reminders(
        self,
        employee_id: int,
    ):
        reminders = (
            self.db.query(Reminder)
            .filter(
                Reminder.employee_id == employee_id,
                Reminder.deleted_at.is_(None),
            )
            .order_by(
                Reminder.reminder_at.asc(),
            )
            .all()
        )

        return ReminderListResponseSchema(
            items=[
                ReminderResponseSchema.model_validate(reminder)
                for reminder in reminders
            ],
            total=len(reminders),
        )

    # ========================================================
    # GET SINGLE REMINDER
    # ========================================================

    def get_reminder(
        self,
        reminder_id: int,
        employee_id: int,
    ):
        reminder = (
            self.db.query(Reminder)
            .filter(
                Reminder.id == reminder_id,
                Reminder.employee_id == employee_id,
                Reminder.deleted_at.is_(None),
            )
            .first()
        )

        if not reminder:
            return None

        return ReminderResponseSchema.model_validate(reminder)

    # ========================================================
    # COMPLETE REMINDER
    # ========================================================

    def complete_reminder(
        self,
        reminder_id: int,
        employee_id: int,
    ):
        reminder = (
            self.db.query(Reminder)
            .filter(
                Reminder.id == reminder_id,
                Reminder.employee_id == employee_id,
                Reminder.deleted_at.is_(None),
            )
            .first()
        )

        if not reminder:
            return None

        reminder.status = "completed"
        reminder.completed_at = datetime.now(timezone.utc)

        self.db.commit()
        self.db.refresh(reminder)

        return ReminderResponseSchema.model_validate(reminder)

    # ========================================================
    # CANCEL REMINDER
    # ========================================================

    def cancel_reminder(
        self,
        reminder_id: int,
        employee_id: int,
    ):
        reminder = (
            self.db.query(Reminder)
            .filter(
                Reminder.id == reminder_id,
                Reminder.employee_id == employee_id,
                Reminder.deleted_at.is_(None),
            )
            .first()
        )

        if not reminder:
            return None

        reminder.status = "cancelled"

        self.db.commit()
        self.db.refresh(reminder)

        return ReminderResponseSchema.model_validate(reminder)

    # ========================================================
    # DELETE REMINDER
    # ========================================================

    def delete_reminder(
        self,
        reminder_id: int,
        employee_id: int,
    ):
        reminder = (
            self.db.query(Reminder)
            .filter(
                Reminder.id == reminder_id,
                Reminder.employee_id == employee_id,
                Reminder.deleted_at.is_(None),
            )
            .first()
        )

        if not reminder:
            return False

        reminder.deleted_at = datetime.now(timezone.utc)

        self.db.commit()

        return True

    # ========================================================
    # NOTIFICATIONS
    # ========================================================

    def get_notifications(
        self,
        employee_id: int,
    ):
        now = datetime.now(timezone.utc)

        reminders = (
            self.db.query(Reminder)
            .filter(
                Reminder.employee_id == employee_id,
                Reminder.deleted_at.is_(None),
                Reminder.status == "pending",
                Reminder.reminder_at <= now,
            )
            .order_by(
                Reminder.reminder_at.desc(),
            )
            .all()
        )

        items = [
            ReminderNotificationSchema.model_validate(reminder)
            for reminder in reminders
        ]

        return ReminderNotificationListSchema(
            items=items,
            total=len(items),
            unread_count=len(items),
        )