# backend/app/services/CallManagement/call_reassignment_audit_log_service.py

from datetime import datetime
from typing import Optional, List, Any

from sqlalchemy.orm import Session

from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.call_reassignment_audit_logs import CallReassignmentAuditLog
from app.services.auditl_log_service import AuditLogService


class CallReassignmentAuditLogService(
    AuditLogService[CallReassignmentAuditLog]
):

    @staticmethod
    def _get_employee_name(
        db: Session,
        employee_context_id: Optional[int],
    ) -> Optional[str]:

        if employee_context_id is None:
            return None

        result = (
            db.query(Employee.name)
            .join(
                EmployeeContext,
                EmployeeContext.employee_id == Employee.id,
            )
            .filter(
                EmployeeContext.id == employee_context_id,
            )
            .first()
        )

        return result[0] if result else None

    @staticmethod
    def log_audit_log(
        db: Session,
        action: Optional[str] = None,
        action_by: Optional[int] = None,
        action_on: Optional[int] = None,
        report_to: Optional[int] = None,
        from_assigned_to: Optional[int] = None,
        from_report_to: Optional[int] = None,
        to_assigned_to: Optional[int] = None,
        to_report_to: Optional[int] = None,
        date_and_time: Optional[datetime] = None,
        delete: Optional[datetime] = None,
        commit: bool = False,
        phone: Optional[str] = None,
        assigned_from_phone: Optional[str] = None,
        assigned_to_phone: Optional[str] = None,
    ) -> CallReassignmentAuditLog:
        """
        Create an audit record for a call reassignment.

        Employee-related IDs refer to EmployeeContext.id.
        Phone fields contain actual phone numbers.
        """

        if to_assigned_to is None and action_on is not None:
            to_assigned_to = action_on

        # Get the previous assignee's reporting context.
        if from_report_to is None and from_assigned_to is not None:
            from_ctx = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.id == from_assigned_to,
                    EmployeeContext.deleted_at.is_(None),
                )
                .first()
            )

            if from_ctx:
                from_report_to = from_ctx.reports_to_id

        # Get the new assignee's reporting context.
        if to_report_to is None and to_assigned_to is not None:
            to_ctx = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.id == to_assigned_to,
                    EmployeeContext.deleted_at.is_(None),
                )
                .first()
            )

            if to_ctx:
                to_report_to = to_ctx.reports_to_id

        log_entry = CallReassignmentAuditLog(
            action=action or "CALL_ASSIGNMENT_EXCHANGED",
            customer_phone=phone,
            reassigned_by_id=action_by,
            from_assigned_to_id=from_assigned_to,
            from_report_to_id=from_report_to,
            to_assigned_to_id=to_assigned_to,
            to_report_to_id=to_report_to,
            assigned_from_phone=assigned_from_phone,
            assigned_to_phone=assigned_to_phone,
            date_and_time=date_and_time or datetime.now(),
            deleted_at=delete,
        )

        db.add(log_entry)

        if commit:
            db.commit()
            db.refresh(log_entry)

        return log_entry

    @staticmethod
    def get_audit_logs(
        db: Session,
        employee: Employee,
        skip: int = 0,
        limit: int = 100,
        action: Optional[str] = None,
        action_by: Optional[int] = None,
        action_on: Optional[int] = None,
        report_to: Optional[int] = None,
        from_assigned_to: Optional[int] = None,
        to_assigned_to: Optional[int] = None,
    ) -> List[Any]:
        """
        Retrieve audit logs with employee names instead of displaying IDs.
        """

        # Build the query.
        query = db.query(CallReassignmentAuditLog)

        # Apply optional filters.
        if action:
            query = query.filter(
                CallReassignmentAuditLog.action == action
            )

        if action_by is not None:
            query = query.filter(
                CallReassignmentAuditLog.reassigned_by_id == action_by
            )

        if action_on is not None:
            query = query.filter(
                CallReassignmentAuditLog.to_assigned_to_id == action_on
            )

        if report_to is not None:
            query = query.filter(
                CallReassignmentAuditLog.to_report_to_id == report_to
            )

        if from_assigned_to is not None:
            query = query.filter(
                CallReassignmentAuditLog.from_assigned_to_id
                == from_assigned_to
            )

        if to_assigned_to is not None:
            query = query.filter(
                CallReassignmentAuditLog.to_assigned_to_id
                == to_assigned_to
            )

        logs = (
            query.order_by(
                CallReassignmentAuditLog.date_and_time.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

        results = []

        for log in logs:
            results.append({
                "id": log.id,
                "action": log.action,
                "customer_phone": log.customer_phone,

                # Employee who performed the reassignment.
                "reassigned_by_id": log.reassigned_by_id,
                "reassigned_by_name": (
                    CallReassignmentAuditLogService._get_employee_name(
                        db,
                        log.reassigned_by_id,
                    )
                ),

                # Previous RM.
                "from_assigned_to_id": log.from_assigned_to_id,
                "from_assigned_to_name": (
                    CallReassignmentAuditLogService._get_employee_name(
                        db,
                        log.from_assigned_to_id,
                    )
                ),
                "assigned_from_phone": log.assigned_from_phone,

                # Previous RM's reporting employee.
                "from_report_to_id": log.from_report_to_id,
                "from_report_to_name": (
                    CallReassignmentAuditLogService._get_employee_name(
                        db,
                        log.from_report_to_id,
                    )
                ),

                # New RM.
                "to_assigned_to_id": log.to_assigned_to_id,
                "to_assigned_to_name": (
                    CallReassignmentAuditLogService._get_employee_name(
                        db,
                        log.to_assigned_to_id,
                    )
                ),
                "assigned_to_phone": log.assigned_to_phone,

                # New RM's reporting employee.
                "to_report_to_id": log.to_report_to_id,
                "to_report_to_name": (
                    CallReassignmentAuditLogService._get_employee_name(
                        db,
                        log.to_report_to_id,
                    )
                ),

                "date_and_time": log.date_and_time,
                "deleted_at": log.deleted_at,
            })

        return results


# Helper function alias.
log_call_reassignment_action = (
    CallReassignmentAuditLogService.log_audit_log
)