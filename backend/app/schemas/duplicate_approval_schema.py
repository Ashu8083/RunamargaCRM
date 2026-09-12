from pydantic import BaseModel


class DuplicateApprovalCreateRequest(BaseModel):

    loan_id: int | None = None

    rm_id: int | None = None

    name: str | None = None

    phone: str | None = None

    loan_type_id: int | None = None

    loan_amount: float | None = None

    loan_purpose: str | None = None

    reference_name: str | None = None