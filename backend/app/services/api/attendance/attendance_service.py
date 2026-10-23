# backend/app/services/api/attendance/attendance_service.py

from datetime import date, datetime
from pathlib import Path

import cv2
import numpy as np

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.models.attendance import Attendance
from app.models.employee_face_profiles import EmployeeFaceProfile
from app.models.employees import Employee

from app.services.face.face_embedding import generate_embedding
from app.services.face.face_recognition import verify_face
from app.services.face.face_validation import (
    detect_faces,
    validate_single_face,
    validate_detection_confidence,
    validate_face_size,
    validate_face_blur,
    validate_face_brightness,
)
from app.utils.geo import haversine_distance


# Project root:
#
# backend/
#     app/
#     static/
#
# This file is:
#
# backend/app/services/api/attendance/attendance_service.py
#
# parents[4] points to backend/

PROJECT_ROOT = Path(
    __file__
).resolve().parents[4]


# ------------------------------------------------------------------------
# STATIC DIRECTORY
# ------------------------------------------------------------------------
#
# Physical static directory:
#
# backend/app/static/
#
# This is used as the base directory for attendance image storage.
#
# IMPORTANT:
#
# The database will NOT store:
#
#     static/uploads/...
#     app/static/uploads/...
#
# The database will store only:
#
#     uploads/...
#
# Example:
#
# Physical file:
# backend/app/static/uploads/attendance/punch in/2026-09-11/12_John_Doe.jpg
#
# Database value:
# uploads/attendance/punch in/2026-09-11/12_John_Doe.jpg

STATIC_DIRECTORY = (
    PROJECT_ROOT
    / "app"
    / "static"
)


# ------------------------------------------------------------------------
# ATTENDANCE IMAGE STORAGE
# ------------------------------------------------------------------------
#
# Physical storage structure:
#
# backend/
# └── app/
#     └── static/
#         └── uploads/
#             └── attendance/
#                 ├── punch in/
#                 │   └── YYYY-MM-DD/
#                 │       └── employee_id_employee_name.jpg
#                 │
#                 └── punch out/
#                     └── YYYY-MM-DD/
#                         └── employee_id_employee_name.jpg
#
# Example physical paths:
#
# backend/app/static/uploads/attendance/punch in/2026-09-11/12_John_Doe.jpg
# backend/app/static/uploads/attendance/punch out/2026-09-11/12_John_Doe.jpg
#
# Database stores:
#
# uploads/attendance/punch in/2026-09-11/12_John_Doe.jpg
# uploads/attendance/punch out/2026-09-11/12_John_Doe.jpg

ATTENDANCE_UPLOAD_DIRECTORY = (
    STATIC_DIRECTORY
    / "uploads"
    / "attendance"
)


PUNCH_IN_DIRECTORY_NAME = "punch in"
PUNCH_OUT_DIRECTORY_NAME = "punch out"


# ------------------------------------------------------------------------
# FACE CAPTURE TYPES
# ------------------------------------------------------------------------

FACE_CAPTURE_TYPES = (
    "FRONT",
    "LEFT",
    "RIGHT",
)


# ------------------------------------------------------------------------
# EMPLOYEE VALIDATION
# ------------------------------------------------------------------------

def validate_employee_for_attendance(
    employee: Employee,
) -> None:
    """
    Validate whether the employee is allowed to perform
    attendance actions.

    Allowed:
        active
        WFH

    Not allowed:
        deleted
        deactivated
        inactive
    """

    if employee.deleted_at is not None:

        raise HTTPException(
            status_code=403,
            detail="Employee account has been deleted.",
        )

    if employee.deactivate:

        raise HTTPException(
            status_code=403,
            detail="Employee account is deactivated.",
        )

    if employee.status not in (
        "active",
        "WFH",
    ):

        raise HTTPException(
            status_code=403,
            detail="Employee is not allowed to mark attendance.",
        )


# ------------------------------------------------------------------------
# TODAY'S ATTENDANCE
# ------------------------------------------------------------------------

def get_today_attendance(
    db: Session,
    employee_id: int,
) -> Attendance | None:
    """
    Get today's active attendance row for an employee.

    There should be only one attendance row per employee
    per day.

    Unique constraint:

        employee_id + date
    """

    return (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee_id,
            Attendance.date == date.today(),
            Attendance.deleted_at.is_(None),
        )
        .first()
    )


