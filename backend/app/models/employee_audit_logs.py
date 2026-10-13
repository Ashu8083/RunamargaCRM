from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    Enum, String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.Enums.LogAction import LogAction
from app.models.base import Base

class EmployeeAuditLog(Base):

    __tablename__ = "employee_audit_logs"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    action = Column(
        String(10),
        nullable=False,
        index=True
    )

    # yee (employee_id) who performed the action (creator / performer)
    action_by_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Employee (employee_id) on whom the action was taken (target)
    employee_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Manager (employee_id) to whom creator / target reports
    report_to_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    date_and_time = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=func.now(),
        nullable=False,
        index=True,
    )

    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships to Employee
    performer = relationship(
        "EmployeeContext",
        foreign_keys=[action_by_id],
        lazy="select",
    )

    target = relationship(
        "EmployeeContext",
        foreign_keys=[employee_id],
        lazy="select",
    )

    reporting_manager = relationship(
        "EmployeeContext",
        foreign_keys=[report_to_id],
        lazy="select",
    )

    @property
    def action_time(self):
        return self.date_and_time

    @action_time.setter
    def action_time(self, value):
        self.date_and_time = value


# Alias for singular/plural naming convention
EmployeeAuditLogs = EmployeeAuditLog




