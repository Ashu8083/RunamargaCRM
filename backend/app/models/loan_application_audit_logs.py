from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base


class LoanApplicationAuditLog(Base):

    __tablename__ = "loan_application_audit_logs"

    id = Column(
        Integer,
        autoincrement=True,
        primary_key=True,
        index=True,
    )

    action = Column(
        String,
        nullable=False,
        index=True,
    )

    # EmployeeContext ID of the user performing the action
    action_by_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # LoanApplication ID on which the action was taken
    loan_application_id = Column(
        Integer,
        ForeignKey("loan_applications.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # EmployeeContext ID of reporting manager
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

    # Relationships
    performer = relationship(
        "EmployeeContext",
        foreign_keys=[action_by_id],
        lazy="select",
    )

    loan_application = relationship(
        "LoanApplication",
        foreign_keys=[loan_application_id],
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

    @property
    def action_by(self):
        return self.action_by_id

    @action_by.setter
    def action_by(self, value):
        self.action_by_id = value

    @property
    def action_on(self):
        return self.loan_application_id

    @action_on.setter
    def action_on(self, value):
        self.loan_application_id = value

    @property
    def report_to(self):
        return self.report_to_id

    @report_to.setter
    def report_to(self, value):
        self.report_to_id = value


# Alias for singular/plural naming convention
LoanApplicationAuditLogs = LoanApplicationAuditLog