# ------------------------------------------------------------------------
# EMPLOYEE FACE PROFILES
# ------------------------------------------------------------------------

def get_employee_face_profiles(
    db: Session,
    employee_id: int,
) -> list[EmployeeFaceProfile]:
    """
    Get all active face profiles belonging to the employee.

    Expected profiles:

        FRONT
        LEFT
        RIGHT
    """

    profiles = (
        db.query(EmployeeFaceProfile)
        .filter(
            EmployeeFaceProfile.employee_id == employee_id,
            EmployeeFaceProfile.deleted_at.is_(None),
            EmployeeFaceProfile.capture_type.in_(
                FACE_CAPTURE_TYPES
            ),
        )
        .order_by(
            EmployeeFaceProfile.id.asc()
        )
        .all()
    )

    if not profiles:

        raise HTTPException(
            status_code=400,
            detail="No registered face profiles found for this employee.",
        )

    return profiles


# ------------------------------------------------------------------------
# BUILD STORED EMBEDDINGS
# ------------------------------------------------------------------------

def build_stored_embeddings(
    profiles: list[EmployeeFaceProfile],
) -> list[dict]:
    """
    Convert database face profiles into the exact format
    expected by the global face_recognition service.

    Expected format:

        [
            {
                "embedding": [...],
                "capture_type": "FRONT"
            },
            {
                "embedding": [...],
                "capture_type": "LEFT"
            },
            {
                "embedding": [...],
                "capture_type": "RIGHT"
            }
        ]
    """

    stored_embeddings = []

    for profile in profiles:

        if not profile.face_embedding:

            continue

        embedding = np.asarray(
            profile.face_embedding,
            dtype=np.float32,
        )

        if embedding.ndim != 1:

            continue

        if embedding.shape[0] != 512:

            continue

        stored_embeddings.append(
            {
                "embedding": embedding,
                "capture_type": profile.capture_type,
            }
        )

    if not stored_embeddings:

        raise HTTPException(
            status_code=500,
            detail="Employee face profiles contain invalid embeddings.",
        )

    return stored_embeddings


# ------------------------------------------------------------------------
# DECODE IMAGE
# ------------------------------------------------------------------------

def decode_image(
    image_bytes: bytes,
) -> np.ndarray:
    """
    Decode incoming image bytes into an OpenCV BGR image.
    """

    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail="Face image cannot be empty.",
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

        raise HTTPException(
            status_code=400,
            detail="Invalid or unsupported image.",
        )

    return image


# ------------------------------------------------------------------------
# VALIDATE AND GENERATE EMBEDDING
# ------------------------------------------------------------------------

