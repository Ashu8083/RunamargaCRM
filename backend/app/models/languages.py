# app\models\languages.py
from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from app.models.base import Base

class Language(Base):
    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, onupdate=func.now())
    deleted_at = Column(TIMESTAMP, nullable=True)