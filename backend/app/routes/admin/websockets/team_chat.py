
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
from app.models.employee_contexts import EmployeeContext
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

        application = auth_db.query(LoanApplication).filter(
            LoanApplication.unique_id == application_id,
            LoanApplication.deleted_at.is_(None),
        ).first()

        if application is None:
            await websocket.close(code=1008)
            return

        requested_context_id = websocket.query_params.get(
            "context_id"
        )
        context_query = auth_db.query(EmployeeContext).filter(
            EmployeeContext.employee_id == employee.id,
            EmployeeContext.is_active.is_(True),
            EmployeeContext.deleted_at.is_(None),
        )
        employee_context = None
        if requested_context_id and requested_context_id.isdigit():
            employee_context = context_query.filter(
                EmployeeContext.id == int(requested_context_id),
            ).first()
        if employee_context is None:
            employee_context = context_query.filter(
                EmployeeContext.is_default.is_(True),
            ).first() or context_query.first()

        # Capture the attributes used by chat handling before
        # closing the authentication database session.
        employee_data = SimpleNamespace(
            id=employee.id,
            context_id=(
                employee_context.id
                if employee_context
                else employee.id
            ),
            context_name=(
                employee_context.context.name
                if employee_context and employee_context.context
                else None
            ),
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
        await websocket.send_json({
            "success": True,
            "type": "connected",
            "application_id": application_id,
        })

        while True:
            message_data = await websocket.receive_json()

            # Use a fresh database session for each message.
            db: Session = SessionLocal()

            try:
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
