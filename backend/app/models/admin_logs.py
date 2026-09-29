from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.Enums.LogAction import LogAction
from app.models.base import Base


class AdminLogs(Base):
    __tablename__ = "admin_logs"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    action = Column(
        Enum(LogAction, name="logaction_enum", create_type=False),
        nullable=False,
        default=LogAction.create,
        index=True,
    )

    # Admin (employee_context_id) who performed the action
    action_by_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Admin (employee_context_id) on whom the action was taken
    admin_id = Column(
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

    # Relationships to EmployeeContext
    performer = relationship(
        "EmployeeContext",
        foreign_keys=[action_by_id],
        lazy="select",
    )

    target = relationship(
        "EmployeeContext",
        foreign_keys=[admin_id],
        lazy="select",
    )

    @property
    def action_time(self):
        return self.date_and_time

    @action_time.setter
    def action_time(self, value):
        self.date_and_time = value


# Alias for singular naming convention
AdminLog = AdminLogs
