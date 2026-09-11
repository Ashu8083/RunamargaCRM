# app/models/employee_face_profiles.py
from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    TIMESTAMP,
    Float,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY

from app.models.base import Base


class EmployeeFaceProfile(Base):
    __tablename__ = "employee_face_profiles"

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

    # One face embedding per row
    face_embedding = Column(
        ARRAY(Float),
        nullable=False,
    )

    # Type of face sample
    # Examples: FRONT, LEFT, RIGHT, OTHER
    capture_type = Column(
        String(30),
        nullable=False,
    )

    # Path of the captured face image
    image_path = Column(
        String,
        nullable=False,
    )

    created_at = Column(
        TIMESTAMP(timezone=False),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        TIMESTAMP(timezone=False),
        nullable=True,
    )

    updated_by = Column(
        Integer,
        ForeignKey(
            "employees.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    deleted_at = Column(
        TIMESTAMP(timezone=False),
        nullable=True,
    )

    employee = relationship(
        "Employee",
        foreign_keys=[employee_id],
    )

    updated_by_employee = relationship(
        "Employee",
        foreign_keys=[updated_by],
    )