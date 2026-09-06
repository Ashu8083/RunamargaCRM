# app/models/banker_directories.py
from sqlalchemy import Column, Integer, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

class BankerDirectory(Base):
    __tablename__ = "banker_directories"

    id = Column(Integer, primary_key=True, index=True)

    bank_id = Column(Integer, ForeignKey("banks.id", ondelete="CASCADE"), nullable=False)
    loan_type_id = Column(Integer, ForeignKey("loan_types.id", ondelete="CASCADE"), nullable=False)

    # GROUPING FIELDS
    state_id = Column(Integer, ForeignKey("states.id"), nullable=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)

    status = Column(Enum("0", "1", name="banker_status"), default="1")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    # RELATIONSHIPS
    bank = relationship("Bank", backref="banker_directories")
    loan_type = relationship("LoanType", backref="banker_directories")
    state = relationship("State")
    city = relationship("City")

    # MULTIPLE ASM ENTRIES
    asms = relationship(
        "BankerDirectoryASM",
        back_populates="banker_directory",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # MULTIPLE SM ENTRIES
    sms = relationship(
        "BankerDirectorySM",
        back_populates="banker_directory",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
