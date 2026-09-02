# backend/app/services/employee_face_profile_service.py
import logging
from datetime import datetime
from typing import Optional

import numpy as np
from sqlalchemy.orm import Session

from app.models.employee_face_profiles import EmployeeFaceProfile
from app.utils.face_embedding import extract_face_embedding
from app.utils.file_upload import resolve_static_file_path


logger = logging.getLogger(__name__)

# InsightFace embedding size
EMBEDDING_SIZE = 512


class EmployeeFaceProfileService:

    # =========================================================
    # NORMALIZE EMBEDDING
    # =========================================================

    @staticmethod
    def _normalize_embedding(
        embedding,
    ) -> list[float]:

        if embedding is None:
            raise ValueError(
                "Embedding is None"
            )

        if isinstance(
            embedding,
            list,
        ):
            embedding = np.array(
                embedding,
                dtype=np.float32,
            )

        elif not isinstance(
            embedding,
            np.ndarray,
        ):
            embedding = np.array(
                embedding,
                dtype=np.float32,
            )

        embedding = embedding.flatten()

        if embedding.shape[0] != EMBEDDING_SIZE:
            raise ValueError(
                "Invalid embedding length: "
                f"expected {EMBEDDING_SIZE}, "
                f"got {embedding.shape[0]}"
            )

        norm = np.linalg.norm(
            embedding
        )

        if norm == 0:
            raise ValueError(
                "Embedding norm is zero"
            )

        embedding = embedding / norm

        return (
            embedding
            .astype(float)
            .tolist()
        )

    # =========================================================
    # HUMAN READABLE ERROR
    # =========================================================

    @staticmethod
    def _human_readable_face_error(
        exc: Exception,
    ) -> str:

        raw = str(exc or "").strip()
        lowered = raw.lower()

        if any(
            token in lowered
            for token in [
                "no face detected",
                "face embedding extraction returned none",
                "cannot read image",
                "image not readable",
                "corrupted",
                "invalid embedding",
                "embedding norm is zero",
            ]
        ):
            return (
                "Face could not be extracted from this "
                "profile image. Please upload a clear "
                "front-facing photo with good lighting."
            )

        if any(
            token in lowered
            for token in [
                "face image not found",
                "image path is empty",
                "invalid image path",
            ]
        ):
            return (
                "Uploaded profile image could not be "
                "read from server storage. "
                "Please upload the image again."
            )

        return (
            "Unable to process this profile image "
            "for face login. Please upload another "
            "clear image."
        )

    # =========================================================
    # CREATE / UPDATE EMPLOYEE FACE PROFILE
    # =========================================================

    @staticmethod
    def upsert_face_profile(
        db: Session,
        *,
        employee_id: int,
        image_path: str,
        updated_by: Optional[int] = None,
    ) -> EmployeeFaceProfile:

        try:

            # -------------------------------------------------
            # Resolve stored web path
            # -------------------------------------------------

            absolute_image_path = (
                EmployeeFaceProfileService
                ._resolve_absolute_image_path(
                    image_path
                )
            )

            if not absolute_image_path.exists():
                raise FileNotFoundError(
                    "Face image not found: "
                    f"{absolute_image_path}"
                )

            # -------------------------------------------------
            # Extract face embedding
            # -------------------------------------------------

            raw_embedding = extract_face_embedding(
                str(absolute_image_path)
            )

            if raw_embedding is None:
                raise ValueError(
                    "Face embedding extraction returned None"
                )

            # -------------------------------------------------
            # Normalize to 512 dimensions
            # -------------------------------------------------

            embedding = (
                EmployeeFaceProfileService
                ._normalize_embedding(
                    raw_embedding
                )
            )

            now = datetime.utcnow()

            # -------------------------------------------------
            # Find existing employee face profile
            # -------------------------------------------------

            profile = (
                db.query(EmployeeFaceProfile)
                .filter(
                    EmployeeFaceProfile.employee_id
                    == employee_id,
                )
                .first()
            )

            if profile:

                profile.face_embedding = embedding
                profile.updated_at = now
                profile.updated_by = updated_by
                profile.deleted_at = None

            else:

                profile = EmployeeFaceProfile(
                    employee_id=employee_id,
                    face_embedding=embedding,
                    created_at=now,
                    updated_by=updated_by,
                )

                db.add(profile)

            db.flush()

            return profile

        except Exception as exc:

            readable_error = (
                EmployeeFaceProfileService
                ._human_readable_face_error(
                    exc
                )
            )

            logger.error(
                "[FACE] Employee face profile "
                f"upsert failed for employee "
                f"{employee_id}: {exc}",
                exc_info=True,
            )

            raise ValueError(
                readable_error
            ) from exc

    # =========================================================
    # GET FACE PROFILE
    # =========================================================

    @staticmethod
    def get_face_profile(
        db: Session,
        employee_id: int,
    ) -> Optional[EmployeeFaceProfile]:

        try:

            return (
                db.query(EmployeeFaceProfile)
                .filter(
                    EmployeeFaceProfile.employee_id
                    == employee_id,
                    EmployeeFaceProfile.deleted_at.is_(None),
                )
                .first()
            )

        except Exception as exc:

            logger.error(
                "[FACE] Failed to get employee "
                "face profile",
                exc_info=True,
            )

            return None

    # =========================================================
    # DELETE FACE PROFILE
    # =========================================================

    @staticmethod
    def delete_face_profile(
        db: Session,
        employee_id: int,
    ) -> bool:

        try:

            profile = (
                db.query(EmployeeFaceProfile)
                .filter(
                    EmployeeFaceProfile.employee_id
                    == employee_id,
                    EmployeeFaceProfile.deleted_at.is_(None),
                )
                .first()
            )

            if not profile:
                return False

            profile.deleted_at = datetime.utcnow()

            db.flush()

            return True

        except Exception:

            logger.error(
                "[FACE] Failed to delete employee "
                "face profile",
                exc_info=True,
            )

            return False

    # =========================================================
    # RESOLVE IMAGE PATH
    # =========================================================

    @staticmethod
    def _resolve_absolute_image_path(
        image_path: str,
    ):

        if not image_path:
            raise ValueError(
                "Image path is empty"
            )

        resolved = resolve_static_file_path(
            image_path
        )

        if not resolved:
            raise ValueError(
                "Invalid image path format: "
                f"{image_path}"
            )

        return resolved