# app/services/face/face_validation.py

import cv2

from insightface.app import FaceAnalysis


# ---------------------------------------------------------
# Face Detection Model
# ---------------------------------------------------------

face_app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"],
)

face_app.prepare(
    ctx_id=0,
    det_size=(320, 320),
)


# ---------------------------------------------------------
# Face Detection
# ---------------------------------------------------------

def detect_faces(image):
    """
    Detect faces in an OpenCV image.

    Args:
        image: OpenCV BGR image.

    Returns:
        list: Detected InsightFace face objects.
    """

    if image is None:
        raise ValueError("Invalid image.")

    faces = face_app.get(image)

    return faces


# ---------------------------------------------------------
# Single Face Validation
# ---------------------------------------------------------

def validate_single_face(faces):
    """
    Ensure that exactly one face is detected.

    Args:
        faces: List of detected InsightFace faces.

    Returns:
        tuple:
            (
                success,
                error_code,
                message
            )
    """

    if len(faces) == 0:
        return (
            False,
            "NO_FACE",
            "No face detected in the image.",
        )

    if len(faces) > 1:
        return (
            False,
            "MULTIPLE_FACES",
            "Multiple faces detected. Please capture only one person.",
        )

    return (
        True,
        "FACE_OK",
        "Exactly one face detected.",
    )


# ---------------------------------------------------------
# Detection Confidence
# ---------------------------------------------------------

def validate_detection_confidence(
    face,
    min_confidence=0.70,
):
    """
    Validate face detection confidence.

    Args:
        face: InsightFace face object.
        min_confidence: Minimum acceptable detection confidence.

    Returns:
        tuple:
            (
                success,
                error_code,
                message,
                confidence
            )
    """

    confidence = float(face.det_score)

    if confidence < min_confidence:
        return (
            False,
            "LOW_DETECTION_CONFIDENCE",
            "Face detection confidence is too low. Please position your face clearly.",
            confidence,
        )

    return (
        True,
        "DETECTION_CONFIDENCE_OK",
        "Face detection confidence is acceptable.",
        confidence,
    )


# ---------------------------------------------------------
# Face Size Validation
# ---------------------------------------------------------

def validate_face_size(
    face,
    min_width=120,
    min_height=120,
):
    """
    Validate that the detected face is large enough.

    Args:
        face: InsightFace face object.
        min_width: Minimum face width in pixels.
        min_height: Minimum face height in pixels.

    Returns:
        tuple:
            (
                success,
                error_code,
                message
            )
    """

    x1, y1, x2, y2 = face.bbox

    face_width = x2 - x1
    face_height = y2 - y1

    if face_width < min_width or face_height < min_height:
        return (
            False,
            "FACE_TOO_SMALL",
            "Face is too small. Please move closer to the camera.",
        )

    return (
        True,
        "FACE_SIZE_OK",
        "Face size is acceptable.",
    )


# ---------------------------------------------------------
# Face Blur / Sharpness Validation
# ---------------------------------------------------------

def validate_face_blur(
    image,
    face,
    min_variance=15.0,
):
    """
    Check whether the detected face is sufficiently sharp.

    Uses Laplacian variance as a simple blur/sharpness
    measurement.

    Args:
        image: OpenCV BGR image.
        face: InsightFace face object.
        min_variance: Minimum acceptable sharpness value.

    Returns:
        tuple:
            (
                success,
                error_code,
                message,
                variance
            )
    """

    x1, y1, x2, y2 = map(
        int,
        face.bbox,
    )

    height, width = image.shape[:2]

    # Keep coordinates inside image boundaries
    x1 = max(0, x1)
    y1 = max(0, y1)
    x2 = min(width, x2)
    y2 = min(height, y2)

    face_crop = image[
        y1:y2,
        x1:x2,
    ]

    if face_crop.size == 0:
        return (
            False,
            "FACE_CROP_INVALID",
            "Could not process the detected face.",
            0.0,
        )

    # Convert to grayscale
    gray = cv2.cvtColor(
        face_crop,
        cv2.COLOR_BGR2GRAY,
    )

    # Standardize size
    gray = cv2.resize(
        gray,
        (256, 256),
    )

    # Calculate sharpness
    variance = cv2.Laplacian(
        gray,
        cv2.CV_64F,
    ).var()

    if variance < min_variance:
        return (
            False,
            "FACE_TOO_BLURRY",
            "Face image is too blurry. Please hold the camera steady.",
            variance,
        )

    return (
        True,
        "FACE_SHARPNESS_OK",
        "Face sharpness is acceptable.",
        variance,
    )


# ---------------------------------------------------------
# Face Brightness Validation
# ---------------------------------------------------------

def validate_face_brightness(
    image,
    face,
    min_brightness=50.0,
    max_brightness=210.0,
):
    """
    Check whether the detected face has acceptable brightness.

    Args:
        image: OpenCV BGR image.
        face: InsightFace face object.
        min_brightness: Minimum acceptable brightness.
        max_brightness: Maximum acceptable brightness.

    Returns:
        tuple:
            (
                success,
                error_code,
                message,
                brightness
            )
    """

    x1, y1, x2, y2 = map(
        int,
        face.bbox,
    )

    height, width = image.shape[:2]

    # Keep coordinates inside image boundaries
    x1 = max(0, x1)
    y1 = max(0, y1)
    x2 = min(width, x2)
    y2 = min(height, y2)

    face_crop = image[
        y1:y2,
        x1:x2,
    ]

    if face_crop.size == 0:
        return (
            False,
            "FACE_CROP_INVALID",
            "Could not process the detected face.",
            0.0,
        )

    gray = cv2.cvtColor(
        face_crop,
        cv2.COLOR_BGR2GRAY,
    )

    brightness = float(
        gray.mean()
    )

    if brightness < min_brightness:
        return (
            False,
            "FACE_TOO_DARK",
            "Face is too dark. Please move to a brighter area.",
            brightness,
        )

    if brightness > max_brightness:
        return (
            False,
            "FACE_TOO_BRIGHT",
            "Face is too bright. Please avoid direct strong light.",
            brightness,
        )

    return (
        True,
        "FACE_BRIGHTNESS_OK",
        "Face brightness is acceptable.",
        brightness,
    )