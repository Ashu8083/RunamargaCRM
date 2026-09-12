# app/services/face/face_recognition.py

import numpy as np


# ---------------------------------------------------------
# Recognition Configuration
# ---------------------------------------------------------

# IMPORTANT:
# This is only a temporary threshold for development.
# We will finalize the production threshold after
# proper testing.
DEFAULT_RECOGNITION_THRESHOLD = 0.60


# ---------------------------------------------------------
# Normalize Embedding
# ---------------------------------------------------------

def normalize_embedding(embedding):
    """
    Normalize a face embedding using L2 normalization.

    Args:
        embedding: Face embedding as a list or NumPy array.

    Returns:
        np.ndarray: Normalized embedding.
    """

    embedding = np.asarray(
        embedding,
        dtype=np.float32,
    )

    norm = np.linalg.norm(
        embedding
    )

    if norm == 0:
        raise ValueError(
            "Embedding normalization failed."
        )

    return embedding / norm


# ---------------------------------------------------------
# Cosine Similarity
# ---------------------------------------------------------

def calculate_cosine_similarity(
    embedding_1,
    embedding_2,
):
    """
    Calculate cosine similarity between two
    face embeddings.

    Args:
        embedding_1: First face embedding.
        embedding_2: Second face embedding.

    Returns:
        float: Cosine similarity score.
    """

    embedding_1 = normalize_embedding(
        embedding_1
    )

    embedding_2 = normalize_embedding(
        embedding_2
    )

    similarity = float(
        np.dot(
            embedding_1,
            embedding_2,
        )
    )

    return similarity


# ---------------------------------------------------------
# Compare Against Employee Embeddings
# ---------------------------------------------------------

def find_best_match(
    incoming_embedding,
    stored_embeddings,
):
    """
    Compare an incoming face embedding against
    all stored embeddings belonging to an employee.

    Args:
        incoming_embedding:
            512-dimensional embedding generated
            from the new verification image.

        stored_embeddings:
            Collection of stored employee embeddings.

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

    Returns:
        dict containing:

            {
                "success": True,
                "best_similarity": 0.81,
                "matched_capture_type": "FRONT"
            }
    """

    if incoming_embedding is None:
        raise ValueError(
            "Incoming face embedding is required."
        )

    if not stored_embeddings:
        return {
            "success": False,
            "code": "NO_STORED_EMBEDDINGS",
            "message": "No face embeddings are registered for this employee.",
            "best_similarity": None,
            "matched_capture_type": None,
        }

    best_similarity = None
    best_capture_type = None

    for stored_face in stored_embeddings:

        stored_embedding = stored_face["embedding"]

        capture_type = stored_face.get(
            "capture_type"
        )

        similarity = calculate_cosine_similarity(
            incoming_embedding,
            stored_embedding,
        )

        if (
            best_similarity is None
            or similarity > best_similarity
        ):
            best_similarity = similarity
            best_capture_type = capture_type

    return {
        "success": True,
        "code": "BEST_MATCH_FOUND",
        "message": "Best face similarity calculated.",
        "best_similarity": best_similarity,
        "matched_capture_type": best_capture_type,
    }


# ---------------------------------------------------------
# Face Verification
# ---------------------------------------------------------

def verify_face(
    incoming_embedding,
    stored_embeddings,
    threshold=DEFAULT_RECOGNITION_THRESHOLD,
):
    """
    Verify an incoming face against all stored
    embeddings belonging to an employee.

    The highest similarity score is used.

    Args:
        incoming_embedding:
            512-dimensional embedding generated
            from the new image.

        stored_embeddings:
            Employee's stored face embeddings.

        threshold:
            Minimum similarity required for a match.

    Returns:
        dict containing the final recognition result.
    """

    result = find_best_match(
        incoming_embedding=incoming_embedding,
        stored_embeddings=stored_embeddings,
    )

    # No registered embeddings
    if not result["success"]:
        return result

    best_similarity = result[
        "best_similarity"
    ]

    matched_capture_type = result[
        "matched_capture_type"
    ]

    # -----------------------------------------------------
    # Match
    # -----------------------------------------------------

    if best_similarity >= threshold:
        return {
            "success": True,
            "code": "FACE_MATCH",
            "message": "Face verification successful.",
            "matched": True,
            "best_similarity": best_similarity,
            "matched_capture_type": matched_capture_type,
            "threshold": threshold,
        }

    # -----------------------------------------------------
    # Mismatch
    # -----------------------------------------------------

    return {
        "success": True,
        "code": "FACE_MISMATCH",
        "message": "Face does not match the registered employee.",
        "matched": False,
        "best_similarity": best_similarity,
        "matched_capture_type": matched_capture_type,
        "threshold": threshold,
    }