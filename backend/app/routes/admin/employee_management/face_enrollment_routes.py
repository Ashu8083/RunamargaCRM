# backend\app\routes\admin\employee_management\face_enrollment_routes.py

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee

from app.controllers.employee_management.face_enrollment_controller import (
    create_face_enrollment_controller,
    get_face_enrollments_controller,
    delete_face_enrollment_controller,
)

from app.schemas.employee_management.face_enrollment_schema import (
    FaceCaptureType,
    FaceEnrollmentListResponse,
    FaceEnrollmentDeleteResponse,
)


router = APIRouter(
    prefix="/face-enrollment",
    tags=["Face Enrollment"],
)


# ============================================================
# CREATE / RE-REGISTER FACE ENROLLMENT
# ============================================================

@router.post(
    "/{employee_id}",
    response_model=FaceEnrollmentListResponse,
)
async def create_face_enrollment(
    employee_id: int,
    capture_type: FaceCaptureType,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_employee=Depends(get_current_employee),
):
    image_bytes = await image.read()

    return create_face_enrollment_controller(
        db=db,
        employee_id=employee_id,
        image_bytes=image_bytes,
        capture_type=capture_type.value,
        updated_by=current_employee.id,
    )


# ============================================================
# GET ALL EMPLOYEES + THEIR FACE ENROLLMENTS
# ============================================================

@router.get(
    "",
    response_model=FaceEnrollmentListResponse,
)
def get_face_enrollments(
    db: Session = Depends(get_db),
    current_employee=Depends(get_current_employee),
):
    return get_face_enrollments_controller(
        db=db,
    )


# ============================================================
# DELETE ONE FACE ENROLLMENT
# ============================================================

@router.delete(
    "/{employee_id}/{capture_type}",
    response_model=FaceEnrollmentDeleteResponse,
)
def delete_face_enrollment(
    employee_id: int,
    capture_type: FaceCaptureType,
    db: Session = Depends(get_db),
    current_employee=Depends(get_current_employee),
):
    return delete_face_enrollment_controller(
        db=db,
        employee_id=employee_id,
        capture_type=capture_type.value,
        updated_by=current_employee.id,
    )