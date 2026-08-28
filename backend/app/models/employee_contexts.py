from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    TIMESTAMP,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class EmployeeContext(Base):
    __tablename__ = "employee_contexts"

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

    context_id = Column(
        Integer,
        ForeignKey(
            "contexts.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Who this context reports to
    #
    # AGENT           → Agent Team Lead
    # RM              → RM Team Lead
    # AGENT_TEAM_LEAD → Manager
    # RM_TEAM_LEAD    → Manager
    # GLOBAL           → NULL
    reports_to_id = Column(
        Integer,
        ForeignKey(
            "employees.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    is_default = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
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

    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    employee = relationship(
        "Employee",
        foreign_keys=[employee_id],
        back_populates="contexts",
    )

    context = relationship(
        "Context",
        back_populates="employee_contexts",
    )

    reports_to = relationship(
        "Employee",
        foreign_keys=[reports_to_id],
        back_populates="reporting_contexts",
    )

    permissions = relationship(
        "EmployeeContextPermission",
        back_populates="employee_context",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "employee_id",
            "context_id",
            name="uix_employee_context",
        ),
    )