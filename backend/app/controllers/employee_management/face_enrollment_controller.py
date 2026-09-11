# backend/app/controllers/employee_management/face_enrollment_controller.py

from sqlalchemy.orm import Session

from app.services.employee_management.face_enrollment_service import (
    create_face_enrollment,
    get_face_enrollments,
    delete_face_enrollment,
)


def create_face_enrollment_controller(
    db: Session,
    employee_id: int,
    image_bytes: bytes,
    capture_type: str,
    updated_by: int | None = None,
):
    return create_face_enrollment(
        db=db,
        employee_id=employee_id,
        image_bytes=image_bytes,
        capture_type=capture_type,
        updated_by=updated_by,
    )


def get_face_enrollments_controller(
    db: Session,
):
    return get_face_enrollments(
        db=db,
    )


def delete_face_enrollment_controller(
    db: Session,
    employee_id: int,
    capture_type: str,
    updated_by: int | None = None,
):
    return delete_face_enrollment(
        db=db,
        employee_id=employee_id,
        capture_type=capture_type,
        updated_by=updated_by,
    )