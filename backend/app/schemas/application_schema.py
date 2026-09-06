# app/schemas/application_schema.py
from pydantic import BaseModel
from datetime import date

class UpdateApplicationLoanTypeRequest(BaseModel):
    loan_type_id: int
class UpdateApplicationStatusRequest(BaseModel):
    status: str
    rejected_remarks: str | None = None
    revert_rejection_date: date | None = None