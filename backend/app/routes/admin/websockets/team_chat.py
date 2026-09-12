# backend/app/routes/admin/websockets/team_chat.py


from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
)

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.loan_application import LoanApplication

from app.core.websocket_auth import (
    get_current_employee_websocket,
)

from app.core.access_control import AccessControl

from app.controllers.team_chat_websocket import (
    team_chat_manager,
)


router = APIRouter(
    prefix="/team-chat",
    tags=["TeamChat"],
)

@router.websocket("/{application_id}/chat/ws")
async def team_chat_websocket_route(
    websocket: WebSocket,
    application_id: str,
):
    print(
        "========== TEAM CHAT WS ROUTE HIT =========="
    )

    print(
        "WS COOKIE PRESENT:",
        bool(websocket.headers.get("cookie")),
    )

    print(
        "WS ACCESS TOKEN COOKIE:",
        bool(
            websocket.cookies.get("access_token")
        ),
    )

    db = next(get_db())

    employee = await get_current_employee_websocket(
        websocket,
        db,
    )

    print(
        "WS EMPLOYEE:",
        employee.id if employee else None
    )

    if not employee:
        await websocket.accept()

        await websocket.close(
            code=1008
        )

        db.close()
        return

    await team_chat_manager.connect(
        application_id,
        websocket,
    )

    try:
        while True:
            message_data = (
                await websocket.receive_json()
            )

            message_data[
                "loan_application_id"
            ] = application.id

            await team_chat_manager.send_message(
                application_id=application_id,
                websocket=websocket,
                employee=employee,
                db=db,
                message_data=message_data,
            )

    except WebSocketDisconnect:
        team_chat_manager.disconnect(
            application_id,
            websocket,
        )

    except Exception:
        team_chat_manager.disconnect(
            application_id,
            websocket,
        )

    finally:
        db.close()