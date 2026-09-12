# backend\app\schemas\shuffle_loans_schema.py
from typing import List, Optional

from pydantic import BaseModel, Field


# =========================================================
# SHUFFLE LOANS FILTERS
# =========================================================

class ShuffleLoansFilters(BaseModel):
    search: Optional[str] = None
    agent_id: Optional[int] = Field(default=None, gt=0)
    rm_id: Optional[int] = Field(default=None, gt=0)
    loan_type_id: Optional[int] = Field(default=None, gt=0)
    status: Optional[str] = None


# =========================================================
# SHUFFLE LOANS ASSIGN
# =========================================================

class ShuffleLoansAssign(BaseModel):

    application_ids: List[int] = Field(
        ...,
        min_length=1,
    )

    agent_id: Optional[int] = Field(
        default=None,
        gt=0,
    )

    rm_id: Optional[int] = Field(
        default=None,
        gt=0,
    )

    loan_type_id: Optional[int] = Field(
        default=None,
        gt=0,
    )