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
    
class ApplicationHeaderUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    referral: str | None = None


class ApplicationLoanDetailsUpdate(BaseModel):
    email: str | None = None
    gender: str | None = None
    marital_status: str | None = None
    date_of_birth: date | None = None
    pan_number: str | None = None
    aadhaar_number: str | None = None
    loan_amount: float | None = None
    loan_tenure: int | None = None
    bank_account_number: str | None = None
    ifsc_code: str | None = None


class AddApplicationAddressRequest(BaseModel):
    address_type: str
    address: str


class AddApplicationReferenceRequest(BaseModel):
    name: str
    phone: str
    relation: str | None = None
    address: str | None = None

class AddApplicationCoApplicantRequest(BaseModel):
    name: str
    phone: str
    relation: str | None = None
    pan_number: str | None = None
    aadhaar_number: str | None = None

from pydantic import BaseModel


class UploadApplicationDocumentRequest(BaseModel):
    doc_type: str
    bank_stmt_pass: str | None = None