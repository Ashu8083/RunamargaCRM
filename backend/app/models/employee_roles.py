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


class EmployeeRole(Base):
    __tablename__ = "employee_roles"

    id = Column(
        Integer,
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

    role_id = Column(
        Integer,
        ForeignKey(
            "roles.id",
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

    employee = relationship(
        "Employee",
        back_populates="employee_roles",
    )

    role = relationship(
        "Role",
        back_populates="employee_roles",
    )

    __table_args__ = (
        UniqueConstraint(
            "employee_id",
            "role_id",
            name="uix_employee_role",
        ),
    )