# app/utils/file_upload.py
import uuid
from pathlib import Path
from urllib.parse import urlparse

from fastapi import UploadFile

MAX_FILE_SIZE = 5 * 1024 * 1024
ALLOWED_IMAGE_EXTS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
}

DOCUMENT_EXTS = {
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


def _project_root() -> Path:
    current_file = Path(__file__).resolve()
    return current_file.parent.parent.parent


def save_file(
    file: UploadFile,
    subfolder: str,
    allowed_exts: set = ALLOWED_IMAGE_EXTS,
    max_size: int = MAX_FILE_SIZE,
):
    """
    Saves file inside:
    app/static/uploads/<subfolder>

    Returns:
    /uploads/<subfolder>/<filename>
    """

    if not file or not file.filename:
        return None

    ext = Path(file.filename).suffix.lower()

    if ext not in allowed_exts:
        raise ValueError("Invalid file type")

    contents = file.file.read()

    if len(contents) > max_size:
        raise ValueError("Max file size exceeded")

    project_root = _project_root()

    # Physical upload directory
    upload_dir = (
        project_root
        / "app"
        / "static"
        / "uploads"
        / subfolder
    )

    upload_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    filename = f"{uuid.uuid4()}{ext}"

    # Physical save path
    save_path = upload_dir / filename

    # Save file to disk
    with open(save_path, "wb") as f:
        f.write(contents)

    # IMPORTANT:
    # Return WEB PATH, not filesystem path
    # Example:
    # /uploads/admin/profile_image/abc.jpeg
    return f"/uploads/{subfolder}/{filename}"


def normalize_static_web_path(web_path: str) -> str | None:
    """
    Normalize upload paths.

    Supports:
    - /uploads/...
    - uploads/...
    - app/uploads/...
    - old /static/uploads/...
    - full URLs
    - Windows paths
    """

    if not web_path:
        return None

    normalized = (
        str(web_path)
        .strip()
        .strip('"')
        .strip("'")
        .replace("\\", "/")
    )

    if not normalized:
        return None

    parsed = urlparse(normalized)

    # Handle full URLs
    if parsed.scheme and parsed.path:
        normalized = parsed.path

    normalized = normalized.split("?", 1)[0].split("#", 1)[0]

    # Convert old static paths
    normalized = normalized.replace("/static/uploads/", "/uploads/")
    normalized = normalized.replace("static/uploads/", "uploads/")

    # Handle absolute Windows/Linux filesystem paths
    if "/uploads/" in normalized and not normalized.startswith("/uploads/"):
        normalized = normalized[normalized.find("/uploads/"):]

    normalized = normalized.lstrip("/")

    # Handle app/uploads/...
    if normalized.startswith("app/uploads/"):
        normalized = normalized[len("app/"):]

    # Convert uploads/... -> /uploads/...
    if normalized.startswith("uploads/"):
        normalized = f"/{normalized}"

    # Final validation
    if not normalized.startswith("/uploads/"):
        return None

    return normalized


def resolve_static_file_path(web_path: str) -> Path | None:
    """
    Convert web path to filesystem path.

    Example:
    /uploads/admin/profile_image/a.jpeg

    ->
    E:/project/app/static/uploads/admin/profile_image/a.jpeg
    """

    normalized = normalize_static_web_path(web_path)

    if not normalized:
        return None

    project_root = _project_root()

    uploads_root = (
        project_root
        / "app"
        / "static"
        / "uploads"
    ).resolve()

    relative = normalized[len("/uploads/"):].lstrip("/")

    candidate = (uploads_root / relative).resolve()

    # Security check
    try:
        candidate.relative_to(uploads_root)
    except ValueError:
        return None

    return candidate


def delete_static_file(web_path: str) -> bool:
    """
    Delete uploaded file from disk.
    """

    fs_path = resolve_static_file_path(web_path)

    if not fs_path:
        return False

    if fs_path.exists() and fs_path.is_file():
        fs_path.unlink()
        return True

    return False