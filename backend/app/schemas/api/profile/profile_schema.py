# backend/app/schemas/api/profile/profile_schema.py

from pydantic import BaseModel, EmailStr


# ============================================================
# PROFILE RESPONSE
# ============================================================

class ProfileResponse(BaseModel):
    """
    Response schema for GET /android/profile/me.
    Returns only the authenticated employee's name and email.
    """

    name: str
    profile_image: str | None

    class Config:
        from_attributes = True
