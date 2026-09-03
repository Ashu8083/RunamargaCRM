# app/models/contexts.py
from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    TIMESTAMP,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class Context(Base):
    __tablename__ = "contexts"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    code = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    description = Column(
        String,
        nullable=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
    )

    employee_contexts = relationship(
        "EmployeeContext",
        back_populates="context",
    )