# backend/app/services/CallManagement/call_log_service.py

from typing import Optional

from sqlalchemy.orm import Session, Query

from app.core.access_control import AccessControl
from app.models.call_logs import CallLog
from app.models.employees import Employee


class CallLogService:

    @staticmethod
    def apply_scope(
        query: Query,
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Query:
        """Apply the employee's access scope to the CallLog query."""

        if not employee:
            return query.filter(False)

        employee_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not employee_context or not employee_context.context:
            return query.filter(False)

        family = AccessControl.get_context_family(
            employee_context.context.code
        )

        if family in {"GLOBAL", "MANAGER"}:
            return query

        if family in {"AGENT", "RM"}:
            return query.filter(
                CallLog.employee_context_id == employee_context.id
            )

        if family == "TEAMLEAD":
            rms = AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=context_id,
            )

            rm_context_ids = [rm.id for rm in rms]

            if not rm_context_ids:
                return query.filter(False)

            return query.filter(
                CallLog.employee_context_id.in_(rm_context_ids)
            )

        return query.filter(False)

    @staticmethod
    def get_all(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ):
        """Get call logs belonging to the employee's scope."""

        query = (
            db.query(CallLog)
            .filter(
                CallLog.employee_id == employee.id,
            )
        )

        query = CallLogService.apply_scope(
            query=query,
            db=db,
            employee=employee,
            context_id=context_id,
        )

        return (
            query
            .order_by(
                CallLog.call_started_at.desc(),
                CallLog.id.desc(),
            )
            .all()
        )

    @staticmethod
    def get_history(
        db: Session,
        employee: Employee,
        phone_number: str,
        context_id: Optional[int] = None,
    ):
        """Get call history for a phone number within employee scope."""

        query = (
            db.query(CallLog)
            .filter(
                CallLog.phone_number == phone_number,
            )
        )

        query = CallLogService.apply_scope(
            query=query,
            db=db,
            employee=employee,
            context_id=context_id,
        )

        return (
            query
            .order_by(
                CallLog.call_started_at.desc(),
                CallLog.id.desc(),
            )
            .all()
        )