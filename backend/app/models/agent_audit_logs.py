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


class AgentAuditLog(Base):

    __tablename__ = "agent_audit_log"

    id = Column(Integer,
                autoincrement=True,
                primary_key=True,
                index=True)
    action = Column(String,
                    nullable=False,
                    index=True)

    agent_id = Column(Integer,
                       ForeignKey('employee_contexts.id'),
                       )

    action_by_id = Column(Integer,
                        ForeignKey('employee_contexts.id'),
    )

    report_to_id = Column(Integer,
                       ForeignKey('employee_contexts.id'),
                       index=True)

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
        foreign_keys=[agent_id],
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


