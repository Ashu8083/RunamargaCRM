# app\models\attendance.py
from sqlalchemy import (
    Column,
    Integer,
    Date,
    Boolean,
    Float,
    ForeignKey,
    TIMESTAMP,
    UniqueConstraint,String
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)

    employee_id = Column(
        Integer,
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    date = Column(Date, nullable=False, index=True)

    # Check-in
    check_in = Column(TIMESTAMP(timezone=False), nullable=True)
    check_in_latitude = Column(Float, nullable=True)
    check_in_longitude = Column(Float, nullable=True)
    check_in_accuracy = Column(Float, nullable=True)
    check_in_confidence = Column(Float, nullable=True)

    # Lunch (only once per day)
    lunch_out = Column(TIMESTAMP(timezone=False), nullable=True)
    lunch_in = Column(TIMESTAMP(timezone=False), nullable=True)

    # Check-out
    check_out = Column(TIMESTAMP(timezone=False), nullable=True)
    check_out_latitude = Column(Float, nullable=True)
    check_out_longitude = Column(Float, nullable=True)
    check_out_accuracy = Column(Float, nullable=True)
    check_out_confidence = Column(Float, nullable=True)

    # Mode
    is_wfh = Column(Boolean, nullable=False, server_default="false")
    check_in_image = Column(String, nullable=True)
    check_out_image = Column(String, nullable=True)
    # Metadata
    created_at = Column(
        TIMESTAMP(timezone=False),
        nullable=False,
        server_default=func.now(),
    )
    deleted_at = Column(TIMESTAMP(timezone=False), nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "employee_id",
            "date",
            name="uq_attendance_employee_date",
        ),
    )   

    employee = relationship(
        "Employee",
        foreign_keys=[employee_id],
        back_populates="attendances",
    )