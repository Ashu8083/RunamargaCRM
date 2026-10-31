# backend/app/services/api/auth/auth_service.py

import uuid

from pathlib import Path
from datetime import datetime, timedelta, timezone

import cv2
import numpy as np

from sqlalchemy.orm import Session

from app.models import phone_numbers, PhoneNumber, EmployeeContext, Context
from app.models.employees import Employee
from app.models.attendance import Attendance
from app.core.log_config import logger
from app.models.employee_face_profiles import EmployeeFaceProfile
from app.models.auth_tokens import AuthToken

from app.core.api_security import (
    hash_token,
    create_access_token,
    create_refresh_token,
    create_face_enrollment_token,
    get_employee_id_from_face_enrollment_token,
    decode_token,
    decode_token_unverified_exp,
    REFRESH_TOKEN_EXPIRE_DAYS,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ACCESS_TOKEN_TYPE,
    FACE_ENROLLMENT_TOKEN_TYPE,
    REFRESH_TOKEN_TYPE,
)

from app.services.face.face_validation import (
    detect_faces,
    validate_single_face,
    validate_detection_confidence,
    validate_face_size,
    validate_face_blur,
    validate_face_brightness,
)

from app.services.face.face_embedding import (
    generate_embedding,
)

from app.services.face.face_recognition import (
    verify_face,
)


# ------------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------------

FACE_CAPTURE_TYPES = (
    "FRONT",
    "LEFT",
    "RIGHT",
)


# ------------------------------------------------------------------------
# UPLOAD DIRECTORY
# ------------------------------------------------------------------------

# auth_service.py:
#
# backend/app/services/api/auth/auth_service.py
#
# parents[2] = backend/app
#
# Therefore:
#
# backend/app/static/uploads/face_enrollment/
#
UPLOAD_DIRECTORY = (
    Path(__file__).resolve().parents[2]
    / "static"
    / "uploads"
    / "face_enrollment"
)


# ------------------------------------------------------------------------
# FIND EMPLOYEE
# ------------------------------------------------------------------------

def find_employee_by_code(
    db: Session,
    employee_code: str,
) -> Employee | None:
    """
    Find employee using the current employee identification field.

    The current Employee model does not have an employee_code column.

    Therefore employee_code currently maps to Employee.email.
    """


    return (
        db.query(Employee)
        .filter(
            Employee.email == employee_code,
            Employee.deleted_at.is_(None),
        )
        .first()
    )


# ------------------------------------------------------------------------
# VALIDATE EMPLOYEE
# ------------------------------------------------------------------------

def validate_employee_for_api_login(
    employee: Employee | None,
) -> Employee:
    """
    Validate whether the employee is allowed to use
    the mobile API.
    """

    if not employee:

        raise ValueError(
            "Employee not found"
        )

    # if employee.deleted_at is not None:
    #
    #     raise ValueError(
    #         "Employee not found"
    #     )

    if employee.deactivate:

        raise ValueError(
            "Account is deactivated"
        )

    if employee.status not in (
        "active",
        "WFH",
    ):

        raise ValueError(
            "Account is inactive"
        )

    return employee


# ------------------------------------------------------------------------
# GET EMPLOYEE FACE PROFILES
# ------------------------------------------------------------------------

def get_employee_face_profiles(
    db: Session,
    employee_id: int,
) -> list[EmployeeFaceProfile]:

    return (
        db.query(EmployeeFaceProfile)
        .filter(
            EmployeeFaceProfile.employee_id == employee_id,
            EmployeeFaceProfile.deleted_at.is_(None),
        )
        .all()
    )


# ------------------------------------------------------------------------
# CHECK FACE PROFILE
# ------------------------------------------------------------------------

def employee_has_face_profile(
    db: Session,
    employee_id: int,
) -> bool:

    profile = (
        db.query(EmployeeFaceProfile.id)
        .filter(
            EmployeeFaceProfile.employee_id == employee_id,
            EmployeeFaceProfile.deleted_at.is_(None),
        )
        .first()
    )

    return profile is not None


# ------------------------------------------------------------------------
# VALIDATE AND EXTRACT FACE
# ------------------------------------------------------------------------

def validate_and_extract_face(
    image: np.ndarray,
):
    """
    Detect and validate exactly one face.

    Uses the existing face validation service.

    The three face service files are NOT modified.
    """

    # --------------------------------------------------------------------
    # Detect faces
    # --------------------------------------------------------------------

    faces = detect_faces(
        image
    )

    # --------------------------------------------------------------------
    # Ensure exactly one face
    # --------------------------------------------------------------------

    (
        success,
        error_code,
        message,
    ) = validate_single_face(
        faces
    )

    if not success:

        raise ValueError(
            message
        )

    face = faces[0]

    # --------------------------------------------------------------------
    # Detection confidence
    # --------------------------------------------------------------------

    (
        success,
        error_code,
        message,
        confidence,
    ) = validate_detection_confidence(
        face
    )

    if not success:

        raise ValueError(
            message
        )

    # --------------------------------------------------------------------
    # Face size
    # --------------------------------------------------------------------

    (
        success,
        error_code,
        message,
    ) = validate_face_size(
        face
    )

    if not success:

        raise ValueError(
            message
        )

    # --------------------------------------------------------------------
    # Blur / sharpness
    # --------------------------------------------------------------------

    (
        success,
        error_code,
        message,
        variance,
    ) = validate_face_blur(
        image,
        face,
    )

    if not success:

        raise ValueError(
            message
        )

    # --------------------------------------------------------------------
    # Brightness
    # --------------------------------------------------------------------

    (
        success,
        error_code,
        message,
        brightness,
    ) = validate_face_brightness(
        image,
        face,
    )

    if not success:

        raise ValueError(
            message
        )

    return face, {
        "detection_confidence": confidence,
        "sharpness": variance,
        "brightness": brightness,
    }


