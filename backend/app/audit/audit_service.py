from app.models import AuditLog
from sqlalchemy.orm import Session

class AuditService:


    @staticmethod
    def log(
        db: Session,
        *,
        action: str,
        module: str,
        entity_type: str | None = None,
        entity_id: str | None = None,
        description: str | None = None,
        request_id: str | None = None,
        employee_context_id: int | None = None,
        user_agent: str | None = None,
    ):
        audit = AuditLog(
            action=action,
            module=module,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
            request_id=request_id,
            employee_context_id=employee_context_id,
            user_agent=user_agent,
        )
        db.add(audit)