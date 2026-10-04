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


class CallReassignmentAuditLog(Base):

    __tablename__ = "call_reassignment_audit_logs"

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

    customer_phone = Column(
        String(225),
        nullable=True,
    )

    # EmployeeContext ID of the user performing the reassignment
    reassigned_by_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # =========================================================
    # FROM (previous assignee)
    # =========================================================

    # EmployeeContext ID of the previous assignee
    from_assigned_to_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # report_to of the previous assignee
    from_report_to_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # =========================================================
    # TO (new assignee)
    # =========================================================

    # EmployeeContext ID of the new assignee
    to_assigned_to_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # report_to of the new assignee
    to_report_to_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Phone number assigned to (phone_numbers.id)
    assigned_to_phone = Column(
        Integer,
        ForeignKey("phone_numbers.id", ondelete="SET NULL"),
        nullable=True,
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

    # =========================================================
    # Relationships
    # =========================================================

    performer = relationship(
        "EmployeeContext",
        foreign_keys=[reassigned_by_id],
        lazy="select",
    )

    from_assignee = relationship(
        "EmployeeContext",
        foreign_keys=[from_assigned_to_id],
        lazy="select",
    )

    from_reporting_manager = relationship(
        "EmployeeContext",
        foreign_keys=[from_report_to_id],
        lazy="select",
    )

    to_assignee = relationship(
        "EmployeeContext",
        foreign_keys=[to_assigned_to_id],
        lazy="select",
    )

    to_reporting_manager = relationship(
        "EmployeeContext",
        foreign_keys=[to_report_to_id],
        lazy="select",
    )

    target_phone_number = relationship(
        "PhoneNumber",
        foreign_keys=[assigned_to_phone],
        lazy="select",
    )


