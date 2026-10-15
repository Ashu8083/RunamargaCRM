# backend\app\models\reminders.py
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    DateTime,
    ForeignKey,
    Text,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Reminder(Base):
    __tablename__ = "reminders"

    # =========================================================
    # PRIMARY KEY
    # =========================================================

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    # =========================================================
    # OWNER / CREATOR
    # =========================================================

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id"),
        nullable=False,
        index=True,
    )

    # =========================================================
    # APPLICATION
    # =========================================================

    application_id: Mapped[int] = mapped_column(
        ForeignKey("loan_applications.id"),
        nullable=False,
        index=True,
    )

    # =========================================================
    # REMINDER
    # =========================================================

    reminder_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )

    note: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # =========================================================
    # STATUS
    # =========================================================

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="pending",
        server_default="pending",
        index=True,
    )

    # =========================================================
    # COMPLETION
    # =========================================================

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # =========================================================
    # AUDIT
    # =========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )

    # =========================================================
    # RELATIONSHIPS
    # =========================================================

    employee = relationship(
        "Employee",
        foreign_keys=[employee_id],
    )

    application = relationship(
        "LoanApplication",
        foreign_keys=[application_id],
    )