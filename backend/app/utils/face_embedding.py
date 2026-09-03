import cv2
import numpy as np
from insightface.app import FaceAnalysis


# =========================================================
# SINGLE SHARED INSIGHTFACE MODEL
# =========================================================

_face_app = None


def _get_face_app():
    global _face_app

    if _face_app is None:
        _face_app = FaceAnalysis(
            name="buffalo_l",
            providers=["CPUExecutionProvider"],
        )

        _face_app.prepare(
            ctx_id=0,
            det_size=(640, 640),
        )

    return _face_app


# =========================================================
# EXTRACT FACE EMBEDDING
# =========================================================

def extract_face_embedding(
    image_path: str,
) -> list[float]:

    if not image_path:
        raise ValueError(
            "Face image path is empty"
        )

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            "Cannot read image"
        )

    face_app = _get_face_app()

    faces = face_app.get(image)

    if not faces:
        raise ValueError(
            "No face detected"
        )

    # -----------------------------------------------------
    # For employee face login, require exactly one face.
    # -----------------------------------------------------

    if len(faces) > 1:
        raise ValueError(
            "Multiple faces detected"
        )

    face = faces[0]

    embedding = face.embedding

    if embedding is None:
        raise ValueError(
            "Face embedding extraction returned None"
        )

    embedding = np.asarray(
        embedding,
        dtype=np.float32,
    ).flatten()

    if embedding.shape[0] != 512:
        raise ValueError(
            "Invalid embedding length: "
            f"expected 512, "
            f"got {embedding.shape[0]}"
        )

    return embedding.tolist()