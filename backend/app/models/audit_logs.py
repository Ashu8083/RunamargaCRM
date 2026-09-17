from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.contexts import Context
from app.models.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    request_id = Column(
        String(100),
        nullable=True,
        index=True,
    )

    employee_context_id = Column(
        Integer,
        ForeignKey("employee_contexts.id"),
        nullable=True,
        index=True,
    )

    action = Column(
        String(100),
        nullable=False,
        index=True,
    )

    module = Column(
        String(100),
        nullable=False,
        index=True,
    )

    entity_type = Column(
        String(100),
        nullable=True,
    )

    entity_id = Column(
        String(100),
        nullable=True,
        index=True,
    )

    description = Column(
        Text,
        nullable=True,
    )

    user_agent = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    employee_contexts = relationship(
        "EmployeeContext",
        back_populates="audit_logs",

    )