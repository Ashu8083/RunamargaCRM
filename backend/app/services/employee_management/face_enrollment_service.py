# backend/app/services/employee_management/face_enrollment_service.py

from datetime import datetime
from pathlib import Path
from uuid import uuid4

import cv2
import numpy as np
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.models.employee_face_profiles import EmployeeFaceProfile

from app.services.face.face_embedding import generate_embedding
from app.services.face.face_validation import (
    detect_faces,
    validate_single_face,
    validate_detection_confidence,
    validate_face_size,
    validate_face_blur,
    validate_face_brightness,
)


ALLOWED_CAPTURE_TYPES = {
    "FRONT",
    "LEFT",
    "RIGHT",
}


UPLOAD_DIRECTORY = (
    Path(__file__).resolve().parent.parent
    / "static"
    / "uploads"
    / "face_enrollment"
)


# ============================================================
# CAPTURE TYPE
# ============================================================

def validate_capture_type(capture_type: str) -> str:
    capture_type = capture_type.upper()

    if capture_type not in ALLOWED_CAPTURE_TYPES:
        raise ValueError(
            "Invalid capture type. Allowed values are FRONT, LEFT and RIGHT."
        )

    return capture_type


# ============================================================
# EMPLOYEE
# ============================================================

def get_active_employee(
    db: Session,
    employee_id: int,
):
    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
            Employee.deactivate.is_(False),
        )
        .first()
    )

    if employee is None:
        raise ValueError("Employee not found.")

    return employee


# ============================================================
# IMAGE DECODING
# ============================================================

def decode_image(image_bytes: bytes):
    if not image_bytes:
        raise ValueError("Image is empty.")

    image_array = np.frombuffer(
        image_bytes,
        dtype=np.uint8,
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR,
    )

    if image is None:
        raise ValueError("Invalid image file.")

    return image


# ============================================================
# FACE VALIDATION
# ============================================================

def validate_enrollment_face(image):
    faces = detect_faces(image)

    success, code, message = validate_single_face(faces)

    if not success:
        raise ValueError(message)

    face = faces[0]

    success, code, message, confidence = (
        validate_detection_confidence(face)
    )

    if not success:
        raise ValueError(message)

    success, code, message = validate_face_size(face)

    if not success:
        raise ValueError(message)

    success, code, message, sharpness = (
        validate_face_blur(
            image,
            face,
        )
    )

    if not success:
        raise ValueError(message)

    success, code, message, brightness = (
        validate_face_brightness(
            image,
            face,
        )
    )

    if not success:
        raise ValueError(message)

    return face


# ============================================================
# ACTIVE FACE PROFILE
# ============================================================

def get_active_face_profile(
    db: Session,
    employee_id: int,
    capture_type: str,
):
    return (
        db.query(EmployeeFaceProfile)
        .filter(
            EmployeeFaceProfile.employee_id == employee_id,
            EmployeeFaceProfile.capture_type == capture_type,
            EmployeeFaceProfile.deleted_at.is_(None),
        )
        .first()
    )


# ============================================================
# SAVE IMAGE
# ============================================================

def save_enrollment_image(
    image,
    employee_id: int,
    capture_type: str,
):
    employee_directory = (
        UPLOAD_DIRECTORY / str(employee_id)
    )

    employee_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    filename = (
        f"{capture_type.lower()}_"
        f"{uuid4().hex}.jpg"
    )

    absolute_path = employee_directory / filename

    success = cv2.imwrite(
        str(absolute_path),
        image,
        [
            cv2.IMWRITE_JPEG_QUALITY,
            95,
        ],
    )

    if not success:
        raise ValueError(
            "Failed to save enrollment image."
        )

    relative_path = (
        Path("face_enrollment")
        / str(employee_id)
        / filename
    )

    return relative_path.as_posix()


# ============================================================
# DELETE IMAGE FILE
# ============================================================

def delete_image_file(
    image_path: str | None,
):
    if not image_path:
        return

    upload_root = (
        Path(__file__).resolve().parent.parent
        / "static"
        / "uploads"
    )

    file_path = upload_root / image_path

    try:
        file_path.resolve().relative_to(
            upload_root.resolve()
        )
    except ValueError:
        return

    if file_path.exists() and file_path.is_file():
        file_path.unlink()


# ============================================================
# CREATE / RE-REGISTER ENROLLMENT
# ============================================================

