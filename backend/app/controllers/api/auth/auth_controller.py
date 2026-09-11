# backend/app/controllers/api/auth/auth_controller.py

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.schemas.api.auth.auth_schema import (
    EmployeeIdentifyRequest,
    EmployeeIdentifyResponse,
    FaceEnrollmentResponse,
    FaceLoginResponse,
    RefreshTokenResponse,
)

from app.services.api.auth.auth_service import (
    identify_employee,
    enroll_employee_face,
    face_login,
    refresh_access_token,
)


# ========================================================================
# EMPLOYEE IDENTIFICATION
# ========================================================================
#
# Android sends:
#
#     employee_code
#
# This is the FIRST step.
#
# No face image is sent here.
#
#
# Service checks:
#
#     employees
#          ↓
#     employee exists?
#          ↓
#     employee status
#          ↓
#     employee_face_profiles
#          ↓
#     face profile exists?
#
#
# If face exists:
#
#     next_step = FACE_LOGIN
#
#
# If face does not exist:
#
#     next_step = FACE_ENROLLMENT
#     temporary_token = 5 minute token
#
# ========================================================================

def identify_employee_controller(
    db: Session,
    request: EmployeeIdentifyRequest,
    ip_address: str | None = None,
    device_id: str | None = None,
    device_type: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> EmployeeIdentifyResponse:

    result = identify_employee(
        db=db,
        employee_code=request.employee_code,
        ip_address=ip_address,
        device_id=device_id,
        device_type=device_type,
        latitude=latitude,
        longitude=longitude,
    )

    return EmployeeIdentifyResponse(
        employee_id=result["employee_id"],
        employee_code=result["employee_code"],
        employee_name=result["employee_name"],
        face_profile_exists=result["face_profile_exists"],
        next_step=result["next_step"],
        temporary_token=result["temporary_token"],
        temporary_token_expires_in=result[
            "temporary_token_expires_in"
        ],
        message=result["message"],
    )


# ========================================================================
# FACE ENROLLMENT
# ========================================================================
#
# This is a SEPARATE endpoint from face login.
#
# It is used ONLY when /identify returns:
#
#     next_step = FACE_ENROLLMENT
#
#
# Android sends:
#
#     temporary_token
#     front_image
#     left_image
#     right_image
#
#
# Three separate face captures are required:
#
#     FRONT
#     LEFT
#     RIGHT
#
#
# The service:
#
#     temporary token validation
#             ↓
#     employee validation
#             ↓
#     FRONT face validation
#             ↓
#     LEFT face validation
#             ↓
#     RIGHT face validation
#             ↓
#     Generate 3 embeddings
#             ↓
#     Create 3 EmployeeFaceProfile rows
#             ↓
#     temporary token revocation
#
#
# IMPORTANT:
#
# If any one of the three images fails validation,
# enrollment fails.
#
# ========================================================================

async def face_enrollment_controller(
    db: Session,
    temporary_token: str,
    front_image: UploadFile,
    left_image: UploadFile,
    right_image: UploadFile,
) -> FaceEnrollmentResponse:

    # --------------------------------------------------------------------
    # Read FRONT image
    # --------------------------------------------------------------------

    front_image_bytes = await front_image.read()

    if not front_image_bytes:

        raise ValueError(
            "Front face image is required."
        )

    # --------------------------------------------------------------------
    # Read LEFT image
    # --------------------------------------------------------------------

    left_image_bytes = await left_image.read()

    if not left_image_bytes:

        raise ValueError(
            "Left face image is required."
        )

    # --------------------------------------------------------------------
    # Read RIGHT image
    # --------------------------------------------------------------------

    right_image_bytes = await right_image.read()

    if not right_image_bytes:

        raise ValueError(
            "Right face image is required."
        )

    # --------------------------------------------------------------------
    # Pass token and all three images to service.
    # --------------------------------------------------------------------

    result = enroll_employee_face(
        db=db,
        temporary_token=temporary_token,
        front_image_bytes=front_image_bytes,
        left_image_bytes=left_image_bytes,
        right_image_bytes=right_image_bytes,
    )

    # --------------------------------------------------------------------
    # Build face profile response.
    # --------------------------------------------------------------------

    face_profiles = []

    for profile in result["face_profiles"]:

        face_profiles.append(
            {
                "face_profile_id": profile[
                    "face_profile_id"
                ],
                "capture_type": profile[
                    "capture_type"
                ],
            }
        )

    # --------------------------------------------------------------------
    # Return enrollment result.
    # --------------------------------------------------------------------

    return FaceEnrollmentResponse(
        message=(
            "Face profiles registered successfully. "
            "FRONT, LEFT and RIGHT captures have been saved. "
            "Temporary enrollment token has been revoked."
        ),
        employee_id=result[
            "employee_id"
        ],
        face_profiles=face_profiles,
        face_profile_count=result[
            "face_profile_count"
        ],
        temporary_token_revoked=result[
            "temporary_token_revoked"
        ],
    )


# ========================================================================
# FACE LOGIN
# ========================================================================
#
# This endpoint is used AFTER the employee already has face profiles.
#
# Registered profiles can contain:
#
#     FRONT
#     LEFT
#     RIGHT
#
#
# Android sends:
#
#     employee_id
#     face image
#     device_id
#     device_type
#     latitude
#     longitude
#
#
# The service:
#
#     employee validation
#          ↓
#     face validation
#          ↓
#     embedding generation
#          ↓
#     compare against registered embeddings
#          ↓
#     FACE_MATCH
#          ↓
#     access JWT
#          +
#     refresh JWT
#          ↓
#     auth_tokens
#
#
# A FACE_MISMATCH is rejected.
#
# It does NOT create a new face profile.
#
# ========================================================================

async def face_login_controller(
    db: Session,
    employee_id: int,
    image: UploadFile,
    device_id: str | None = None,
    device_type: str | None = None,
    ip_address: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> FaceLoginResponse:

    # --------------------------------------------------------------------
    # Read uploaded image.
    # --------------------------------------------------------------------

    image_bytes = await image.read()

    if not image_bytes:

        raise ValueError(
            "Face image is required."
        )

    # --------------------------------------------------------------------
    # Perform face authentication.
    # --------------------------------------------------------------------

    result = face_login(
        db=db,
        employee_id=employee_id,
        image_bytes=image_bytes,
        device_id=device_id,
        device_type=device_type,
        ip_address=ip_address,
        latitude=latitude,
        longitude=longitude,
    )

    # --------------------------------------------------------------------
    # Return successful authentication response.
    # --------------------------------------------------------------------

    return FaceLoginResponse(
        message=(
            "Face authentication successful."
        ),
        employee_id=result[
            "employee_id"
        ],
        employee_code=result[
            "employee_code"
        ],
        employee_name=result[
            "employee_name"
        ],
        access_token=result[
            "access_token"
        ],
        refresh_token=result[
            "refresh_token"
        ],
        token_type="bearer",
        face_status=result[
            "face_status"
        ],
        face_registered=result[
            "face_registered"
        ],
        matched_capture_type=result.get(
            "matched_capture_type"
        ),
        face_similarity=result.get(
            "face_similarity"
        ),
    )


# ========================================================================
# REFRESH ACCESS TOKEN
# ========================================================================
#
# Android sends the refresh token.
#
# The route can obtain it from the HttpOnly cookie.
#
# The service:
#
#     decode JWT
#          ↓
#     verify refresh type
#          ↓
#     hash supplied token
#          ↓
#     find auth_tokens
#          ↓
#     check revoked_at
#          ↓
#     check expiration
#          ↓
#     check employee
#          ↓
#     generate new access token
#
# ========================================================================

def refresh_token_controller(
    db: Session,
    refresh_token: str,
) -> RefreshTokenResponse:

    result = refresh_access_token(
        db=db,
        refresh_token=refresh_token,
    )

    return RefreshTokenResponse(
        message=(
            "Access token refreshed successfully."
        ),
        access_token=result[
            "access_token"
        ],
        token_type="bearer",
    )