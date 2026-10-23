# backend/app/schemas/api/auth/auth_schema.py

from pydantic import BaseModel, ConfigDict, Field


# ========================================================================
# EMPLOYEE IDENTIFICATION REQUEST
# ========================================================================
#
# Android sends the employee code.
#
# No face image is sent at this stage.
#
# ========================================================================

class EmployeeIdentifyRequest(BaseModel):

    employee_code: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Employee identification code.",
    )


# ========================================================================
# EMPLOYEE IDENTIFICATION RESPONSE
# ========================================================================
#
# This response tells Android what it needs to do next.
#
#
# CASE 1
# ------------------------------------------------------------------------
#
# Employee has registered face profiles:
#
#     next_step = FACE_LOGIN
#
#
# CASE 2
# ------------------------------------------------------------------------
#
# Employee does not have registered face profiles:
#
#     next_step = FACE_ENROLLMENT
#
#     temporary_token = short-lived enrollment JWT
#
#     temporary_token_expires_in = 300 seconds
#
# ========================================================================

class EmployeeIdentifyResponse(BaseModel):

    employee_id: int

    employee_code: str

    employee_name: str

    face_profile_exists: bool

    next_step: str

    temporary_token: str | None = None

    temporary_token_expires_in: int | None = None

    message: str


# ========================================================================
# FACE LOGIN RESPONSE
# ========================================================================
#
# Returned after successful face authentication.
#
#
# The employee can have three registered face profiles:
#
#     FRONT
#     LEFT
#     RIGHT
#
#
# matched_capture_type:
#
#     Identifies which registered capture produced
#     the highest similarity.
#
# ========================================================================

class FaceLoginResponse(BaseModel):

    message: str

    employee_id: int

    employee_context_id: int | None = None

    context_name: str | None = None

    employee_code: str

    employee_name: str

    access_token: str

    refresh_token: str

    token_type: str = "bearer"

    face_status: str

    face_registered: bool

    matched_capture_type: str | None = None

    face_similarity: float | None = None


# ========================================================================
# FACE PROFILE RESPONSE
# ========================================================================
#
# Represents one registered face profile.
#
# One employee will normally have:
#
#     FRONT
#     LEFT
#     RIGHT
#
# Each capture has its own database row and profile ID.
#
# ========================================================================

class FaceProfileResponse(BaseModel):

    face_profile_id: int

    capture_type: str


# ========================================================================
# FACE ENROLLMENT RESPONSE
# ========================================================================
#
# Returned after ALL THREE face captures are successfully registered.
#
#
# Expected profiles:
#
#     FRONT
#     LEFT
#     RIGHT
#
#
# Example:
#
# {
#     "employee_id": 1,
#     "face_profiles": [
#         {
#             "face_profile_id": 10,
#             "capture_type": "FRONT"
#         },
#         {
#             "face_profile_id": 11,
#             "capture_type": "LEFT"
#         },
#         {
#             "face_profile_id": 12,
#             "capture_type": "RIGHT"
#         }
#     ],
#     "face_profile_count": 3,
#     "temporary_token_revoked": true
# }
#
# ========================================================================

class FaceEnrollmentResponse(BaseModel):

    message: str

    employee_id: int

    face_profiles: list[FaceProfileResponse]

    face_profile_count: int

    temporary_token_revoked: bool


# ========================================================================
# REFRESH TOKEN REQUEST & RESPONSE
# ========================================================================
#
# Android sends refresh_token in request body.
#
# ========================================================================

class RefreshTokenRequest(BaseModel):

    refresh_token: str = Field(
        ...,
        min_length=1,
        description="Refresh token to exchange for a new access token.",
    )


class RefreshTokenResponse(BaseModel):

    message: str

    access_token: str

    token_type: str = "bearer"


# ========================================================================
# LOGOUT REQUEST & RESPONSE
# ========================================================================
#
# Used for Android logout API to revoke session and tokens.
#
# ========================================================================

class LogoutRequest(BaseModel):

    refresh_token: str | None = Field(
        default=None,
        description="Optional refresh token to revoke. If omitted, tokens are resolved from Authorization header or employee session.",
    )

    device_id: str | None = Field(
        default=None,
        description="Optional device ID to scope revocation.",
    )


class LogoutResponse(BaseModel):

    success: bool = True

    message: str = "Logout successful. Token revoked."

    revoked_tokens_count: int = 0


# ========================================================================
# EMPLOYEE CONTEXT RESPONSE
# ========================================================================
#
# Represents an employee's context (role assignment).
# When an employee has multiple contexts, all contexts are returned.
#
# ========================================================================

class EmployeeContextResponse(BaseModel):

    id: int
    name: str
    context_id: int | None = None
    employee_context_id: int | None = None
    code: str | None = None
    is_default: bool = False

    model_config = ConfigDict(from_attributes=True)



# ========================================================================
# RM PHONE NUMBER RESPONSE
# ========================================================================
#
# Fetched based on employee_context_id for RM context only.
#
# ========================================================================

class RMPhoneNumberResponse(BaseModel):

    phone_number_id: int

    model_config = ConfigDict(from_attributes=True)