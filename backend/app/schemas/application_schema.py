# app/schemas/application_schema.py
from pydantic import BaseModel
from datetime import date

class UpdateApplicationLoanTypeRequest(BaseModel):
    loan_type_id: int
class UpdateApplicationStatusRequest(BaseModel):
    status: str
    rejected_remarks: str | None = None
    revert_rejection_date: date | None = None
class LoanApplicationCreateRequest(BaseModel):

    rm_id: int | None = None

    state_id: int | None = None
    city_id: int | None = None
    loan_type_id: int

    name: str
    phone: str
    gender: str

    loan_amount: float
    credit_score: int | None = None

    reference_name: str
    loan_purpose: str

    remarks: str | None = None