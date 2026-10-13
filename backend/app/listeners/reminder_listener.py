# backend/app/listeners/reminder_listener.py

import asyncio
import json
import logging

import psycopg

from app.config.settings import settings
from app.websockets.reminder_websocket import reminder_manager

logger = logging.getLogger(__name__)

REMINDER_EVENTS_CHANNEL = "reminder_events"


def get_async_database_url() -> str:
    return (
        "postgresql://"
        f"{settings.DATABASE_USER}:"
        f"{settings.DATABASE_PASSWORD}@"
        f"{settings.DATABASE_HOST}:"
        f"{settings.DATABASE_PORT}/"
        f"{settings.DATABASE_NAME}"
    )


async def listen_for_reminder_events() -> None:
    """Forward PostgreSQL reminder notifications to connected employees."""
    database_url = get_async_database_url()

    while True:
        try:
            async with await psycopg.AsyncConnection.connect(
                database_url,
                autocommit=True,
            ) as connection:
                await connection.execute(
                    f"LISTEN {REMINDER_EVENTS_CHANNEL}"
                )

                logger.info(
                    "Listening on PostgreSQL channel: %s",
                    REMINDER_EVENTS_CHANNEL,
                )

                async for notification in connection.notifies():
                    try:
                        payload = json.loads(notification.payload)
                    except (json.JSONDecodeError, TypeError):
                        logger.warning(
                            "Ignoring invalid reminder notification"
                        )
                        continue

                    logger.info(
                        "Received reminder notification: %s",
                        payload,
                    )

                    # Support both the detailed service payload and
                    # the database trigger's ID-only payload.
                    event_type = payload.get("event") or payload.get("type")
                    data = payload.get("data")

                    if isinstance(data, dict):
                        reminder_data = data
                    else:
                        reminder_data = payload

                    employee_id = reminder_data.get("employee_id")

                    if employee_id is None:
                        logger.warning(
                            "Reminder event has no employee_id; "
                            "cannot deliver over WebSocket"
                        )
                        continue

                    try:
                        employee_id = int(employee_id)
                    except (TypeError, ValueError):
                        logger.warning(
                            "Reminder event has an invalid employee_id"
                        )
                        continue

                    websocket_message = {
                        "event": event_type,
                        "data": reminder_data,
                    }

                    try:
                        await reminder_manager.send_to_employee(
                            employee_id,
                            websocket_message,
                        )

                        logger.info(
                            "Forwarded %s to employee_id=%s",
                            event_type,
                            employee_id,
                        )
                    except Exception:
                        logger.exception(
                            "Failed to forward reminder event "
                            "to employee_id=%s",
                            employee_id,
                        )

        except asyncio.CancelledError:
            logger.info("Reminder listener stopped")
            raise

        except Exception:
            logger.exception(
                "Reminder listener failed; retrying in 5 seconds"
            )
            await asyncio.sleep(5)