# backend\app\schemas\loan_type.py
from pydantic import BaseModel, ConfigDict

from app.models.loan_types import LoanTypeStatus


class LoanTypeResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(
        from_attributes=True
    )