def generate_verified_face_embedding(
    image_bytes: bytes,
) -> tuple[list[float], float]:
    """
    Validate the incoming face image using the existing
    global face-validation service and generate a normalized
    512-dimensional embedding using the existing global
    face-embedding service.

    Validation flow:

        image
          ↓
        detect faces
          ↓
        exactly one face
          ↓
        detection confidence
          ↓
        face size
          ↓
        blur
          ↓
        brightness
          ↓
        embedding
    """

    # ------------------------------------------------------------
    # 1. Decode image
    # ------------------------------------------------------------

    image = decode_image(
        image_bytes
    )

    # ------------------------------------------------------------
    # 2. Detect faces
    # ------------------------------------------------------------

    try:

        faces = detect_faces(
            image
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail={
                "code": "FACE_DETECTION_ERROR",
                "message": str(exc),
            },
        )

    except Exception:

        raise HTTPException(
            status_code=500,
            detail={
                "code": "FACE_DETECTION_FAILED",
                "message": "Face detection failed. Please try again with a clearer image.",
            },
        )

    # ------------------------------------------------------------
    # 3. Exactly one face
    # ------------------------------------------------------------

    (
        success,
        error_code,
        message,
    ) = validate_single_face(
        faces
    )

    if not success:

        raise HTTPException(
            status_code=400,
            detail={
                "code": error_code,
                "message": message,
            },
        )

    face = faces[0]

    # ------------------------------------------------------------
    # 4. Detection confidence
    # ------------------------------------------------------------

    (
        success,
        error_code,
        message,
        detection_confidence,
    ) = validate_detection_confidence(
        face
    )

    if not success:

        raise HTTPException(
            status_code=400,
            detail={
                "code": error_code,
                "message": message,
                "confidence": detection_confidence,
            },
        )

    # ------------------------------------------------------------
    # 5. Face size
    # ------------------------------------------------------------

    (
        success,
        error_code,
        message,
    ) = validate_face_size(
        face
    )

    if not success:

        raise HTTPException(
            status_code=400,
            detail={
                "code": error_code,
                "message": message,
            },
        )

    # ------------------------------------------------------------
    # 6. Face blur
    # ------------------------------------------------------------

    (
        success,
        error_code,
        message,
        blur_variance,
    ) = validate_face_blur(
        image,
        face,
    )

    if not success:

        raise HTTPException(
            status_code=400,
            detail={
                "code": error_code,
                "message": message,
                "variance": blur_variance,
            },
        )

    # ------------------------------------------------------------
    # 7. Face brightness
    # ------------------------------------------------------------

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

        raise HTTPException(
            status_code=400,
            detail={
                "code": error_code,
                "message": message,
                "brightness": brightness,
            },
        )

    # ------------------------------------------------------------
    # 8. Generate 512-dimensional embedding
    # ------------------------------------------------------------

    try:

        embedding = generate_embedding(
            face
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail={
                "code": "EMBEDDING_ERROR",
                "message": str(exc),
            },
        )

    except Exception:

        raise HTTPException(
            status_code=500,
            detail={
                "code": "EMBEDDING_FAILED",
                "message": "Face embedding generation failed. Please try again with a clearer image.",
            },
        )

    # ------------------------------------------------------------
    # 9. Final embedding validation
    # ------------------------------------------------------------

    if not isinstance(
        embedding,
        list,
    ):

        raise HTTPException(
            status_code=500,
            detail={
                "code": "INVALID_EMBEDDING",
                "message": "Invalid generated face embedding. Please try again.",
            },
        )

    if len(embedding) != 512:

        raise HTTPException(
            status_code=500,
            detail={
                "code": "INVALID_EMBEDDING_DIMENSION",
                "message": "Invalid face embedding dimension. Please try again.",
            },
        )

    return (
        embedding,
        detection_confidence,
    )


# ------------------------------------------------------------------------
# FACE VERIFICATION
# ------------------------------------------------------------------------

def verify_employee_face(
    db: Session,
    employee_id: int,
    image_bytes: bytes,
) -> dict:
    """
    Verify an incoming face against ALL registered face
    embeddings belonging to the employee.

    The comparison is performed by the existing global
    face_recognition.py service.

    Comparison:

        incoming embedding
              ↓
        FRONT embedding
        LEFT embedding
        RIGHT embedding
              ↓
        cosine similarity
              ↓
        highest similarity
              ↓
        threshold verification
    """

    # ------------------------------------------------------------
    # 1. Generate incoming embedding
    # ------------------------------------------------------------

    (
        incoming_embedding,
        detection_confidence,
    ) = generate_verified_face_embedding(
        image_bytes
    )

    # ------------------------------------------------------------
    # 2. Get employee's registered profiles
    # ------------------------------------------------------------

    profiles = get_employee_face_profiles(
        db=db,
        employee_id=employee_id,
    )

    # ------------------------------------------------------------
    # 3. Convert DB profiles to recognition format
    # ------------------------------------------------------------

    stored_embeddings = build_stored_embeddings(
        profiles
    )

    # ------------------------------------------------------------
    # 4. Compare against ALL registered embeddings
    # ------------------------------------------------------------

    try:

        result = verify_face(
            incoming_embedding=incoming_embedding,
            stored_embeddings=stored_embeddings,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=500,
            detail={
                "code": "FACE_VERIFY_ERROR",
                "message": str(exc),
            },
        )

    except Exception:

        raise HTTPException(
            status_code=500,
            detail={
                "code": "FACE_VERIFY_FAILED",
                "message": "Face verification failed. Please try again.",
            },
        )

    # ------------------------------------------------------------
    # 5. No stored embeddings
    # ------------------------------------------------------------

    if result.get("code") == "NO_STORED_EMBEDDINGS":

        raise HTTPException(
            status_code=400,
            detail={
                "code": "NO_STORED_EMBEDDINGS",
                "message": "No registered face embeddings found for this employee. Please complete face enrollment first.",
            },
        )

    # ------------------------------------------------------------
    # 6. Face mismatch
    # ------------------------------------------------------------

    if not result.get(
        "matched",
        False,
    ):

        raise HTTPException(
            status_code=401,
            detail={
                "code": result.get(
                    "code",
                    "FACE_MISMATCH",
                ),
                "message": result.get(
                    "message",
                    "Face does not match the registered employee.",
                ),
                "best_similarity": result.get(
                    "best_similarity"
                ),
                "threshold": result.get(
                    "threshold"
                ),
            },
        )

    # ------------------------------------------------------------
    # 7. Successful match
    # ------------------------------------------------------------

    return {
        "matched": True,
        "best_similarity": result.get(
            "best_similarity"
        ),
        "matched_capture_type": result.get(
            "matched_capture_type"
        ),
        "threshold": result.get(
            "threshold"
        ),
        "detection_confidence": detection_confidence,
    }


