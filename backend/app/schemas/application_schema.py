# app/schemas/application_schema.py
from typing import Any
from pydantic import BaseModel,ConfigDict
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

# =========================================================
# LOAN OTHER DETAILS
# =========================================================

class LoanOtherDetailsCreateRequest(BaseModel):
    gross_salary: str | None = None

    tot_exp: str | None = None
    cur_cmp_exp: str | None = None
    cmp_name: str | None = None
    designation: str | None = None

    mother_name: str | None = None
    father_name: str | None = None
    spouse_name: str | None = None

    total_emi: str | None = None
    gst_no: str | None = None
    own_house_proof: str | None = None
    present_loan: str | None = None

    business_nature: str | None = None
    loan_type: str | None = None
    income_type: str | None = None

    katha_type: str | None = None
    const_type: str | None = None

    course_name: str | None = None
    institue_name: str | None = None

    business_name: str | None = None
    turnover: str | None = None


class LoanOtherDetailsUpdateRequest(BaseModel):
    gross_salary: str | None = None

    tot_exp: str | None = None
    cur_cmp_exp: str | None = None
    cmp_name: str | None = None
    designation: str | None = None

    mother_name: str | None = None
    father_name: str | None = None
    spouse_name: str | None = None

    total_emi: str | None = None
    gst_no: str | None = None
    own_house_proof: str | None = None
    present_loan: str | None = None

    business_nature: str | None = None
    loan_type: str | None = None
    income_type: str | None = None

    katha_type: str | None = None
    const_type: str | None = None

    course_name: str | None = None
    institue_name: str | None = None

    business_name: str | None = None
    turnover: str | None = None


class LoanOtherDetailsResponse(BaseModel):
    id: int
    loan_id: int | None = None

    gross_salary: str | None = None

    tot_exp: str | None = None
    cur_cmp_exp: str | None = None
    cmp_name: str | None = None
    designation: str | None = None

    mother_name: str | None = None
    father_name: str | None = None
    spouse_name: str | None = None

    total_emi: str | None = None
    gst_no: str | None = None
    own_house_proof: str | None = None
    present_loan: str | None = None

    business_nature: str | None = None
    loan_type: str | None = None
    income_type: str | None = None

    katha_type: str | None = None
    const_type: str | None = None

    course_name: str | None = None
    institue_name: str | None = None

    business_name: str | None = None
    turnover: str | None = None

    model_config = ConfigDict(from_attributes=True)
    
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



class UploadApplicationDocumentRequest(BaseModel):
    doc_type: str
    bank_stmt_pass: str | None = None

class AssignBankRequest(BaseModel):
    bank_id: int
    dsa_code: str | None = None
    dsa_name: str | None = None


class UpdateBankProcessingWorkflowRequest(BaseModel):
    action: str
    data: dict[str, Any] = {}