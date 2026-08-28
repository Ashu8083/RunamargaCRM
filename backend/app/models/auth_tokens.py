# app/models/auth_tokens.py

from sqlalchemy import (
    Column,
    BigInteger,
    Integer,
    String,
    TIMESTAMP,
    ForeignKey,
    DECIMAL,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class AuthToken(Base):
    __tablename__ = "auth_tokens"

    id = Column(
        BigInteger,
        primary_key=True,
        index=True,
    )

    employee_id = Column(
        Integer,
        ForeignKey(
            "employees.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    token_hash = Column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )

    token_type = Column(
        String(20),
        nullable=False,
        default="access",
        server_default="access",
    )

    expires_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
    )

    revoked_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    ip_address = Column(
        String(45),
        nullable=True,
    )

    device_id = Column(
        String(100),
        nullable=True,
    )

    device_type = Column(
        String(50),
        nullable=True,
    )

    latitude = Column(
        DECIMAL(10, 7),
        nullable=True,
    )

    longitude = Column(
        DECIMAL(10, 7),
        nullable=True,
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    employee = relationship(
        "Employee",
    )