# ------------------------------------------------------------------------
# EMPLOYEE IMAGE FILENAME
# ------------------------------------------------------------------------

def build_employee_image_filename(
    employee: Employee,
) -> str:
    """
    Build the attendance image filename.

    Format:

        employee_id_employee_name.jpg

    Example:

        12_John_Doe.jpg

    The employee name is sanitized so that filesystem
    special characters do not create invalid paths.
    """

    employee_id = str(
        employee.id
    )

    # Try common employee-name fields.
    #
    # Adjust this section only if your Employee model uses
    # a different field for the employee's display name.

    employee_name = getattr(
        employee,
        "name",
        None,
    )

    if not employee_name:

        first_name = getattr(
            employee,
            "first_name",
            None,
        )

        last_name = getattr(
            employee,
            "last_name",
            None,
        )

        employee_name = " ".join(
            part
            for part in (
                first_name,
                last_name,
            )
            if part
        )

    if not employee_name:

        employee_name = f"employee_{employee_id}"

    employee_name = str(
        employee_name
    ).strip()

    # ------------------------------------------------------------
    # Sanitize employee name
    # ------------------------------------------------------------

    safe_name_characters = []

    for character in employee_name:

        if character.isalnum():

            safe_name_characters.append(
                character
            )

        elif character in (
            " ",
            "_",
            "-",
        ):

            safe_name_characters.append(
                "_"
            )

        else:

            safe_name_characters.append(
                "_"
            )

    safe_employee_name = "".join(
        safe_name_characters
    )

    # Prevent excessive underscores.

    while "__" in safe_employee_name:

        safe_employee_name = (
            safe_employee_name
            .replace(
                "__",
                "_",
            )
        )

    safe_employee_name = (
        safe_employee_name
        .strip("_")
    )

    if not safe_employee_name:

        safe_employee_name = (
            f"employee_{employee_id}"
        )

    return (
        f"{employee_id}_"
        f"{safe_employee_name}.jpg"
    )


# ------------------------------------------------------------------------
# ATTENDANCE IMAGE DIRECTORY
# ------------------------------------------------------------------------

def get_attendance_image_directory(
    action: str,
    attendance_date: date | None = None,
) -> Path:
    """
    Return the directory where the attendance image
    for the specified action/date must be stored.

    Structure:

        app/static/
            uploads/
                attendance/
                    punch in/
                        YYYY-MM-DD/

                    punch out/
                        YYYY-MM-DD/

    The action folder and date folder are created
    automatically if they do not exist.
    """

    if action == "punch_in":

        action_directory_name = (
            PUNCH_IN_DIRECTORY_NAME
        )

    elif action == "punch_out":

        action_directory_name = (
            PUNCH_OUT_DIRECTORY_NAME
        )

    else:

        raise HTTPException(
            status_code=500,
            detail="Invalid attendance image action.",
        )

    if attendance_date is None:

        attendance_date = date.today()

    date_directory_name = (
        attendance_date.isoformat()
    )

    action_directory = (
        ATTENDANCE_UPLOAD_DIRECTORY
        / action_directory_name
    )

    date_directory = (
        action_directory
        / date_directory_name
    )

    try:

        date_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    except OSError:

        raise HTTPException(
            status_code=500,
            detail="Failed to create attendance image directory.",
        )

    return date_directory


# ------------------------------------------------------------------------
# SAVE ATTENDANCE IMAGE
# ------------------------------------------------------------------------

