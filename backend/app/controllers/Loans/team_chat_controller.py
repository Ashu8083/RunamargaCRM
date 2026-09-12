# backend/app/controllers/Loans/team_chat_controller.py
import os
import uuid
from datetime import datetime

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.models.team_chat import TeamChat
from app.models.loan_applications import LoanApplication
from app.schemas.team_chat import CreateTeamChatRequest


UPLOAD_DIR = "app/static/uploads/team_chat"


def get_team_chat(
    db: Session,
    employee,
    application_id: str,
):
    # ---------------------------------------------------------
    # FIND APPLICATION USING UNIQUE ID
    # ---------------------------------------------------------

    application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.unique_id == application_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    # ---------------------------------------------------------
    # GET CHAT MESSAGES
    # ---------------------------------------------------------

    messages = (
        db.query(TeamChat)
        .filter(
            TeamChat.loan_application_id == application.id,
            TeamChat.deleted_at.is_(None),
        )
        .order_by(TeamChat.created_at.asc())
        .all()
    )

    data = []

    for chat in messages:

        sender_name = "User"

        sender_name = "You" if chat.sender_admin_id == employee.id else "User"

        data.append(
            {
                "id": chat.id,
                "loan_application_id": chat.loan_application_id,
                "sender_admin_id": chat.sender_admin_id,
                "sender_name": sender_name,

                "message_text": chat.message_text,
                "message_type": chat.message_type,

                "file_path": chat.file_path,
                "file_name": chat.file_name,
                "file_size": chat.file_size,
                "file_mime_type": chat.file_mime_type,

                "reply_to_remark_id": chat.reply_to_remark_id,

                "is_read": chat.is_read,

                "created_at": chat.created_at,
                "updated_at": chat.updated_at,
            }
        )

    return {
        "success": True,
        "data": data,
    }

def create_team_chat(
    db: Session,
    employee,
    application_id: str,
    payload: CreateTeamChatRequest,
):
    # ---------------------------------------------------------
    # FIND APPLICATION USING UNIQUE ID
    # ---------------------------------------------------------

    application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.unique_id == application_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    # ---------------------------------------------------------
    # VALIDATE MESSAGE
    # ---------------------------------------------------------

    message_text = (
        payload.message_text.strip()
        if payload.message_text
        else None
    )

    if not message_text:
        raise HTTPException(
            status_code=400,
            detail="Message is required",
        )

    # ---------------------------------------------------------
    # CREATE CHAT
    # ---------------------------------------------------------

    chat = TeamChat(
        loan_application_id=application.id,
        sender_admin_id=employee.id,
        message_text=message_text,
        message_type="text",
        reply_to_remark_id=payload.reply_to_remark_id,
        is_read=False,
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    sender_name = (
        getattr(employee, "name", None)
        or getattr(employee, "full_name", None)
        or "You"
    )

    return {
        "success": True,
        "data": {
            "id": chat.id,
            "loan_application_id": chat.loan_application_id,
            "sender_admin_id": chat.sender_admin_id,
            "sender_name": sender_name,
            "message_text": chat.message_text,
            "message_type": chat.message_type,
            "reply_to_remark_id": chat.reply_to_remark_id,
            "is_read": chat.is_read,
            "created_at": chat.created_at,
            "updated_at": chat.updated_at,
        },
    }

def delete_team_chat(
    db: Session,
    employee,
    application_id: str,
    chat_id: int,
):
    # ---------------------------------------------------------
    # FIND APPLICATION
    # ---------------------------------------------------------

    application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.unique_id == application_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    # ---------------------------------------------------------
    # FIND MESSAGE
    # ---------------------------------------------------------

    chat = (
        db.query(TeamChat)
        .filter(
            TeamChat.id == chat_id,
            TeamChat.loan_application_id == application.id,
            TeamChat.deleted_at.is_(None),
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat message not found",
        )

    # ---------------------------------------------------------
    # SOFT DELETE
    # ---------------------------------------------------------

    chat.deleted_at = datetime.now()
    chat.deleted_by_admin_id = employee.id

    db.commit()

    return {
        "success": True,
        "message": "Chat message deleted successfully",
    }