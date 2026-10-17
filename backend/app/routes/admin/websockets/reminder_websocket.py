# backend\app\routes\admin\websockets\reminder_websocket.py
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.config.database import get_db
from app.core.websocket_auth import get_current_employee_websocket
from app.websockets.reminder_websocket import reminder_manager

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/reminders",
    tags=["Reminders WebSocket"],
)


@router.websocket("/ws")
async def reminder_websocket_route(websocket: WebSocket):
    db = next(get_db())
    employee = None

    try:
        employee = await get_current_employee_websocket(
            websocket,
            db,
        )

        if not employee:
            await websocket.close(code=1008)
            return

        employee_id = employee.id

        await reminder_manager.connect(
            employee_id,
            websocket,
        )

        logger.info(
            "Reminder WebSocket authenticated for employee_id=%s",
            employee_id,
        )

        while True:
            # Keep the connection alive while the client is connected.
            # Reminder events will be pushed by the PostgreSQL listener.
            await websocket.receive_text()

    except WebSocketDisconnect:
        logger.info("Reminder WebSocket disconnected")

    except Exception:
        logger.exception("Reminder WebSocket error")

    finally:
        if employee is not None:
            reminder_manager.disconnect(
                employee.id,
                websocket,
            )

        db.close()