# backend/app/controllers/Loans/team_chat_controller.py
import os
import uuid
from datetime import datetime

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.models.team_chat import TeamChat
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.loan_applications import LoanApplication
from app.schemas.team_chat import CreateTeamChatRequest


UPLOAD_DIR = "app/static/uploads/team_chat"


def _get_sender_context(
    db: Session,
    employee,
    sender_context_id: int | None = None,
):
    query = db.query(EmployeeContext).filter(
        EmployeeContext.employee_id == employee.id,
        EmployeeContext.is_active.is_(True),
        EmployeeContext.deleted_at.is_(None),
    )

    context = None
    if sender_context_id is not None:
        context = query.filter(
            EmployeeContext.id == sender_context_id,
        ).first()

    if context is None:
        context = query.filter(
            EmployeeContext.is_default.is_(True),
        ).first()

    if context is None:
        context = query.first()

    if context is None:
        raise HTTPException(
            status_code=400,
            detail="An active employee context is required to send chat messages",
        )

    return context


def _sender_details(db: Session, sender_context_id: int | None):
    context = None
    if sender_context_id is not None:
        context = db.query(EmployeeContext).filter(
            EmployeeContext.id == sender_context_id,
        ).first()

    if context and context.employee:
        return (
            context.employee.id,
            context.employee.name,
            context.context.name if context.context else None,
        )

    # Compatibility with messages created before sender_admin_id used
    # employee_contexts.id instead of employees.id.
    employee = None
    if sender_context_id is not None:
        employee = db.query(Employee).filter(
            Employee.id == sender_context_id,
        ).first()

    return (
        employee.id if employee else None,
        employee.name if employee else None,
        None,
    )


def _serialize_chat(db: Session, chat: TeamChat):
    (
        sender_employee_id,
        sender_name,
        sender_context_name,
    ) = _sender_details(
        db,
        chat.sender_admin_id,
    )

    return {
        "id": chat.id,
        "loan_application_id": chat.loan_application_id,
        "sender_admin_id": chat.sender_admin_id,
        "sender_employee_id": sender_employee_id,
        "sender_name": sender_name,
        "sender_context_name": sender_context_name,
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
        data.append(_serialize_chat(db, chat))

    return {
        "success": True,
        "data": data,
    }

def create_team_chat(
    db: Session,
    employee,
    application_id: str,
    payload: CreateTeamChatRequest,
    sender_context_id: int | None = None,
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

    sender_context = _get_sender_context(
        db,
        employee,
        sender_context_id,
    )

    chat = TeamChat(
        loan_application_id=application.id,
        sender_admin_id=sender_context.id,
        message_text=message_text,
        message_type="text",
        reply_to_remark_id=payload.reply_to_remark_id,
        is_read=False,
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return {
        "success": True,
        "data": _serialize_chat(db, chat),
    }

def delete_team_chat(
    db: Session,
    employee,
    application_id: str,
    chat_id: int,
    sender_context_id: int | None = None,
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
    sender_context = _get_sender_context(
        db,
        employee,
        sender_context_id,
    )
    chat.deleted_by_admin_id = sender_context.id

    db.commit()

    return {
        "success": True,
        "message": "Chat message deleted successfully",
    }
