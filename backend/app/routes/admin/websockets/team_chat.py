
# backend/app/routes/admin/websockets/team_chat.py

import logging
from types import SimpleNamespace

from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
)
from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.models.loan_applications import LoanApplication
from app.core.websocket_auth import (
    get_current_employee_websocket,
)
from app.websockets.team_chat_websocket import (
    team_chat_manager,
)


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/team-chat",
    tags=["TeamChat"],
)


@router.websocket("/{application_id}/chat/ws")
async def team_chat_websocket_route(
    websocket: WebSocket,
    application_id: str,
):
    auth_db: Session = SessionLocal()
    employee = None

    try:
        employee = await get_current_employee_websocket(
            websocket,
            auth_db,
        )

        if not employee:
            # Preserve the existing authentication failure behavior.
            await websocket.accept()
            await websocket.close(code=1008)
            return

        # Capture the attributes used by chat handling before
        # closing the authentication database session.
        employee_data = SimpleNamespace(
            id=employee.id,
            name=getattr(employee, "name", None),
            full_name=getattr(employee, "full_name", None),
        )

    except WebSocketDisconnect:
        return

    except Exception:
        logger.exception("Team chat WebSocket authentication failed")

        try:
            await websocket.close(code=1011)
        except Exception:
            pass

        return

    finally:
        auth_db.close()

    await team_chat_manager.connect(
        application_id,
        websocket,
    )

    try:
        while True:
            message_data = await websocket.receive_json()

            # Use a fresh database session for each message.
            db: Session = SessionLocal()

            try:
                try:
                    parsed_application_id = int(application_id)
                except (TypeError, ValueError):
                    await websocket.send_json({
                        "success": False,
                        "error": "Invalid application ID",
                    })
                    continue

                application = db.get(
                    LoanApplication,
                    parsed_application_id,
                )

                if application is None:
                    await websocket.send_json({
                        "success": False,
                        "error": "Application not found",
                    })
                    continue

                message_data["loan_application_id"] = application.id

                await team_chat_manager.send_message(
                    application_id=application_id,
                    websocket=websocket,
                    employee=employee_data,
                    db=db,
                    message_data=message_data,
                )

            except WebSocketDisconnect:
                raise

            except Exception:
                db.rollback()
                logger.exception(
                    "Failed to process team chat message "
                    "for application_id=%s",
                    application_id,
                )

                try:
                    await websocket.send_json({
                        "success": False,
                        "error": "Failed to send message",
                    })
                except Exception:
                    break

            finally:
                db.close()

    except WebSocketDisconnect:
        pass

    except Exception:
        logger.exception(
            "Team chat WebSocket failed for application_id=%s",
            application_id,
        )

    finally:
        team_chat_manager.disconnect(
            application_id,
            websocket,
        )
