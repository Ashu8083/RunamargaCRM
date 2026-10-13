from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional, Generic, TypeVar

from sqlalchemy.orm import Session

T = TypeVar("T")

class AuditLogService(ABC,Generic[T]):

    @staticmethod
    @abstractmethod
    def log_audit_log(
                      db: Session,
                      action : Optional[str] = None,
                      action_by: Optional[int] = None,
                      action_on : Optional[int]= None,
                      report_to : Optional[int] = None,
                      date_and_time: Optional[datetime] = None,
                      delete : Optional[datetime] = None,
                      commit: bool = False,
                      ) -> List[T]:

        pass

    @staticmethod
    @abstractmethod
    def get_audit_logs(
                        db: Session,
                        page: int = 0,
                        limit: int = 100,
                        action: Optional[str] = None,
                        action_by: Optional[int] = None,
                        action_on: Optional[int] = None,
                      ) -> List[T]:
        pass