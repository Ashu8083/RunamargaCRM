# backend/app/routes/admin/Loans/team_chat.py


from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile,
)

from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.employees import Employee
from app.schemas.team_chat import CreateTeamChatRequest
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
    employee=Depends(check_permission("banks:create")),

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
def create_team_chat_route(
    application_id: str,
    payload: CreateTeamChatRequest,
    db: Session = Depends(get_db),
    employee=Depends(check_permission("banks:create")),
):
    return create_team_chat(
        db=db,
        employee=employee,
        application_id=application_id,
        payload=payload,
    )

# =========================================================
# DELETE MESSAGE
# =========================================================

@router.delete("/{application_id}/chat/{chat_id}")
def delete_team_chat_route(
    application_id: str,
    chat_id: int,

    db: Session = Depends(get_db),

    employee=Depends(check_permission("banks:create")),

):

    return delete_team_chat(
        db=db,
        employee=employee,
        application_id=application_id,
        chat_id=chat_id,
    )