def save_attendance_image(
    image_bytes: bytes,
    employee: Employee,
    action: str,
    attendance_date: date | None = None,
) -> str:
    """
    Decode and re-encode the attendance image as JPEG.

    Physical storage structure:

        backend/app/static/uploads/attendance/
            punch in/YYYY-MM-DD/employee_id_employee_name.jpg
            punch out/YYYY-MM-DD/employee_id_employee_name.jpg

    Database path:

        uploads/attendance/punch in/YYYY-MM-DD/employee_id_employee_name.jpg

    IMPORTANT:
        The returned path is relative to STATIC_DIRECTORY,
        NOT PROJECT_ROOT.

    Returns:
        Relative path stored in attendance table.
    """

    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail="Attendance image cannot be empty.",
        )

    # ------------------------------------------------------------
    # Decode image
    # ------------------------------------------------------------

    image = decode_image(
        image_bytes
    )

    # ------------------------------------------------------------
    # Determine date
    # ------------------------------------------------------------

    if attendance_date is None:

        attendance_date = date.today()

    # ------------------------------------------------------------
    # Create action/date directory
    # ------------------------------------------------------------

    date_directory = (
        get_attendance_image_directory(
            action=action,
            attendance_date=attendance_date,
        )
    )

    # ------------------------------------------------------------
    # Build employee filename
    # ------------------------------------------------------------

    filename = build_employee_image_filename(
        employee
    )

    file_path = (
        date_directory
        / filename
    )

    # ------------------------------------------------------------
    # Encode as JPEG
    # ------------------------------------------------------------

    try:

        success, encoded_image = cv2.imencode(
            ".jpg",
            image,
            [
                int(cv2.IMWRITE_JPEG_QUALITY),
                90,
            ],
        )

        if not success:

            raise OSError(
                "JPEG encoding failed."
            )

        file_path.write_bytes(
            encoded_image.tobytes()
        )

    except OSError:

        raise HTTPException(
            status_code=500,
            detail="Failed to save attendance image.",
        )

    # ------------------------------------------------------------
    # Return path relative to STATIC_DIRECTORY
    # ------------------------------------------------------------
    #
    # Physical path:
    #
    # backend/app/static/uploads/attendance/punch in/...
    #
    # Returned database path:
    #
    # uploads/attendance/punch in/...
    #
    # This prevents "static/" from being stored in the database.

    try:

        relative_path = file_path.relative_to(
            STATIC_DIRECTORY
        )

    except ValueError:

        raise HTTPException(
            status_code=500,
            detail="Failed to generate attendance image path.",
        )

    return str(
        relative_path
    ).replace(
        "\\",
        "/",
    )


# ------------------------------------------------------------------------
# DELETE ATTENDANCE IMAGE
# ------------------------------------------------------------------------

def delete_attendance_image(
    image_path: str | None,
) -> None:
    """
    Safely delete an attendance image.

    Used when the database transaction fails after
    an image has already been saved.

    Database paths are expected to be relative to
    STATIC_DIRECTORY.

    Example database path:

        uploads/attendance/punch in/2026-09-11/12_John_Doe.jpg

    Physical path resolved:

        backend/app/static/uploads/attendance/punch in/2026-09-11/12_John_Doe.jpg
    """

    if not image_path:

        return

    try:

        # ------------------------------------------------------------
        # Normalize database path
        # ------------------------------------------------------------

        normalized_image_path = str(
            image_path
        ).replace(
            "\\",
            "/",
        ).lstrip("/")

        # ------------------------------------------------------------
        # Resolve relative to static directory
        # ------------------------------------------------------------

        file_path = (
            STATIC_DIRECTORY
            / normalized_image_path
        ).resolve()

        static_directory = (
            STATIC_DIRECTORY.resolve()
        )

        # ------------------------------------------------------------
        # Prevent path traversal
        # ------------------------------------------------------------

        if not file_path.is_relative_to(
            static_directory
        ):

            return

        # ------------------------------------------------------------
        # Delete file if it exists
        # ------------------------------------------------------------

        if file_path.exists():

            file_path.unlink()

    except (
        OSError,
        ValueError,
    ):

        return


# ------------------------------------------------------------------------
# RESPONSE BUILDER
# ------------------------------------------------------------------------

def build_attendance_response(
    attendance: Attendance,
    message: str,
    face_status: str | None = None,
    face_similarity: float | None = None,
    matched_capture_type: str | None = None,
) -> dict:
    """
    Build the common attendance API response.
    """

    return {
        "message": message,
        "attendance_id": attendance.id,
        "employee_id": attendance.employee_id,
        "date": attendance.date,
        "check_in": attendance.check_in,
        "lunch_out": attendance.lunch_out,
        "lunch_in": attendance.lunch_in,
        "check_out": attendance.check_out,
        "is_wfh": attendance.is_wfh,
        "face_status": face_status,
        "face_similarity": face_similarity,
        "matched_capture_type": matched_capture_type,
    }


