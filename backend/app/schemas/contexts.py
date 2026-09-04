# backend/app/schemas/contexts.py
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ============================================================================
# Create Context
# ============================================================================

class ContextCreate(BaseModel):
    """
    Request body for creating a new Role/Context.
    """

    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    code: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool = True


# ============================================================================
# Update Context
# ============================================================================

class ContextUpdate(BaseModel):
    """
    Request body for updating an existing Role/Context.

    All fields are optional so the API can support
    partial updates.
    """

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    code: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool | None = None


# ============================================================================
# Response
# ============================================================================

class ContextResponse(BaseModel):
    """
    Response returned by the Roles/Contexts API.
    """

    id: int

    name: str

    code: str

    description: str | None

    is_active: bool

    created_at: datetime | None

    updated_at: datetime | None

    model_config = ConfigDict(
        from_attributes=True,
    )