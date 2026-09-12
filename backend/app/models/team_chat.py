# app/models/team_chat.py

from sqlalchemy import (
    Column,
    Integer,
    Text,
    ForeignKey,
    TIMESTAMP,
    Boolean,
    Enum
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base


class TeamChat(Base):
    __tablename__ = "team_chat"

    # -------------------------
    # Identity
    # -------------------------
    id = Column(Integer, primary_key=True, index=True)

    # -------------------------
    # Message content
    # -------------------------
    message_text = Column(Text, nullable=True)

    message_type = Column(
        Enum("text", "image", "file", name="loan_team_remark_type_enum"),
        nullable=False,
        default="text"
    )

    # -------------------------
    # Context
    # -------------------------
    loan_application_id = Column(
        Integer,
        ForeignKey("loan_applications.id", ondelete="CASCADE"),
        nullable=True
    )

    sender_admin_id = Column(
        Integer,
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=True
    )

    # -------------------------
    # Reply support (self reference)
    # -------------------------
    reply_to_remark_id = Column(
        Integer,
        ForeignKey("team_chat.id", ondelete="SET NULL"),
        nullable=True
    )

    # -------------------------
    # File metadata
    # -------------------------
    file_path = Column(Text, nullable=True)
    file_name = Column(Text, nullable=True)
    file_size = Column(Integer, nullable=True)
    file_mime_type = Column(Text, nullable=True)

    # -------------------------
    # Read flag (kept as-is)
    # -------------------------
    is_read = Column(
        Boolean,
        nullable=False,
        server_default="false"
    )

    # -------------------------
    # Timestamps
    # -------------------------
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now()
    )

    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True
    )

    deleted_by_admin_id = Column(
        Integer,
        ForeignKey("employees.id", ondelete="SET NULL"),
        nullable=True
    )

    # -------------------------
    # Relationships
    # -------------------------
    loan_application = relationship(
        "LoanApplication",
        
    )

    reply_to = relationship(
        "TeamChat",
        remote_side=[id]
    )