# ------------------------------------------------------------------------
# PUNCH IN
# ------------------------------------------------------------------------

async def punch_in(
    db: Session,
    employee: Employee,
    image_bytes: bytes,
    latitude: float | None = None,
    longitude: float | None = None,
) -> dict:
    """
    Punch in an employee using face recognition.

    Flow:

        authenticated employee
                ↓
        employee validation
                ↓
        incoming image
                ↓
        face validation
                ↓
        generate 512-D embedding
                ↓
        get FRONT + LEFT + RIGHT
                ↓
        compare all embeddings
                ↓
        highest similarity
                ↓
        save image
                ↓
        create/update today's attendance row
    """

    # ------------------------------------------------------------
    # 1. Validate employee
    # ------------------------------------------------------------

    validate_employee_for_attendance(
        employee
    )

    # ------------------------------------------------------------
    # 2. Validate GPS location (required for Work From Office)
    # ------------------------------------------------------------

    if employee.status != "WFH":

        if latitude is None or longitude is None:

            raise HTTPException(
                status_code=400,
                detail={
                    "code": "LOCATION_REQUIRED",
                    "message": "GPS location (latitude and longitude) is required for Work From Office punch in.",
                },
            )

        distance_m = haversine_distance(
            lat1=latitude,
            lon1=longitude,
            lat2=settings.OFFICE_LATITUDE,
            lon2=settings.OFFICE_LONGITUDE,
        )

        if distance_m > settings.OFFICE_RADIUS_METERS:

            raise HTTPException(
                status_code=400,
                detail={
                    "code": "OUTSIDE_OFFICE_LOCATION",
                    "message": (
                        f"You are {distance_m:.0f} meters away from the office. "
                        f"Punch in is only allowed within {settings.OFFICE_RADIUS_METERS:.0f} meters."
                    ),
                    "distance_meters": round(distance_m, 2),
                    "allowed_radius_meters": settings.OFFICE_RADIUS_METERS,
                },
            )

    # ------------------------------------------------------------
    # 3. Validate image
    # ------------------------------------------------------------

    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail="Face image is required for punch in.",
        )

    # ------------------------------------------------------------
    # 3. Check today's attendance
    # ------------------------------------------------------------

    attendance = get_today_attendance(
        db=db,
        employee_id=employee.id,
    )

    if (
        attendance is not None
        and attendance.check_in is not None
    ):

        raise HTTPException(
            status_code=409,
            detail="Employee has already punched in today.",
        )

    # ------------------------------------------------------------
    # 4. Verify face
    # ------------------------------------------------------------

    face_result = verify_employee_face(
        db=db,
        employee_id=employee.id,
        image_bytes=image_bytes,
    )

    face_similarity = face_result[
        "best_similarity"
    ]

    matched_capture_type = face_result[
        "matched_capture_type"
    ]

    # ------------------------------------------------------------
    # 5. Save image
    # ------------------------------------------------------------

    saved_image_path = save_attendance_image(
        image_bytes=image_bytes,
        employee=employee,
        action="punch_in",
        attendance_date=date.today(),
    )

    # ------------------------------------------------------------
    # 6. Create/update attendance row
    # ------------------------------------------------------------

    now = datetime.now()

    try:

        if attendance is None:

            attendance = Attendance(
                employee_id=employee.id,
                date=date.today(),
                check_in=now,
                check_in_latitude=latitude,
                check_in_longitude=longitude,
                check_in_confidence=face_similarity,
                is_wfh=(
                    employee.status == "WFH"
                ),
                check_in_image=saved_image_path,
            )

            db.add(attendance)

        else:

            attendance.check_in = now

            attendance.check_in_latitude = (
                latitude
            )

            attendance.check_in_longitude = (
                longitude
            )

            attendance.check_in_confidence = (
                face_similarity
            )

            attendance.is_wfh = (
                employee.status == "WFH"
            )

            attendance.check_in_image = (
                saved_image_path
            )

        db.commit()

        db.refresh(
            attendance
        )

    except IntegrityError:

        db.rollback()

        delete_attendance_image(
            saved_image_path
        )

        raise HTTPException(
            status_code=409,
            detail="Attendance for today already exists.",
        )

    except Exception:

        db.rollback()

        delete_attendance_image(
            saved_image_path
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to save punch-in attendance.",
        )

    # ------------------------------------------------------------
    # 7. Return response
    # ------------------------------------------------------------

    return build_attendance_response(
        attendance=attendance,
        message="Punch in successful.",
        face_status="matched",
        face_similarity=face_similarity,
        matched_capture_type=matched_capture_type,
    )


