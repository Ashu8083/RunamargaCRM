# backend/app/models/loan_shuffle_history.py

from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship

from app.models.base import Base


class LoanShuffleHistory(Base):
    __tablename__ = "loan_shuffle_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # EmployeeContext.id of the person who performed the shuffle
    shuffled_by_context_id = Column(
        Integer,
        ForeignKey("employee_contexts.id"),
        nullable=False,
    )

    # Final/target assignment for this shuffle operation
    to_agent_context_id = Column(
        Integer,
        ForeignKey("employee_contexts.id"),
        nullable=True,
    )

    to_rm_context_id = Column(
        Integer,
        ForeignKey("employee_contexts.id"),
        nullable=True,
    )

    # Exact per-loan before/after information
    #
    # Example:
    #
    # [
    #     {
    #         "loan_id": 101,
    #         "from_agent_context_id": 20,
    #         "to_agent_context_id": 50,
    #         "from_rm_context_id": 30,
    #         "to_rm_context_id": 60
    #     }
    # ]
    loan_ids = Column(
        JSON,
        nullable=False,
    )

    shuffled_by_context = relationship(
        "EmployeeContext",
        foreign_keys=[shuffled_by_context_id],
        lazy="joined",
    )

    to_agent_context = relationship(
        "EmployeeContext",
        foreign_keys=[to_agent_context_id],
        lazy="joined",
    )

    to_rm_context = relationship(
        "EmployeeContext",
        foreign_keys=[to_rm_context_id],
        lazy="joined",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    deleted_at = Column(
        DateTime,
        nullable=True,
    )