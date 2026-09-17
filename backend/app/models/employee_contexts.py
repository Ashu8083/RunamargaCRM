# backend\app\models\employee_contexts.py
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

    # Which EmployeeContext this context reports to
    #
    # AGENT           → AGENT_TEAM_LEAD context
    # RM              → RM_TEAM_LEAD context
    # AGENT_TEAM_LEAD → MANAGER context
    # RM_TEAM_LEAD    → MANAGER context
    # GLOBAL           → NULL
    #
    # IMPORTANT:
    # This points to employee_contexts.id,
    # NOT employees.id.

    reports_to_id = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
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

    # ------------------------------------------------------------------------
    # Employee
    # ------------------------------------------------------------------------

    employee = relationship(
        "Employee",
        foreign_keys=[employee_id],
        back_populates="contexts",
    )

    # ------------------------------------------------------------------------
    # Context
    # ------------------------------------------------------------------------

    context = relationship(
        "Context",
        back_populates="employee_contexts",
    )

    audit_logs = relationship(
        "AuditLog",
        cascade="all, delete-orphan",
        back_populates="employee_contexts",
    )
    # ------------------------------------------------------------------------
    # Hierarchy
    # ------------------------------------------------------------------------

    # This context reports to another EmployeeContext.
    reports_to = relationship(
        "EmployeeContext",
        foreign_keys=[reports_to_id],
        remote_side=[id],
        back_populates="reporting_contexts",
    )

    # These EmployeeContexts report to this context.
    reporting_contexts = relationship(
        "EmployeeContext",
        foreign_keys=[reports_to_id],
        back_populates="reports_to",
    )

    # ------------------------------------------------------------------------
    # Permissions
    # ------------------------------------------------------------------------

    permissions = relationship(
        "EmployeeContextPermission",
        back_populates="employee_context",
        cascade="all, delete-orphan",
    )

    # ------------------------------------------------------------------------
    # Constraints
    # ------------------------------------------------------------------------

    __table_args__ = (
        UniqueConstraint(
            "employee_id",
            "context_id",
            name="uix_employee_context",
        ),
    )