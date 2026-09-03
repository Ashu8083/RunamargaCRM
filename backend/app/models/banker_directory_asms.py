# app/models/banker_directory_asms.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

class BankerDirectoryASM(Base):
    __tablename__ = "banker_directory_asms"

    id = Column(Integer, primary_key=True, index=True)
    banker_directory_id = Column(
        Integer,
        ForeignKey("banker_directories.id", ondelete="CASCADE"),
        nullable=False
    )

    name = Column(String, nullable=False)
    contact = Column(String, nullable=True)
    email = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    banker_directory = relationship("BankerDirectory", back_populates="asms")
