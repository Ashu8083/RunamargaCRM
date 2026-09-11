# app/services/face/face_embedding.py

import numpy as np

from insightface.app import FaceAnalysis


# ---------------------------------------------------------
# InsightFace Configuration
# ---------------------------------------------------------

MODEL_NAME = "buffalo_l"

MODEL_PROVIDERS = [
    "CPUExecutionProvider",
]

DETECTION_SIZE = (
    320,
    320,
)


# ---------------------------------------------------------
# Load InsightFace Model
# ---------------------------------------------------------

face_app = FaceAnalysis(
    name=MODEL_NAME,
    providers=MODEL_PROVIDERS,
)

face_app.prepare(
    ctx_id=-1,
    det_size=DETECTION_SIZE,
)


# ---------------------------------------------------------
# Face Embedding
# ---------------------------------------------------------

def generate_embedding(face):
    """
    Generate and normalize a face embedding from
    an InsightFace detected face.

    Args:
        face:
            InsightFace detected face object.

    Returns:
        list[float]:
            Normalized 512-dimensional face embedding.
    """

    if face is None:
        raise ValueError(
            "Invalid face object."
        )

    if face.embedding is None:
        raise ValueError(
            "Face embedding could not be generated."
        )

    # -----------------------------------------------------
    # Convert embedding to float32
    # -----------------------------------------------------

    embedding = face.embedding.astype(
        np.float32
    )

    # -----------------------------------------------------
    # Validate embedding dimensions
    # -----------------------------------------------------

    if embedding.ndim != 1:
        raise ValueError(
            "Invalid face embedding format."
        )

    if embedding.shape[0] != 512:
        raise ValueError(
            "Invalid face embedding dimension."
        )

    # -----------------------------------------------------
    # L2 Normalization
    # -----------------------------------------------------

    norm = np.linalg.norm(
        embedding
    )

    if norm == 0:
        raise ValueError(
            "Face embedding normalization failed."
        )

    embedding = embedding / norm

    # -----------------------------------------------------
    # Convert to Python list
    # -----------------------------------------------------

    return embedding.tolist()