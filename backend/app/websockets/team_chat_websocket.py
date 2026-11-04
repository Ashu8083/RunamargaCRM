# backend/app/websockets/team_chat_websocket.py
from collections import defaultdict

from fastapi import WebSocket
from fastapi.encoders import jsonable_encoder

from sqlalchemy.orm import Session

from app.models.team_chat import TeamChat


class TeamChatConnectionManager:

    def __init__(self):
        self.active_connections = defaultdict(set)

    async def connect(
        self,
        application_id: str,
        websocket: WebSocket,
    ):
        await websocket.accept()

        self.active_connections[
            str(application_id)
        ].add(websocket)

    def disconnect(
        self,
        application_id: str,
        websocket: WebSocket,
    ):
        connection_key = str(application_id)
        connections = self.active_connections.get(
            connection_key
        )

        if not connections:
            return

        connections.discard(websocket)

        if not connections:
            self.active_connections.pop(
                connection_key,
                None,
            )

    async def broadcast(
        self,
        application_id: str,
        message: dict,
    ):
        connection_key = str(application_id)
        connections = self.active_connections.get(
            connection_key,
            set(),
        )

        disconnected = []

        for websocket in tuple(connections):
            try:
                await websocket.send_json(
                    jsonable_encoder(message)
                )

            except Exception:
                disconnected.append(websocket)

        for websocket in disconnected:
            self.disconnect(
                connection_key,
                websocket,
            )

    async def send_message(
        self,
        application_id: str,
        websocket: WebSocket,
        employee,
        db: Session,
        message_data: dict,
    ):
        message_text = (
            message_data.get("message_text")
            if message_data
            else None
        )

        if not message_text:
            await websocket.send_json({
                "success": False,
                "error": "Message is required",
            })
            return

        message_text = message_text.strip()

        if not message_text:
            await websocket.send_json({
                "success": False,
                "error": "Message is required",
            })
            return

        chat = TeamChat(
            loan_application_id=message_data[
                "loan_application_id"
            ],
            sender_admin_id=employee.context_id,
            message_text=message_text,
            message_type="text",
            reply_to_remark_id=message_data.get(
                "reply_to_remark_id"
            ),
            is_read=False,
        )

        db.add(chat)
        db.commit()
        db.refresh(chat)

        sender_name = getattr(employee, "name", None)

        response = {
            "success": True,
            "data": {
                "id": chat.id,
                "loan_application_id":
                    chat.loan_application_id,
                "sender_admin_id":
                    chat.sender_admin_id,
                "sender_employee_id": employee.id,
                "sender_name": sender_name,
                "sender_context_name": getattr(
                    employee,
                    "context_name",
                    None,
                ),
                "message_text":
                    chat.message_text,
                "message_type":
                    chat.message_type,
                "reply_to_remark_id":
                    chat.reply_to_remark_id,
                "is_read": chat.is_read,
                "created_at":
                    chat.created_at,
                "updated_at":
                    chat.updated_at,
            },
        }

        await self.broadcast(
            application_id,
            response,
        )


team_chat_manager = TeamChatConnectionManager()
