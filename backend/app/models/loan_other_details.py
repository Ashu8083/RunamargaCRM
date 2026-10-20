from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.models.base import Base


class LoanOtherDetail(Base):
    __tablename__ = "loan_other_details"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(
        Integer,
        ForeignKey("loan_applications.id", ondelete="CASCADE"),
        nullable=True
    )
    gross_salary = Column(Sring, nullable=True)
    
    tot_exp = Column(String, nullable=True)
    cur_cmp_exp = Column(String, nullable=True)
    cmp_name = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    mother_name = Column(String, nullable=True)
    father_name = Column(String, nullable=True)
    spouse_name = Column(String, nullable=True)
    total_emi = Column(String, nullable=True)
    gst_no = Column(String, nullable=True)
    own_house_proof = Column(String, nullable=True)
    present_loan = Column(String, nullable=True)
    business_nature = Column(String, nullable=True)
    loan_type = Column(String, nullable=True)
    income_type = Column(String, nullable=True)
    katha_type = Column(String, nullable=True)
    const_type = Column(String, nullable=True)
    course_name = Column(String, nullable=True)
    institue_name = Column(String, nullable=True)
    business_name = Column(String, nullable=True)
    turnover = Column(String, nullable=True)

    loan_application = relationship(
        "LoanApplication",
        foreign_keys=[loan_id],
        lazy="select",
    )

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)
