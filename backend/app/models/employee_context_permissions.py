# app/models/employee_context_permissions.py
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    TIMESTAMP,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class EmployeeContextPermission(Base):
    __tablename__ = "employee_context_permissions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    employee_context_id = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    permission_id = Column(
        Integer,
        ForeignKey(
            "permissions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
    )

    employee_context = relationship(
        "EmployeeContext",
        back_populates="permissions",
    )

    permission = relationship(
        "Permission",
        back_populates="employee_context_permissions",
    )

    __table_args__ = (
        UniqueConstraint(
            "employee_context_id",
            "permission_id",
            name="uix_employee_context_permission",
        ),
    )