# ------------------------------------------------------------------------
# IDENTIFY EMPLOYEE
# ------------------------------------------------------------------------

def identify_employee(
    db: Session,
    employee_code: str,
    ip_address: str | None = None,
    device_id: str | None = None,
    device_type: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> dict:
    """
    First step of mobile authentication.

    Flow:

        employee_code
             ↓
        Find employee
             ↓
        Validate employee
             ↓
        Check face profile
             ↓
        ┌───────────────────────┐
        │                       │
        │ profile exists        │ no profile
        │                       │
        ▼                       ▼
    FACE_LOGIN           FACE_ENROLLMENT
                                │
                                ▼
                         temporary token
                                │
                                ▼
                           5 minutes
    """
    logger.info(f"employee code: {employee_code}")
    employee = find_employee_by_code(
        db=db,
        employee_code=employee_code,
    )
    logger.info(f"employee found{employee}")
    employee = validate_employee_for_api_login(
        employee
    )

    face_profile_exists = employee_has_face_profile(
        db=db,
        employee_id=employee.id,
    )

    # --------------------------------------------------------------------
    # FACE PROFILE EXISTS
    # --------------------------------------------------------------------

    if face_profile_exists:

        return {
            "employee_id": employee.id,
            "employee_code": employee_code,
            "employee_name": employee.name,
            "face_profile_exists": True,
            "next_step": "FACE_LOGIN",
            "temporary_token": None,
            "temporary_token_expires_in": None,
            "message": (
                "Face profile found. "
                "Proceed with face login."
            ),
        }

    # --------------------------------------------------------------------
    # FIRST-TIME FACE ENROLLMENT
    # --------------------------------------------------------------------

    temporary_token = create_temporary_enrollment_token(
        db=db,
        employee_id=employee.id,
        ip_address=ip_address,
        device_id=device_id,
        device_type=device_type,
        latitude=latitude,
        longitude=longitude,
    )

    return {
        "employee_id": employee.id,
        "employee_code": employee_code,
        "employee_name": employee.name,
        "face_profile_exists": False,
        "next_step": "FACE_ENROLLMENT",
        "temporary_token": temporary_token,
        "temporary_token_expires_in": 5 * 60,
        "message": (
            "Face profile not found. "
            "Complete face enrollment within 5 minutes."
        ),
    }


# ------------------------------------------------------------------------
# CREATE TEMPORARY ENROLLMENT TOKEN
# ------------------------------------------------------------------------

def create_temporary_enrollment_token(
    db: Session,
    employee_id: int,
    ip_address: str | None = None,
    device_id: str | None = None,
    device_type: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> str:
    """
    Create a temporary face enrollment token.

    Raw token:
        Returned to Android.

    Database:
        Only SHA-256 hash is stored.
    """

    now = datetime.now(timezone.utc)

    # --------------------------------------------------------------------
    # Revoke previous active enrollment tokens
    # --------------------------------------------------------------------

    (
        db.query(AuthToken)
        .filter(
            AuthToken.employee_id == employee_id,
            AuthToken.token_type == FACE_ENROLLMENT_TOKEN_TYPE,
            AuthToken.revoked_at.is_(None),
            AuthToken.expires_at > now,
        )
        .update(
            {
                AuthToken.revoked_at: now,
            },
            synchronize_session=False,
        )
    )

    # --------------------------------------------------------------------
    # Create temporary JWT
    # --------------------------------------------------------------------

    token, expires_at = create_face_enrollment_token(
        employee_id=employee_id
    )

    # --------------------------------------------------------------------
    # Store hash only
    # --------------------------------------------------------------------

    token_record = AuthToken(
        employee_id=employee_id,
        token_hash=hash_token(token),
        token_type=FACE_ENROLLMENT_TOKEN_TYPE,
        expires_at=expires_at,
        revoked_at=None,
        ip_address=ip_address,
        device_id=device_id,
        device_type=device_type,
        latitude=latitude,
        longitude=longitude,
    )

    db.add(token_record)

    db.commit()

    return token


# ------------------------------------------------------------------------
# VALIDATE TEMPORARY ENROLLMENT TOKEN
# ------------------------------------------------------------------------

def validate_temporary_enrollment_token(
    db: Session,
    temporary_token: str,
) -> AuthToken:
    """
    Validate temporary face enrollment token.

    Two-level validation:

        1. JWT validation
        2. Database token validation
    """

    # --------------------------------------------------------------------
    # Validate JWT
    # --------------------------------------------------------------------

    try:

        employee_id = (
            get_employee_id_from_face_enrollment_token(
                temporary_token
            )
        )

    except ValueError:

        raise ValueError(
            "Invalid or expired face enrollment token"
        )

    # --------------------------------------------------------------------
    # Hash token
    # --------------------------------------------------------------------

    token_hash = hash_token(
        temporary_token
    )

    # --------------------------------------------------------------------
    # Find database token
    # --------------------------------------------------------------------

    token_record = (
        db.query(AuthToken)
        .filter(
            AuthToken.token_hash == token_hash,
            AuthToken.token_type == FACE_ENROLLMENT_TOKEN_TYPE,
            AuthToken.employee_id == employee_id,
            AuthToken.revoked_at.is_(None),
        )
        .first()
    )

    if not token_record:

        raise ValueError(
            "Face enrollment token is invalid or revoked"
        )

    # --------------------------------------------------------------------
    # Database expiration
    # --------------------------------------------------------------------

    now = datetime.now(timezone.utc)

    expires_at = token_record.expires_at

    if expires_at.tzinfo is None:

        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if expires_at <= now:

        raise ValueError(
            "Face enrollment token has expired"
        )

    # --------------------------------------------------------------------
    # Validate employee again
    # --------------------------------------------------------------------

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    validate_employee_for_api_login(
        employee
    )

    return token_record


# ------------------------------------------------------------------------
# REVOKE TEMPORARY ENROLLMENT TOKEN
# ------------------------------------------------------------------------

def revoke_temporary_enrollment_token(
    db: Session,
    token_record: AuthToken,
) -> None:

    token_record.revoked_at = (
        datetime.now(timezone.utc)
    )

    db.commit()


# ------------------------------------------------------------------------
# DECODE IMAGE
# ------------------------------------------------------------------------

def decode_image(
    image_bytes: bytes,
) -> np.ndarray:
    """
    Convert uploaded image bytes into an OpenCV BGR image.
    """

    if not image_bytes:

        raise ValueError(
            "Image is empty"
        )

    image_array = np.frombuffer(
        image_bytes,
        dtype=np.uint8,
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR,
    )

    if image is None:

        raise ValueError(
            "Invalid image"
        )

    return image


# ------------------------------------------------------------------------
# SAVE FACE PROFILE IMAGE
# ------------------------------------------------------------------------

def save_face_profile_image(
    image: np.ndarray,
    employee_id: int,
    capture_type: str,
) -> str:
    """
    Save enrolled face image.

    Images are stored separately for:

        FRONT
        LEFT
        RIGHT

    Database stores the relative path.
    """

    employee_directory = (
        UPLOAD_DIRECTORY
        / str(employee_id)
    )

    employee_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    filename = (
        f"{capture_type.lower()}_"
        f"{uuid.uuid4().hex}.jpg"
    )

    file_path = (
        employee_directory
        / filename
    )

    success = cv2.imwrite(
        str(file_path),
        image,
        [
            cv2.IMWRITE_JPEG_QUALITY,
            95,
        ],
    )

    if not success:

        raise ValueError(
            "Failed to save face image"
        )

    return (
        f"face_enrollment/"
        f"{employee_id}/"
        f"{filename}"
    )


# ------------------------------------------------------------------------
# DELETE FACE PROFILE IMAGE
# ------------------------------------------------------------------------

def delete_face_profile_image(
    image_path: str,
) -> None:
    """
    Safely delete a face image stored under
    the face enrollment upload directory.
    """

    if not image_path:

        return

    relative_path = Path(
        image_path
    )

    if relative_path.is_absolute():

        return

    try:

        # ---------------------------------------------------------------
        # Expected database path:
        #
        # face_enrollment/{employee_id}/{filename}
        # ---------------------------------------------------------------

        parts = relative_path.parts

        if len(parts) != 3:

            return

        if parts[0] != "face_enrollment":

            return

        employee_id = parts[1]
        filename = parts[2]

        upload_root = (
            UPLOAD_DIRECTORY
            .resolve()
        )

        full_path = (
            upload_root
            / employee_id
            / filename
        ).resolve()

        # ---------------------------------------------------------------
        # Prevent path traversal
        # ---------------------------------------------------------------

        if (
            full_path != upload_root
            and upload_root not in full_path.parents
        ):

            return

        if full_path.exists():

            full_path.unlink()

    except (
        ValueError,
        OSError,
    ):

        pass


# ------------------------------------------------------------------------
# VALIDATE EMBEDDING
# ------------------------------------------------------------------------

def validate_face_embedding(
    embedding: np.ndarray,
) -> None:
    """
    Validate generated face embedding.
    """

    if embedding.ndim != 1:

        raise ValueError(
            "Invalid face embedding format"
        )

    if embedding.shape[0] != 512:

        raise ValueError(
            "Invalid face embedding dimension"
        )


# ------------------------------------------------------------------------
# CREATE SINGLE FACE PROFILE
# ------------------------------------------------------------------------

def create_face_profile(
    db: Session,
    employee_id: int,
    image: np.ndarray,
    capture_type: str,
) -> EmployeeFaceProfile:
    """
    Validate one face image, generate its embedding,
    save its image and create one face profile row.
    """

    # --------------------------------------------------------------------
    # Validate capture type
    # --------------------------------------------------------------------

    capture_type = capture_type.upper()

    if capture_type not in FACE_CAPTURE_TYPES:

        raise ValueError(
            f"Invalid capture type: {capture_type}"
        )

    # --------------------------------------------------------------------
    # Check whether this capture type already exists
    # --------------------------------------------------------------------

    existing_profile = (
        db.query(EmployeeFaceProfile)
        .filter(
            EmployeeFaceProfile.employee_id == employee_id,
            EmployeeFaceProfile.capture_type == capture_type,
            EmployeeFaceProfile.deleted_at.is_(None),
        )
        .first()
    )

    if existing_profile:

        raise ValueError(
            f"{capture_type} face profile already exists"
        )

    # --------------------------------------------------------------------
    # Detect and validate face
    # --------------------------------------------------------------------

    face, validation_result = (
        validate_and_extract_face(
            image
        )
    )

    # --------------------------------------------------------------------
    # Generate embedding
    # --------------------------------------------------------------------

    embedding = np.asarray(
        generate_embedding(
            face
        ),
        dtype=np.float32,
    )

    # --------------------------------------------------------------------
    # Validate embedding
    # --------------------------------------------------------------------

    validate_face_embedding(
        embedding
    )

    # --------------------------------------------------------------------
    # Save image
    # --------------------------------------------------------------------

    image_path = None

    try:

        image_path = save_face_profile_image(
            image=image,
            employee_id=employee_id,
            capture_type=capture_type,
        )

        # ---------------------------------------------------------------
        # Create profile
        # ---------------------------------------------------------------

        profile = EmployeeFaceProfile(
            employee_id=employee_id,
            face_embedding=embedding.tolist(),
            capture_type=capture_type,
            image_path=image_path,
        )

        db.add(profile)

        db.flush()

        return profile

    except Exception:

        if image_path:

            delete_face_profile_image(
                image_path
            )

        raise


# ------------------------------------------------------------------------
# CREATE FIRST FACE PROFILE
# ------------------------------------------------------------------------

def create_first_face_profile(
    db: Session,
    employee_id: int,
    front_image: np.ndarray,
    left_image: np.ndarray,
    right_image: np.ndarray,
) -> list[EmployeeFaceProfile]:
    """
    Create the complete first face profile.

    Three captures are required:

        FRONT
        LEFT
        RIGHT

    Three separate database rows are created.
    """

    # --------------------------------------------------------------------
    # Check whether ANY active profile already exists
    # --------------------------------------------------------------------

    existing_profiles = (
        db.query(EmployeeFaceProfile)
        .filter(
            EmployeeFaceProfile.employee_id == employee_id,
            EmployeeFaceProfile.deleted_at.is_(None),
        )
        .all()
    )

    if existing_profiles:

        raise ValueError(
            "Employee already has a registered face profile"
        )

    # --------------------------------------------------------------------
    # Map images to capture types
    # --------------------------------------------------------------------

    captures = [
        (
            "FRONT",
            front_image,
        ),
        (
            "LEFT",
            left_image,
        ),
        (
            "RIGHT",
            right_image,
        ),
    ]

    created_profiles = []

    # Keep track of image paths so that if anything fails,
    # all newly saved files can be deleted.
    saved_image_paths = []

    try:

        # ---------------------------------------------------------------
        # Process FRONT / LEFT / RIGHT
        # ---------------------------------------------------------------

        for capture_type, image in captures:

            profile = create_face_profile(
                db=db,
                employee_id=employee_id,
                image=image,
                capture_type=capture_type,
            )

            created_profiles.append(
                profile
            )

            saved_image_paths.append(
                profile.image_path
            )

        # ---------------------------------------------------------------
        # Commit all three profiles together
        # ---------------------------------------------------------------

        db.commit()

        # ---------------------------------------------------------------
        # Refresh all profiles
        # ---------------------------------------------------------------

        for profile in created_profiles:

            db.refresh(
                profile
            )

        return created_profiles

    except Exception:

        # ---------------------------------------------------------------
        # Rollback database transaction
        # ---------------------------------------------------------------

        db.rollback()

        # ---------------------------------------------------------------
        # Delete any images already saved
        # ---------------------------------------------------------------

        for image_path in saved_image_paths:

            delete_face_profile_image(
                image_path
            )

        raise


# ------------------------------------------------------------------------
# ENROLL EMPLOYEE FACE
# ------------------------------------------------------------------------

def enroll_employee_face(
    db: Session,
    temporary_token: str,
    front_image_bytes: bytes,
    left_image_bytes: bytes,
    right_image_bytes: bytes,
) -> dict:
    """
    Complete first-time face enrollment.

    Required captures:

        FRONT
        LEFT
        RIGHT

    All three images must pass validation.

    Only after all three succeed:

        FRONT profile
        LEFT profile
        RIGHT profile

    are committed.

    After successful enrollment:

        temporary token → revoked
    """

    # --------------------------------------------------------------------
    # Validate temporary token
    # --------------------------------------------------------------------

    token_record = (
        validate_temporary_enrollment_token(
            db=db,
            temporary_token=temporary_token,
        )
    )

    employee_id = token_record.employee_id

    # --------------------------------------------------------------------
    # Decode FRONT image
    # --------------------------------------------------------------------

    front_image = decode_image(
        front_image_bytes
    )

    # --------------------------------------------------------------------
    # Decode LEFT image
    # --------------------------------------------------------------------

    left_image = decode_image(
        left_image_bytes
    )

    # --------------------------------------------------------------------
    # Decode RIGHT image
    # --------------------------------------------------------------------

    right_image = decode_image(
        right_image_bytes
    )

    # --------------------------------------------------------------------
    # Create all three face profiles
    # --------------------------------------------------------------------

    profiles = create_first_face_profile(
        db=db,
        employee_id=employee_id,
        front_image=front_image,
        left_image=left_image,
        right_image=right_image,
    )

    # --------------------------------------------------------------------
    # Revoke temporary token
    # --------------------------------------------------------------------

    revoke_temporary_enrollment_token(
        db=db,
        token_record=token_record,
    )

    return {
        "employee_id": employee_id,
        "face_profiles": [
            {
                "face_profile_id": profile.id,
                "capture_type": profile.capture_type,
            }
            for profile in profiles
        ],
        "face_profile_count": len(profiles),
        "temporary_token_revoked": True,
    }


# ------------------------------------------------------------------------
# GET ACTIVE FACE EMBEDDINGS
# ------------------------------------------------------------------------

def get_employee_face_embeddings(
    db: Session,
    employee_id: int,
) -> list[dict]:
    """
    Get all active face embeddings for an employee.

    Returns:

        [
            {
                "embedding": np.ndarray,
                "capture_type": "FRONT"
            },
            {
                "embedding": np.ndarray,
                "capture_type": "LEFT"
            },
            {
                "embedding": np.ndarray,
                "capture_type": "RIGHT"
            }
        ]
    """

    profiles = get_employee_face_profiles(
        db=db,
        employee_id=employee_id,
    )

    return [
        {
            "embedding": np.asarray(
                profile.face_embedding,
                dtype=np.float32,
            ),
            "capture_type": profile.capture_type,
        }
        for profile in profiles
    ]


# ------------------------------------------------------------------------
# AUTHENTICATE EMPLOYEE FACE
# ------------------------------------------------------------------------

def authenticate_employee_face(
    db: Session,
    employee_id: int,
    image: np.ndarray,
) -> dict:
    """
    Authenticate an employee using face recognition.

    The incoming face is compared against:

        FRONT
        LEFT
        RIGHT

    The highest similarity is used.

    IMPORTANT:

    A mismatch NEVER creates or updates a face profile.

    The existing face_recognition.py expects stored embeddings
    in this format:

        [
            {
                "embedding": [...],
                "capture_type": "FRONT"
            }
        ]
    """

    # --------------------------------------------------------------------
    # Validate incoming face
    # --------------------------------------------------------------------

    face, validation_result = (
        validate_and_extract_face(
            image
        )
    )

    # --------------------------------------------------------------------
    # Get registered employee face profiles
    # --------------------------------------------------------------------

    stored_faces = (
        get_employee_face_embeddings(
            db=db,
            employee_id=employee_id,
        )
    )

    if not stored_faces:

        raise ValueError(
            "Face profile not registered"
        )

    # --------------------------------------------------------------------
    # Generate incoming face embedding
    # --------------------------------------------------------------------

    incoming_embedding = np.asarray(
        generate_embedding(
            face
        ),
        dtype=np.float32,
    )

    validate_face_embedding(
        incoming_embedding
    )

    # --------------------------------------------------------------------
    # Compare against FRONT / LEFT / RIGHT
    # --------------------------------------------------------------------

    recognition_result = verify_face(
        incoming_embedding,
        stored_faces,
    )

    # --------------------------------------------------------------------
    # Recognition failed
    # --------------------------------------------------------------------

    if not recognition_result.get(
        "success",
        False,
    ):

        raise ValueError(
            recognition_result.get(
                "message",
                "Face verification failed",
            )
        )

    # --------------------------------------------------------------------
    # Face mismatch
    # --------------------------------------------------------------------

    if not recognition_result.get(
        "matched",
        False,
    ):

        raise ValueError(
            "FACE_MISMATCH"
        )

    # --------------------------------------------------------------------
    # Get similarity
    # --------------------------------------------------------------------

    best_similarity = float(
        recognition_result.get(
            "best_similarity",
            0.0,
        )
    )

    # --------------------------------------------------------------------
    # Determine matched capture type
    # --------------------------------------------------------------------

    matched_capture_type = None

    best_individual_similarity = -1.0

    for stored_face in stored_faces:

        individual_result = verify_face(
            incoming_embedding,
            [
                stored_face
            ],
            threshold=0.0,
        )

        individual_similarity = float(
            individual_result.get(
                "best_similarity",
                0.0,
            )
        )

        if (
            individual_similarity
            > best_individual_similarity
        ):

            best_individual_similarity = (
                individual_similarity
            )

            matched_capture_type = (
                stored_face.get(
                    "capture_type"
                )
            )

    # --------------------------------------------------------------------
    # Return successful authentication result
    # --------------------------------------------------------------------

    return {
        "matched": True,
        "capture_type": matched_capture_type,
        "similarity": best_similarity,
    }


# ------------------------------------------------------------------------
# SAVE REFRESH TOKEN
# ------------------------------------------------------------------------

def save_refresh_token(
    db: Session,
    employee_id: int,
    refresh_token: str,
    ip_address: str | None = None,
    device_id: str | None = None,
    device_type: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> AuthToken:
    """
    Store refresh token session.

    Only SHA-256 hash is stored.

    Current design:
        One active refresh session per employee.
    """

    now = datetime.now(
        timezone.utc
    )

    # --------------------------------------------------------------------
    # Revoke previous refresh sessions
    # --------------------------------------------------------------------

    (
        db.query(AuthToken)
        .filter(
            AuthToken.employee_id == employee_id,
            AuthToken.token_type == REFRESH_TOKEN_TYPE,
            AuthToken.revoked_at.is_(None),
        )
        .update(
            {
                AuthToken.revoked_at: now,
            },
            synchronize_session=False,
        )
    )

    # --------------------------------------------------------------------
    # Calculate expiration
    # --------------------------------------------------------------------

    expires_at = (
        now
        + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        )
    )

    # --------------------------------------------------------------------
    # Store refresh token hash
    # --------------------------------------------------------------------

    token_record = AuthToken(
        employee_id=employee_id,
        token_hash=hash_token(
            refresh_token
        ),
        token_type=REFRESH_TOKEN_TYPE,
        expires_at=expires_at,
        revoked_at=None,
        ip_address=ip_address,
        device_id=device_id,
        device_type=device_type,
        latitude=latitude,
        longitude=longitude,
    )

    db.add(token_record)

    db.commit()

    db.refresh(
        token_record
    )

    return token_record


# ------------------------------------------------------------------------
# FACE LOGIN
# ------------------------------------------------------------------------

def face_login(
    db: Session,
    employee_id: int,
    image_bytes: bytes,
    device_id: str | None = None,
    device_type: str | None = None,
    ip_address: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> dict:
    """
    Authenticate employee using face recognition.

    Successful login:

        Face MATCH
             ↓
        Access token
             +
        Refresh token
             ↓
        Store refresh hash
    """

    # --------------------------------------------------------------------
    # Validate employee
    # --------------------------------------------------------------------
    phone_numbers_id = None
    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    # --------------------------------------------------------------------
    # Resolve employee contexts (default and all active contexts)
    # --------------------------------------------------------------------
    active_contexts = (
        db.query(EmployeeContext)
        .join(
            Context,
            EmployeeContext.context_id == Context.id,
        )
        .filter(
            EmployeeContext.employee_id == employee_id,
            EmployeeContext.is_active.is_(True),
            EmployeeContext.deleted_at.is_(None),
            Context.is_active.is_(True),
        )
        .order_by(
            EmployeeContext.is_default.desc(),
            EmployeeContext.id.asc(),
        )
        .all()
    )

    emp_context = active_contexts[0] if active_contexts else None
    employee_context_id = emp_context.id if emp_context else None
    context_name = emp_context.context.name if (emp_context and emp_context.context) else None

    contexts_list = [
        {
            "id": ec.id,
            "employee_context_id": ec.id,
            "context_id": ec.context_id,
            "name": ec.context.name if ec.context else "",
            "code": ec.context.code if ec.context else "",
            "is_default": bool(ec.is_default),
        }
        for ec in active_contexts
    ]

    employee = validate_employee_for_api_login(
        employee
    )

    # --------------------------------------------------------------------
    # Decode image
    # --------------------------------------------------------------------

    image = decode_image(
        image_bytes
    )

    # --------------------------------------------------------------------
    # Authenticate face
    # --------------------------------------------------------------------

    face_result = authenticate_employee_face(
        db=db,
        employee_id=employee_id,
        image=image,
    )

    # --------------------------------------------------------------------
    # Generate access token
    # --------------------------------------------------------------------

    access_token = create_access_token(
        employee_id=employee_id
    )

    # --------------------------------------------------------------------
    # Generate refresh token
    # --------------------------------------------------------------------

    refresh_token = create_refresh_token(
        employee_id=employee_id
    )

    # --------------------------------------------------------------------
    # Store refresh token hash
    # --------------------------------------------------------------------

    save_refresh_token(
        db=db,
        employee_id=employee_id,
        refresh_token=refresh_token,
        ip_address=ip_address,
        device_id=device_id,
        device_type=device_type,
        latitude=latitude,
        longitude=longitude,
    )

    logger.info(
        f"employee login successful employee_id={employee.id}, "
        f"employee_context_id={employee_context_id}, context_name={context_name}, "
        f"contexts_count={len(contexts_list)}"
    )

    # --------------------------------------------------------------------
    # Resolve work mode from employee status
    # --------------------------------------------------------------------
    work_mode = "WFH" if employee.status == "WFH" else "Office"


    return {
        "message": "Face login successful",
        "employee_id": employee.id,
        "employee_context_id": employee_context_id,
        "context_name": context_name,
        "contexts": contexts_list,
        "employee_code": employee.email,
        "employee_name": employee.name,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "face_status": "MATCH",
        "face_registered": True,
        "matched_capture_type": face_result.get(
            "capture_type"
        ),
        "face_similarity": face_result.get(
            "similarity"
        ),
        "work_mode": work_mode,
    }


# ------------------------------------------------------------------------
# GET EMPLOYEE CONTEXTS
# ------------------------------------------------------------------------

def get_employee_contexts_service(
    db: Session,
    employee_id: int,
) -> list[dict]:
    """
    Fetch all active contexts for an employee by employee_id.
    Returns a list of contexts with context id and name.
    """
    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    if not employee:
        raise ValueError(f"Employee with ID {employee_id} not found.")

    employee_contexts = (
        db.query(EmployeeContext)
        .join(
            Context,
            EmployeeContext.context_id == Context.id,
        )
        .filter(
            EmployeeContext.employee_id == employee_id,
            EmployeeContext.is_active.is_(True),
            EmployeeContext.deleted_at.is_(None),
            Context.is_active.is_(True),
        )
        .order_by(
            EmployeeContext.is_default.desc(),
            EmployeeContext.id.asc(),
        )
        .all()
    )

    return [
        {
            "id": ec.id,
            "employee_context_id": ec.id,
            "context_id": ec.context_id,
            "name": ec.context.name if ec.context else "",
            "code": ec.context.code if ec.context else "",
            "is_default": bool(ec.is_default),
        }
        for ec in employee_contexts
    ]


# ------------------------------------------------------------------------
# GET PHONE NUMBER BASED ON EMPLOYEE
# ------------------------------------------------------------------------

def get_employee_phone_number_service(
    db: Session,
    employee_id: int,
) -> dict:
    """
    Fetch phone number based on employee_id.
    Validates that the employee is allowed (active, not deactivated) and returns their assigned phone number.
    """
    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    if not employee:
        raise ValueError(
            f"Employee with ID {employee_id} not found."
        )

    validate_employee_for_api_login(employee)

    phone_record = (
        db.query(PhoneNumber)
        .filter(
            PhoneNumber.employee_id == employee.id,
            PhoneNumber.deleted_at.is_(None),
        )
        .order_by(PhoneNumber.id.desc())
        .first()
    )

    if not phone_record:
        raise ValueError(
            f"No phone number assigned to employee (ID: {employee.id})."
        )

    return {
        "phone_number_id": phone_record.id,
        "phone": phone_record.phone,
    }


def get_rm_phone_number_service(
    db: Session,
    employee_context_id: int,
) -> dict:
    """
    Fetch phone number based on employee_context_id or employee_id.
    Does not filter on employee context; validates that the employee is allowed and fetches the assigned number.
    """
    employee_context = (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.id == employee_context_id,
            EmployeeContext.deleted_at.is_(None),
        )
        .first()
    )

    target_employee_id = (
        employee_context.employee_id if employee_context else employee_context_id
    )

    return get_employee_phone_number_service(
        db=db,
        employee_id=target_employee_id,
    )




# ------------------------------------------------------------------------
# REFRESH ACCESS TOKEN
# ------------------------------------------------------------------------

def refresh_access_token(
    db: Session,
    refresh_token: str,
) -> dict:
    """
    Generate a new access token using a valid refresh token.

    The refresh token itself is NOT rotated.
    """

    # --------------------------------------------------------------------
    # Decode refresh JWT
    # --------------------------------------------------------------------

    try:

        payload = decode_token(
            refresh_token
        )

        if payload.get("type") != REFRESH_TOKEN_TYPE:

            raise ValueError(
                "Invalid refresh token"
            )

        employee_id = int(
            payload.get("sub")
        )

    except (
        ValueError,
        TypeError,
    ):

        raise ValueError(
            "Invalid refresh token"
        )

    # --------------------------------------------------------------------
    # Hash refresh token
    # --------------------------------------------------------------------

    token_hash = hash_token(
        refresh_token
    )

    # --------------------------------------------------------------------
    # Find active refresh session
    # --------------------------------------------------------------------

    token_record = (
        db.query(AuthToken)
        .filter(
            AuthToken.employee_id == employee_id,
            AuthToken.token_hash == token_hash,
            AuthToken.token_type == REFRESH_TOKEN_TYPE,
            AuthToken.revoked_at.is_(None),
        )
        .first()
    )

    if not token_record:

        raise ValueError(
            "Refresh token is invalid or revoked"
        )

    # --------------------------------------------------------------------
    # Check database expiration
    # --------------------------------------------------------------------

    now = datetime.now(
        timezone.utc
    )

    expires_at = token_record.expires_at

    if expires_at.tzinfo is None:

        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if expires_at <= now:

        raise ValueError(
            "Refresh token has expired"
        )

    # --------------------------------------------------------------------
    # Validate employee
    # --------------------------------------------------------------------

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    validate_employee_for_api_login(
        employee
    )

    # --------------------------------------------------------------------
    # Create new access token
    # --------------------------------------------------------------------

    access_token = create_access_token(
        employee_id=employee_id
    )

    return {
        "message": (
            "Access token refreshed successfully"
        ),
        "access_token": access_token,
        "token_type": "bearer",
    }


# ------------------------------------------------------------------------
# LOGOUT & REVOKE TOKENS
# ------------------------------------------------------------------------

def logout_employee(
    db: Session,
    employee_id: int | None = None,
    access_token: str | None = None,
    refresh_token: str | None = None,
    device_id: str | None = None,
) -> dict:
    """
    Revoke employee tokens on logout.

    Validates incoming token JWTs and verifies active session exists.
    If no valid token is provided, or the session is already revoked / not found,
    raises ValueError so the API returns 401 Unauthorized instead of 200 OK.
    """
    now = datetime.now(timezone.utc)
    revoked_count = 0
    token_verified = False

    # 1. Validate access_token if provided
    if access_token:
        try:
            payload = decode_token_unverified_exp(access_token)
            if payload.get("type") != ACCESS_TOKEN_TYPE:
                raise ValueError("Invalid access token type")
            sub = payload.get("sub")
            if not sub:
                raise ValueError("Access token is missing employee ID")
            employee_id = int(sub)
            token_verified = True
        except Exception as exc:
            raise ValueError(f"Invalid access token: {exc}")

    # 2. Validate refresh_token if provided
    if refresh_token:
        try:
            payload = decode_token_unverified_exp(refresh_token)
            if payload.get("type") != REFRESH_TOKEN_TYPE:
                raise ValueError("Invalid refresh token type")
            sub = payload.get("sub")
            if not sub:
                raise ValueError("Refresh token is missing employee ID")
            ref_emp_id = int(sub)
            if employee_id and employee_id != ref_emp_id:
                raise ValueError("Access token and refresh token belong to different employees")
            employee_id = ref_emp_id
            token_verified = True
        except Exception as exc:
            raise ValueError(f"Invalid refresh token: {exc}")

    if not token_verified or not employee_id:
        raise ValueError("Valid authentication token required for logout")

    # 3. Verify employee exists in database
    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )
    if not employee:
        raise ValueError("Employee not found")

    # 4. If refresh token provided, look up in auth_tokens
    if refresh_token:
        refresh_hash = hash_token(refresh_token)
        token_record = (
            db.query(AuthToken)
            .filter(
                AuthToken.employee_id == employee_id,
                AuthToken.token_hash == refresh_hash,
                AuthToken.token_type == REFRESH_TOKEN_TYPE,
            )
            .first()
        )
        if not token_record:
            raise ValueError("Refresh session not found or invalid")
        if token_record.revoked_at is not None:
            raise ValueError("Token is already revoked")

        token_record.revoked_at = now
        revoked_count += 1

    # 5. If access token provided, blacklist in auth_tokens
    if access_token:
        access_hash = hash_token(access_token)
        existing = (
            db.query(AuthToken)
            .filter(
                AuthToken.employee_id == employee_id,
                AuthToken.token_hash == access_hash,
            )
            .first()
        )
        if existing:
            if existing.revoked_at is not None and not refresh_token:
                raise ValueError("Access token is already revoked")
            if existing.revoked_at is None:
                existing.revoked_at = now
                revoked_count += 1
        else:
            exp_dt = None
            try:
                payload = decode_token_unverified_exp(access_token)
                if payload.get("exp"):
                    exp_dt = datetime.fromtimestamp(payload.get("exp"), tz=timezone.utc)
            except Exception:
                pass

            if not exp_dt:
                exp_dt = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

            revoked_access_token = AuthToken(
                employee_id=employee_id,
                token_hash=access_hash,
                token_type=ACCESS_TOKEN_TYPE,
                expires_at=exp_dt,
                revoked_at=now,
                device_id=device_id,
            )
            db.add(revoked_access_token)
            revoked_count += 1

    # 6. Revoke any other active refresh sessions for this employee
    filter_conditions = [
        AuthToken.employee_id == employee_id,
        AuthToken.token_type == REFRESH_TOKEN_TYPE,
        AuthToken.revoked_at.is_(None),
    ]
    if device_id:
        filter_conditions.append(AuthToken.device_id == device_id)

    updated = (
        db.query(AuthToken)
        .filter(*filter_conditions)
        .update(
            {AuthToken.revoked_at: now},
            synchronize_session=False,
        )
    )
    revoked_count += updated

    if revoked_count == 0:
        raise ValueError("No active session found or token has already been revoked")

    db.commit()

    logger.info(
        f"Employee {employee_id} logged out. Total tokens marked revoked: {revoked_count}"
    )

    return {
        "success": True,
        "message": "Logout successful. Token revoked.",
        "revoked_tokens_count": revoked_count,
    }