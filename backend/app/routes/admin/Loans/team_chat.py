# backend/app/routes/admin/Loans/team_chat.py


from fastapi import (
    APIRouter,
    Depends,
    Request,
    WebSocket,
    WebSocketDisconnect,
)
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee
from app.schemas.team_chat import CreateTeamChatRequest
from app.websockets.team_chat_websocket import team_chat_manager
from app.controllers.Loans.team_chat_controller import (
    get_team_chat,
    create_team_chat,
    delete_team_chat,
)
from app.dependency.get_access_control_dependency import check_permission


router = APIRouter(
    prefix="/applications",
    tags=["Team Chat"],
)


# =========================================================
# GET CHAT
# =========================================================

@router.get("/{application_id}/chat")
def get_team_chat_route(
    application_id: str,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),

):
    return get_team_chat(
        db=db,
        employee=employee,
        application_id=application_id,
    )


# =========================================================
# SEND MESSAGE
# =========================================================

@router.post("/{application_id}/chat")
async def create_team_chat_route(
    application_id: str,
    payload: CreateTeamChatRequest,
    request: Request,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    result = create_team_chat(
        db=db,
        employee=employee,
        application_id=application_id,
        payload=payload,
        sender_context_id=getattr(
            request.state,
            "employee_context_id",
            None,
        ),
    )

    await team_chat_manager.broadcast(
        application_id,
        result,
    )

    return result

# =========================================================
# DELETE MESSAGE
# =========================================================

@router.delete("/{application_id}/chat/{chat_id}")
def delete_team_chat_route(
    application_id: str,
    chat_id: int,
    request: Request,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):

    return delete_team_chat(
        db=db,
        employee=employee,
        application_id=application_id,
        chat_id=chat_id,
        sender_context_id=getattr(
            request.state,
            "employee_context_id",
            None,
        ),
    )
