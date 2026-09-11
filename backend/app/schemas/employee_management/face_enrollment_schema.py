# backend/app/schemas/employee_management/face_enrollment_schema.py

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class FaceCaptureType(str, Enum):
    FRONT = "FRONT"
    LEFT = "LEFT"
    RIGHT = "RIGHT"


class FaceEnrollmentImageResponse(BaseModel):
    capture_type: FaceCaptureType
    image_path: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class FaceEnrollmentEmployeeResponse(BaseModel):
    employee_id: int
    employee_name: str
    enrollment_count: int
    enrollments: list[FaceEnrollmentImageResponse]


class FaceEnrollmentListResponse(BaseModel):
    employees: list[FaceEnrollmentEmployeeResponse]


class FaceEnrollmentDeleteResponse(BaseModel):
    employee_id: int
    capture_type: FaceCaptureType
    message: str