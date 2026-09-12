# backend/app/schemas/team_chat.py

from pydantic import BaseModel
from typing import Optional


class CreateTeamChatRequest(BaseModel):
    message_text: Optional[str] = None
    message_type: str = "text"
    reply_to_remark_id: Optional[int] = None