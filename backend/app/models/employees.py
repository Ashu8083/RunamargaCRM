from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    TIMESTAMP,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    phone = Column(
        String,
        unique=True,
        nullable=True,
        index=True,
    )

    email = Column(
        String,
        unique=True,
        nullable=True,
        index=True,
    )

    role_id = Column(
        Integer,
        ForeignKey("roles.id"),
        nullable=False,
        index=True,
    )

    login_otp_hash = Column(
    String,
        nullable=True,
    )

    login_otp_expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    login_otp_sent_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    status = Column(
        Enum(
            "active",
            "inactive", "WFH",
            name="employee_status_enum",
        ),
        nullable=False,
        default="active",
        server_default="active",
    )

    deactivate = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )

    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
    )

    # Main role
    role = relationship(
        "Role",
        back_populates="employees",
    )

    # Personal details
    details = relationship(
        "EmployeeDetails",
        back_populates="employee",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Contexts this employee has
    contexts = relationship(
        "EmployeeContext",
        foreign_keys="EmployeeContext.employee_id",
        back_populates="employee",
        cascade="all, delete-orphan",
    )

    # Contexts where this employee is the reporting person
    reporting_contexts = relationship(
        "EmployeeContext",
        foreign_keys="EmployeeContext.reports_to_id",
        back_populates="reports_to",
    )
    employee_roles = relationship(
        "EmployeeRole",
        back_populates="employee",
        cascade="all, delete-orphan",
    )