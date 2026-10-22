# backend/app/models/holidays.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    Boolean,
    TIMESTAMP,
    UniqueConstraint,
)
from sqlalchemy.sql import func

from app.models.base import Base


class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True)

    name = Column(
        String(150),
        nullable=False,
    )

    date = Column(
        Date,
        nullable=False,
        index=True,
    )

    description = Column(
        Text,
        nullable=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
    )

    created_at = Column(
        TIMESTAMP(timezone=False),
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP(timezone=False),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    __table_args__ = (
        UniqueConstraint(
            "date",
            name="uq_holidays_date",
        ),
    )