def create_face_enrollment(
    db: Session,
    employee_id: int,
    image_bytes: bytes,
    capture_type: str,
    updated_by: int | None = None,
):
    capture_type = validate_capture_type(
        capture_type
    )

    # --------------------------------------------------------
    # 1. Check employee
    # --------------------------------------------------------

    get_active_employee(
        db=db,
        employee_id=employee_id,
    )

    # --------------------------------------------------------
    # 2. Decode image
    # --------------------------------------------------------

    image = decode_image(
        image_bytes
    )

    # --------------------------------------------------------
    # 3. Validate face
    # --------------------------------------------------------

    face = validate_enrollment_face(
        image=image
    )

    # --------------------------------------------------------
    # 4. Generate embedding
    #    GLOBAL face_embedding.py
    # --------------------------------------------------------

    embedding = generate_embedding(
        face
    )

    # --------------------------------------------------------
    # 5. Check existing enrollment
    # --------------------------------------------------------

    existing_profile = get_active_face_profile(
        db=db,
        employee_id=employee_id,
        capture_type=capture_type,
    )

    # --------------------------------------------------------
    # 6. Save image
    # --------------------------------------------------------

    image_path = save_enrollment_image(
        image=image,
        employee_id=employee_id,
        capture_type=capture_type,
    )

    try:

        # ====================================================
        # EXISTING CAPTURE → RE-REGISTER
        # ====================================================

        if existing_profile:

            old_image_path = (
                existing_profile.image_path
            )

            existing_profile.face_embedding = embedding
            existing_profile.image_path = image_path
            existing_profile.updated_at = datetime.utcnow()
            existing_profile.updated_by = updated_by

            db.commit()
            db.refresh(existing_profile)

            if old_image_path != image_path:
                delete_image_file(
                    old_image_path
                )

        # ====================================================
        # NEW CAPTURE
        # ====================================================

        else:

            profile = EmployeeFaceProfile(
                employee_id=employee_id,
                face_embedding=embedding,
                capture_type=capture_type,
                image_path=image_path,
                updated_by=updated_by,
            )

            db.add(profile)

            db.commit()

        return get_face_enrollments(
            db=db,
        )

    except Exception:
        db.rollback()

        delete_image_file(
            image_path
        )

        raise


# ============================================================
# GET ALL EMPLOYEES + THEIR ENROLLMENTS
# ============================================================

def get_face_enrollments(
    db: Session,
):
    employees = (
        db.query(Employee)
        .filter(
            Employee.deleted_at.is_(None),
            Employee.deactivate.is_(False),
        )
        .order_by(
            Employee.id.asc()
        )
        .all()
    )

    if not employees:
        return {
            "employees": []
        }

    employee_ids = [
        employee.id
        for employee in employees
    ]

    profiles = (
        db.query(EmployeeFaceProfile)
        .filter(
            EmployeeFaceProfile.employee_id.in_(
                employee_ids
            ),
            EmployeeFaceProfile.deleted_at.is_(None),
        )
        .order_by(
            EmployeeFaceProfile.employee_id.asc(),
            EmployeeFaceProfile.capture_type.asc(),
        )
        .all()
    )

    # --------------------------------------------------------
    # Group face profiles by employee
    # --------------------------------------------------------

    profiles_by_employee = {}

    for profile in profiles:
        if profile.employee_id not in profiles_by_employee:
            profiles_by_employee[
                profile.employee_id
            ] = []

        profiles_by_employee[
            profile.employee_id
        ].append(profile)

    # --------------------------------------------------------
    # Build one response row per employee
    # --------------------------------------------------------

    result = []

    for employee in employees:

        employee_profiles = (
            profiles_by_employee.get(
                employee.id,
                []
            )
        )

        result.append(
            {
                "employee_id": employee.id,
                "employee_name": employee.name,
                "enrollment_count": len(
                    employee_profiles
                ),
                "enrollments": employee_profiles,
            }
        )

    return {
        "employees": result
    }


# ============================================================
# DELETE ONE ENROLLMENT
# ============================================================

def delete_face_enrollment(
    db: Session,
    employee_id: int,
    capture_type: str,
    updated_by: int | None = None,
):
    capture_type = validate_capture_type(
        capture_type
    )

    # --------------------------------------------------------
    # Check employee
    # --------------------------------------------------------

    get_active_employee(
        db=db,
        employee_id=employee_id,
    )

    # --------------------------------------------------------
    # Find active enrollment
    # --------------------------------------------------------

    profile = get_active_face_profile(
        db=db,
        employee_id=employee_id,
        capture_type=capture_type,
    )

    if profile is None:
        raise ValueError(
            f"No active {capture_type} face enrollment found."
        )

    image_path = profile.image_path

    # --------------------------------------------------------
    # Soft delete database record
    # --------------------------------------------------------

    now = datetime.utcnow()

    profile.deleted_at = now
    profile.updated_at = now
    profile.updated_by = updated_by

    db.commit()

    # --------------------------------------------------------
    # Delete physical image
    # --------------------------------------------------------

    delete_image_file(
        image_path
    )

    return {
        "employee_id": employee_id,
        "capture_type": capture_type,
        "message": (
            f"{capture_type} face enrollment "
            "deleted successfully."
        ),
    }