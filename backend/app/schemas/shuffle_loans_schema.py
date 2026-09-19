# backend/app/schemas/shuffle_loans_schema.py

from typing import List, Optional

from pydantic import BaseModel, Field


# =========================================================
# SHUFFLE LOANS FILTERS
# =========================================================

class ShuffleLoansFilters(BaseModel):

    search: Optional[str] = None

    # EmployeeContext.id for AGENT context
    agent_id: Optional[int] = Field(
        default=None,
        gt=0,
    )

    # EmployeeContext.id for RM context
    rm_id: Optional[int] = Field(
        default=None,
        gt=0,
    )

    loan_type_id: Optional[int] = Field(
        default=None,
        gt=0,
    )

    status: Optional[str] = None

    # =====================================================
    # PAGINATION
    # =====================================================

    page: int = Field(
        default=1,
        ge=1,
    )

    limit: int = Field(
        default=30,
        ge=1,
        le=200,
    )


# =========================================================
# SHUFFLE LOANS ASSIGN
# =========================================================

class ShuffleLoansAssign(BaseModel):

    application_ids: List[int] = Field(
        ...,
        min_length=1,
    )

    # EmployeeContext.id for AGENT context
    agent_id: Optional[int] = Field(
        default=None,
        gt=0,
    )

    # EmployeeContext.id for RM context
    rm_id: Optional[int] = Field(
        default=None,
        gt=0,
    )

    loan_type_id: Optional[int] = Field(
        default=None,
        gt=0,
    )