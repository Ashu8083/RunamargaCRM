from abc import ABC, abstractmethod
from datetime import datetime
from pathlib import Path

class FileService(ABC):
    """Abstract service for persisting attendance images.

    Implementations must store the image and return a path **relative to the
    configured base directory** so it can be saved directly in the database.
    """

    @abstractmethod
    def save_attendance_image(
        self,
        employee_id: int,
        attendance_id: int,
        action: str,
        captured_at: datetime,
        image_bytes: bytes,
        extension: str = "jpg",
    ) -> str:
        """Save an attendance image.

        Parameters
        ----------
        employee_id: int
            Identifier of the employee.
        attendance_id: int
            Attendance record primary key.
        action: str
            Either ``"punch_in"`` or ``"punch_out"`` (will be mapped to the
            directory names ``"punch in"`` / ``"punch out"``).
        captured_at: datetime
            Timestamp of the capture – used to create the ``YYYY‑MM‑DD`` folder.
        image_bytes: bytes
            Raw image data.
        extension: str, default ``"jpg"``
            File extension.
        """
        pass