# ------------------------------------------------------------------------
# PUNCH OUT
# ------------------------------------------------------------------------

async def punch_out(
    db: Session,
    employee: Employee,
    image_bytes: bytes,
    latitude: float | None = None,
    longitude: float | None = None,
) -> dict:
    """
    Punch out an employee using face recognition.

    The employee must have punched in first.

    Face verification uses:

        FRONT
        LEFT
        RIGHT
    """

    # ------------------------------------------------------------
    # 1. Validate employee
    # ------------------------------------------------------------

    validate_employee_for_attendance(
        employee
    )

    # ------------------------------------------------------------
    # 2. Validate GPS location (required for Work From Office)
    # ------------------------------------------------------------

    if employee.status != "WFH":

        if latitude is None or longitude is None:

            raise HTTPException(
                status_code=400,
                detail={
                    "code": "LOCATION_REQUIRED",
                    "message": "GPS location (latitude and longitude) is required for Work From Office punch out.",
                },
            )

        distance_m = haversine_distance(
            lat1=latitude,
            lon1=longitude,
            lat2=settings.OFFICE_LATITUDE,
            lon2=settings.OFFICE_LONGITUDE,
        )

        if distance_m > settings.OFFICE_RADIUS_METERS:

            raise HTTPException(
                status_code=400,
                detail={
                    "code": "OUTSIDE_OFFICE_LOCATION",
                    "message": (
                        f"You are {distance_m:.0f} meters away from the office. "
                        f"Punch out is only allowed within {settings.OFFICE_RADIUS_METERS:.0f} meters."
                    ),
                    "distance_meters": round(distance_m, 2),
                    "allowed_radius_meters": settings.OFFICE_RADIUS_METERS,
                },
            )

    # ------------------------------------------------------------
    # 3. Validate image
    # ------------------------------------------------------------

    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail="Face image is required for punch out.",
        )

    # ------------------------------------------------------------
    # 3. Get today's attendance
    # ------------------------------------------------------------

    attendance = get_today_attendance(
        db=db,
        employee_id=employee.id,
    )

    if attendance is None:

        raise HTTPException(
            status_code=400,
            detail="Employee must punch in before punching out.",
        )

    # ------------------------------------------------------------
    # 4. Require punch in
    # ------------------------------------------------------------

    if attendance.check_in is None:

        raise HTTPException(
            status_code=400,
            detail="Employee must punch in before punching out.",
        )

    # ------------------------------------------------------------
    # 5. Prevent duplicate punch out
    # ------------------------------------------------------------

    if attendance.check_out is not None:

        raise HTTPException(
            status_code=409,
            detail="Employee has already punched out today.",
        )

    # ------------------------------------------------------------
    # 6. Verify face
    # ------------------------------------------------------------

    face_result = verify_employee_face(
        db=db,
        employee_id=employee.id,
        image_bytes=image_bytes,
    )

    face_similarity = face_result[
        "best_similarity"
    ]

    matched_capture_type = face_result[
        "matched_capture_type"
    ]

    # ------------------------------------------------------------
    # 7. Save image
    # ------------------------------------------------------------

    saved_image_path = save_attendance_image(
        image_bytes=image_bytes,
        employee=employee,
        action="punch_out",
        attendance_date=date.today(),
    )

    # ------------------------------------------------------------
    # 8. Update today's attendance row
    # ------------------------------------------------------------

    now = datetime.now()

    try:

        attendance.check_out = now

        attendance.check_out_latitude = (
            latitude
        )

        attendance.check_out_longitude = (
            longitude
        )

        attendance.check_out_confidence = (
            face_similarity
        )

        attendance.check_out_image = (
            saved_image_path
        )

        db.commit()

        db.refresh(
            attendance
        )

    except Exception:

        db.rollback()

        delete_attendance_image(
            saved_image_path
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to save punch-out attendance.",
        )

    # ------------------------------------------------------------
    # 9. Return response
    # ------------------------------------------------------------

    return build_attendance_response(
        attendance=attendance,
        message="Punch out successful.",
        face_status="matched",
        face_similarity=face_similarity,
        matched_capture_type=matched_capture_type,
    )


