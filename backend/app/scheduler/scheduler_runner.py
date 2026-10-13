# ============================================================
# backend/app/scheduler/scheduler_runner.py
# ============================================================

import asyncio
import logging

from app.scheduler.reminder_scheduler import (
    process_due_reminders,
)


logger = logging.getLogger(__name__)


REMINDER_CHECK_INTERVAL_SECONDS = 30


async def run_reminder_scheduler() -> None:
    """
    Continuously checks for due reminders.
    """

    logger.info(
        "Reminder scheduler started. "
        "Check interval: %s seconds",
        REMINDER_CHECK_INTERVAL_SECONDS,
    )

    while True:
        try:
            await process_due_reminders()

        except Exception:
            logger.exception(
                "Error while processing due reminders"
            )

        await asyncio.sleep(
            REMINDER_CHECK_INTERVAL_SECONDS
        )