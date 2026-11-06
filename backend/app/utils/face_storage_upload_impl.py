from datetime import datetime
from pathlib import Path
import re

from app.utils.file_storage_service import FileService

# Directory names for each action
PUNCH_IN_DIR = "punch in"
PUNCH_OUT_DIR = "punch out"


class LocalFileService(FileService):
    """Concrete implementation of FileService for local disk storage.

    Storage structure::

        <static_dir>/
            uploads/
                attendance/
                    YYYY-MM-DD/
                        punch in/
                            {employee_code}_{employee_name}.jpg
                        punch out/
                            {employee_code}_{employee_name}.jpg

    The path returned (and stored in the DB) is relative to ``<static_dir>``:
        uploads/attendance/YYYY-MM-DD/punch in/{employee_code}_{employee_name}.jpg
    """

    def __init__(self, static_dir: Path):
        """
        Parameters
        ----------
        static_dir:
            Absolute path to the static directory
            (e.g. ``backend/app/static``).
            Images are stored under ``static_dir/uploads/attendance/…``.
        """
        self.static_dir = Path(static_dir)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _sanitize(value: str) -> str:
        """Replace any non-alphanumeric character with underscore and
        collapse repeated underscores."""
        sanitized = re.sub(r"[^A-Za-z0-9]+", "_", value)
        return sanitized.strip("_") or "unknown"

    def _action_dir_name(self, action: str) -> str:
        if action == "punch_in":
            return PUNCH_IN_DIR
        if action == "punch_out":
            return PUNCH_OUT_DIR
        raise ValueError(f"Unknown attendance action: {action!r}")

    # ------------------------------------------------------------------
    # Abstract method implementation
    # ------------------------------------------------------------------

    def save_attendance_image(
        self,
        employee_id: int,
        attendance_id: int,
        action: str,
        captured_at: datetime,
        image_bytes: bytes,
        extension: str = "jpg",
        employee_code: str | None = None,
        employee_name: str | None = None,
    ) -> str:
        """Save the image and return a path relative to ``static_dir``.

        Structure written to disk::

            <static_dir>/uploads/attendance/YYYY-MM-DD/<action>/<code>_<name>.jpg

        Returned DB path (relative to static_dir)::

            uploads/attendance/YYYY-MM-DD/<action>/<code>_<name>.jpg
        """

        # ---- directory --------------------------------------------------
        date_str = captured_at.strftime("%Y-%m-%d")
        action_name = self._action_dir_name(action)

        directory = (
            self.static_dir
            / "uploads"
            / "attendance"
            / date_str
            / action_name
        )
        directory.mkdir(parents=True, exist_ok=True)

        # ---- filename ---------------------------------------------------
        code = self._sanitize(employee_code or str(employee_id))
        name = self._sanitize(employee_name or "employee")
        filename = f"{code}_{name}.{extension}"

        # ---- write ------------------------------------------------------
        file_path = directory / filename
        file_path.write_bytes(image_bytes)

        # ---- relative path (stored in DB) -------------------------------
        return str(file_path.relative_to(self.static_dir))