# ------------------------------------------------------------------------
# LUNCH OUT
# ------------------------------------------------------------------------

def lunch_out(
    db: Session,
    employee: Employee,
    latitude: float | None = None,
    longitude: float | None = None,
) -> dict:
    """
    Mark lunch out.

    NO face recognition is performed.

    Requirements:

        - employee authenticated
        - employee punched in
        - employee has not punched out
        - lunch out not already marked
    """

    # ------------------------------------------------------------
    # 1. Validate employee
    # ------------------------------------------------------------

    validate_employee_for_attendance(
        employee
    )

    # ------------------------------------------------------------
    # 2. Get today's attendance
    # ------------------------------------------------------------

    attendance = get_today_attendance(
        db=db,
        employee_id=employee.id,
    )

    if attendance is None:

        raise HTTPException(
            status_code=400,
            detail="Employee must punch in before lunch out.",
        )

    # ------------------------------------------------------------
    # 3. Require punch in
    # ------------------------------------------------------------

    if attendance.check_in is None:

        raise HTTPException(
            status_code=400,
            detail="Employee must punch in before lunch out.",
        )

    # ------------------------------------------------------------
    # 4. Cannot lunch out after punch out
    # ------------------------------------------------------------

    if attendance.check_out is not None:

        raise HTTPException(
            status_code=400,
            detail="Cannot mark lunch out after punching out.",
        )

    # ------------------------------------------------------------
    # 5. Prevent duplicate lunch out
    # ------------------------------------------------------------

    if attendance.lunch_out is not None:

        raise HTTPException(
            status_code=409,
            detail="Lunch out has already been marked today.",
        )

    # ------------------------------------------------------------
    # 6. Save lunch out
    # ------------------------------------------------------------

    try:

        attendance.lunch_out = datetime.now()

        db.commit()

        db.refresh(
            attendance
        )

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to save lunch-out attendance.",
        )

    # ------------------------------------------------------------
    # 7. Return response
    # ------------------------------------------------------------

    return build_attendance_response(
        attendance=attendance,
        message="Lunch out successful.",
    )


# ------------------------------------------------------------------------
# LUNCH IN
# ------------------------------------------------------------------------

def lunch_in(
    db: Session,
    employee: Employee,
    latitude: float | None = None,
    longitude: float | None = None,
) -> dict:
    """
    Mark lunch in.

    NO face recognition is performed.

    Requirements:

        - employee authenticated
        - employee punched in
        - lunch out already marked
        - lunch in not already marked
        - employee has not punched out
    """

    # ------------------------------------------------------------
    # 1. Validate employee
    # ------------------------------------------------------------

    validate_employee_for_attendance(
        employee
    )

    # ------------------------------------------------------------
    # 2. Get today's attendance
    # ------------------------------------------------------------

    attendance = get_today_attendance(
        db=db,
        employee_id=employee.id,
    )

    if attendance is None:

        raise HTTPException(
            status_code=400,
            detail="Employee must punch in before lunch in.",
        )

    # ------------------------------------------------------------
    # 3. Require punch in
    # ------------------------------------------------------------

    if attendance.check_in is None:

        raise HTTPException(
            status_code=400,
            detail="Employee must punch in before lunch in.",
        )

    # ------------------------------------------------------------
    # 4. Require lunch out first
    # ------------------------------------------------------------

    if attendance.lunch_out is None:

        raise HTTPException(
            status_code=400,
            detail="Employee must mark lunch out before lunch in.",
        )

    # ------------------------------------------------------------
    # 5. Cannot lunch in after punch out
    # ------------------------------------------------------------

    if attendance.check_out is not None:

        raise HTTPException(
            status_code=400,
            detail="Cannot mark lunch in after punching out.",
        )

    # ------------------------------------------------------------
    # 6. Prevent duplicate lunch in
    # ------------------------------------------------------------

    if attendance.lunch_in is not None:

        raise HTTPException(
            status_code=409,
            detail="Lunch in has already been marked today.",
        )

    # ------------------------------------------------------------
    # 7. Save lunch in
    # ------------------------------------------------------------

    try:

        attendance.lunch_in = datetime.now()

        db.commit()

        db.refresh(
            attendance
        )

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to save lunch-in attendance.",
        )

    # ------------------------------------------------------------
    # 8. Return response
    # ------------------------------------------------------------

    return build_attendance_response(
        attendance=attendance,
        message="Lunch in successful.",
    )