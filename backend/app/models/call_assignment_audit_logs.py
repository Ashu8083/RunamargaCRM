
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

class CallAssignmentAuditLogs(Base):


    __tablename__ = "call_assignment_audit_logs"

    id = Column(Integer,
                autoincrement=True,
                primary_key=True,
                index=True)
    action = Column(String,
                    nullable=False,
                    index=True)

    customer_phone = Column(
                            String(225),
                            nullable=True,
                            )

    assigned_to_id = Column(Integer,
                       ForeignKey('employee_contexts.id'),
                       )

    assigned_to_phone = Column(
        ForeignKey('phone_numbers.id'),
        nullable=True,
    )

    assigned_by_id = Column(Integer,
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

    target_phone_number = relationship(
        "PhoneNumber",
        foreign_keys=[assigned_to_phone],
        lazy="select",
    )

    # Relationships to Employee
    performer = relationship(
        "EmployeeContext",
        foreign_keys=[assigned_by_id],
        lazy="select",
    )

    target = relationship(
        "EmployeeContext",
        foreign_keys=[assigned_to_id],
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