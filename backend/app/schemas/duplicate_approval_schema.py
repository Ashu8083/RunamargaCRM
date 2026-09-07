# backend/app/schemas/duplicate_approval_schema.py
from pydantic import BaseModel


class DuplicateApprovalCreateRequest(BaseModel):

    loan_application_id: int

    name: str | None = None

    phone: str | None = None

    loan_type_id: int | None = None

    loan_amount: float | None = None

    loan_purpose: str | None = None

    reference_name: str | None = None