# app\models\states.py
from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base

class State(Base):
    __tablename__ = "states"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, onupdate=func.now())
    deleted_at = Column(TIMESTAMP, nullable=True)

    cities = relationship("City", back_populates="state")
