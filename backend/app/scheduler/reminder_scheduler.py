# ============================================================
# backend/app/scheduler/reminder_scheduler.py
# ============================================================

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.models.reminders import Reminder
from app.websockets.reminder_websocket import (
    reminder_manager,
)


async def process_due_reminders() -> None:
    """
    Finds all active pending reminders whose scheduled time
    has been reached and sends them to the owning employee's
    active WebSocket connections.
    """

    db: Session = SessionLocal()

    try:
        now = datetime.now(timezone.utc)

        reminders = db.scalars(
            select(Reminder)
            .where(
                Reminder.status == "pending",
                Reminder.reminder_at <= now,
                Reminder.deleted_at.is_(None),
            )
            .order_by(Reminder.reminder_at.asc())
        ).all()

        for reminder in reminders:
            await reminder_manager.send_to_employee(
                employee_id=reminder.employee_id,
                message={
                    "type": "REMINDER_DUE",
                    "data": {
                        "id": reminder.id,
                        "employee_id": reminder.employee_id,
                        "application_id": reminder.application_id,
                        "reminder_at": (
                            reminder.reminder_at.isoformat()
                        ),
                        "note": reminder.note,
                        "status": reminder.status,
                    },
                },
            )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()