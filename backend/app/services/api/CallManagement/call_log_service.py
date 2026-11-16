# backend/app/services/CallManagement/call_log_service.py

from datetime import date, datetime, time, timedelta
from typing import Optional

from sqlalchemy import String, cast, or_, func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Query, Session

from app.core.access_control import AccessControl
from app.core.log_config import logger
from app.models.call_logs import (
    CallLog,
    CallTypeEnum,
    MobileStatusEnum,
)
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.phone_numbers import PhoneNumber
from app.schemas.CallAnalytics.call_logs_scheema import CallLogsCreateSchema


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
    def _parse_enum(enum_type, value):
        if value is None or str(value).strip() == "":
            return None

        try:
            return enum_type(str(value).strip().lower())
        except ValueError:
            return None

    @staticmethod
    def _apply_filters(
        query: Query,
        search: Optional[str] = None,
        employee_id: Optional[int] = None,
        employee_context_id: Optional[int] = None,
        call_type: Optional[str] = None,
        mobile_status: Optional[str] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
    ) -> Query:
        if employee_context_id is not None:
            query = query.filter(
                CallLog.employee_context_id == employee_context_id
            )

        if employee_id is not None:
            query = query.filter(
                EmployeeContext.employee_id == employee_id
            )

        if search and search.strip():
            search_value = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    CallLog.phone_number.ilike(search_value),
                    Employee.name.ilike(search_value),
                    cast(CallLog.id, String).ilike(search_value),
                )
            )

        parsed_call_type = CallLogService._parse_enum(
            CallTypeEnum,
            call_type,
        )
        if call_type and parsed_call_type is None:
            return query.filter(False)
        if parsed_call_type is not None:
            query = query.filter(
                CallLog.call_type == parsed_call_type
            )

        parsed_mobile_status = CallLogService._parse_enum(
            MobileStatusEnum,
            mobile_status,
        )
        if mobile_status and parsed_mobile_status is None:
            return query.filter(False)
        if parsed_mobile_status is not None:
            query = query.filter(
                CallLog.mobile_status == parsed_mobile_status
            )

        if from_date is not None:
            query = query.filter(
                CallLog.call_started_at >= datetime.combine(
                    from_date,
                    time.min,
                )
            )

        if to_date is not None:
            query = query.filter(
                CallLog.call_started_at < datetime.combine(
                    to_date + timedelta(days=1),
                    time.min,
                )
            )

        return query

    @staticmethod
    def _get_query(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        search: Optional[str] = None,
        employee_id: Optional[int] = None,
        employee_context_id: Optional[int] = None,
        call_type: Optional[str] = None,
        mobile_status: Optional[str] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
    ) -> Query:
        query = (
            db.query(CallLog)
            .join(
                EmployeeContext,
                CallLog.employee_context_id == EmployeeContext.id,
            )
            .join(
                Employee,
                EmployeeContext.employee_id == Employee.id,
            )
        )

        query = CallLogService.apply_scope(
            query=query,
            db=db,
            employee=employee,
            context_id=context_id,
        )

        return CallLogService._apply_filters(
            query=query,
            search=search,
            employee_id=employee_id,
            employee_context_id=employee_context_id,
            call_type=call_type,
            mobile_status=mobile_status,
            from_date=from_date,
            to_date=to_date,
        )

    @staticmethod
    def _get_rows(
        query: Query,
        offset: int = 0,
        limit: Optional[int] = None,
    ):
        total_calls = func.count(CallLog.id).over(
            partition_by=CallLog.phone_number
        ).label("total_calls")

        ordered_query = (
            query.with_entities(CallLog, total_calls)
            .order_by(
                CallLog.call_started_at.desc(),
                CallLog.id.desc(),
            )
        )

        if offset:
            ordered_query = ordered_query.offset(offset)

        if limit is not None:
            ordered_query = ordered_query.limit(limit)

        return ordered_query.all()

    @staticmethod
    def get_all(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 10,
        agent_id: Optional[int] = None,
        employee_id: Optional[int] = None,
        employee_context_id: Optional[int] = None,
        call_type: Optional[str] = None,
        mobile_status: Optional[str] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
    ):
        """Get call logs in the employee's permitted scope."""

        if page < 1:
            raise ValueError("page must be at least 1")

        if page_size not in {10, 20, 50, 100, 200, 500}:
            raise ValueError(
                "page_size must be one of 10, 20, 50, 100, 200, or 500"
            )

        query = CallLogService._get_query(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            employee_context_id=(
                agent_id
                if agent_id is not None
                else employee_context_id
            ),
            employee_id=employee_id,
            call_type=call_type,
            mobile_status=mobile_status,
            from_date=from_date,
            to_date=to_date,
        )

        total_records = (
            query
            .order_by(None)
            .with_entities(func.count(CallLog.id))
            .scalar()
            or 0
        )

        rows = CallLogService._get_rows(
            query=query,
            offset=(page - 1) * page_size,
            limit=page_size,
        )

        return rows, total_records

    @staticmethod
    def get_history(
        db: Session,
        employee: Employee,
        phone_number: str,
        context_id: Optional[int] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 10,
        agent_id: Optional[int] = None,
        employee_id: Optional[int] = None,
        employee_context_id: Optional[int] = None,
        call_type: Optional[str] = None,
        mobile_status: Optional[str] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
    ):
        """Get phone-number history within the employee's permitted scope."""

        if page < 1:
            raise ValueError("page must be at least 1")

        if page_size not in {10, 20, 50, 100, 200, 500}:
            raise ValueError(
                "page_size must be one of 10, 20, 50, 100, 200, or 500"
            )

        query = CallLogService._get_query(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            employee_context_id=(
                agent_id
                if agent_id is not None
                else employee_context_id
            ),
            employee_id=employee_id,
            call_type=call_type,
            mobile_status=mobile_status,
            from_date=from_date,
            to_date=to_date,
        ).filter(
            CallLog.phone_number == phone_number.strip()
        )

        total_records = (
            query
            .order_by(None)
            .with_entities(func.count(CallLog.id))
            .scalar()
            or 0
        )

        rows = CallLogService._get_rows(
            query=query,
            offset=(page - 1) * page_size,
            limit=page_size,
        )

        return rows, total_records

    @staticmethod
    def create_call_log(
        db: Session,
        call_log_schema: CallLogsCreateSchema,
        employee_id: int,
    ):
        """Store a call event received through the existing Android API."""

        requested_context_id = getattr(
            call_log_schema,
            "employee_context_id",
            None,
        )

        #
        # if not employee_context:
        #     raise ValueError(
        #         "The employee context is not valid for the authenticated employee."
        #     )

        phone_id = getattr(call_log_schema, "phone_id", None)
        if not phone_id:
            raise ValueError(
                "The phone number is not found ."
            )
        employee_context_id = getattr(call_log_schema, "employee_context_id", None)
        if not employee_context_id:
            raise ValueError(
                "The employee context id is not found ."
            )

        # if phone_id is not None:
        #     phone = (
        #         db.query(PhoneNumber)
        #         .filter(
        #             PhoneNumber.id == phone_id,
        #             PhoneNumber.employee_id == employee.id,
        #             PhoneNumber.deleted_at.is_(None),
        #         )
        #         .first()
        #     )



        phone_number = getattr(call_log_schema, "phone_number", None)
        if not phone_number:
            raise ValueError("A phone number is required for a call log.")

        call_log = CallLog(
            phone_number=phone_number,
            call_type=call_log_schema.call_type,
            mobile_status=getattr(
                call_log_schema,
                "mobile_status",
                None,
            ),
            call_started_at=call_log_schema.call_started_at,
            call_ended_at=getattr(
                call_log_schema,
                "call_ended_at",
                None,
            ),
            duration_seconds=getattr(
                call_log_schema,
                "duration_seconds",
                None,
            ),
            attended_at=getattr(
                call_log_schema,
                "attended_at",
                None,
            ),
            phone_id=getattr(call_log_schema, "phone_id", None),
            employee_context_id=getattr(
                call_log_schema, "employee_context_id", None
            ),
        )

        try:
            db.add(call_log)
            db.commit()
            db.refresh(call_log)
        except SQLAlchemyError:
            db.rollback()
            logger.exception("Failed to create call log")
            raise

        return call_log
