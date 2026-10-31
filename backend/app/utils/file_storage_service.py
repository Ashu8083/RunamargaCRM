from abc import ABC, abstractmethod
from datetime import datetime


class FileService(ABC):

    @abstractmethod
    def save_attendance_image(
        self,
        employee_id,
        attendance_id,
        check_out_type : str,
        captured_at: datetime,
        image_bytes: bytes,
        extension: str = "jpg",
    ) -> str:
        pass