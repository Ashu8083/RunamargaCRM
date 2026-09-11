from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.models.base import Base


class LoanDocument(Base):
    __tablename__ = "loan_documents"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(
        Integer,
        ForeignKey("loan_applications.id", ondelete="CASCADE"),
        nullable=True
    )
    path = Column(String, nullable=True)
    doc_type = Column(String, nullable=True)
    bank_stmt_pass = Column(String, nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now()
    )
    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True
    )