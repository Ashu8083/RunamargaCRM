# backend/app/services/CallManagement/call_assignment_service.py

from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, Query
from app.core.access_control import AccessControl
from app.models.call_assignments import CallAssignment, StatusEnum
from app.models.loan_applications import LoanApplication
from app.models.call_logs import CallLog
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.services.CallManagement.call_reassignment_audit_log_service import (
    CallReassignmentAuditLogService,
)
from app.models.phone_numbers import PhoneNumber


class CallAssignmentService:

    @staticmethod
    def apply_scope(
        query: Query,
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Query:
        """Apply employee access scope to CallAssignment records."""

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
                CallAssignment.assigned_to_id == employee_context.id
            )

        if family == "TEAMLEAD":
            rms = AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=context_id,
            )
            
            print("DEBUG rms:", rms)
            print("DEBUG rms types:", [type(rm) for rm in rms])
            rm_context_ids = [rm.id for rm in rms]

            if not rm_context_ids:
                return query.filter(False)

            return query.filter(
                CallAssignment.assigned_to_id.in_(rm_context_ids)
            )

        return query.filter(False)
    

    @staticmethod
    def create(
        db: Session,
        employee: Employee,
        phone_number: str,
        assigned_to_id: int,
        context_id: Optional[int] = None,
    ):
        # ---------------------------------------------------------
        # GET THE CALLER'S ACTIVE EMPLOYEE CONTEXT
        # ---------------------------------------------------------

        current_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not current_context or not current_context.context:
            raise ValueError("Active employee context not found")

        # ---------------------------------------------------------
        # GET THE RECIPIENT EMPLOYEE CONTEXT
        # ---------------------------------------------------------

        assigned_to = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id == assigned_to_id,
                EmployeeContext.is_active.is_(True),
                EmployeeContext.deleted_at.is_(None),
            )
            .first()
        )

        if not assigned_to:
            raise ValueError("Assigned employee context not found")

        # ---------------------------------------------------------
        # CHECK ASSIGNMENT PERMISSION
        # ---------------------------------------------------------

        if not AccessControl.has_permission(
            db=db,
            employee=employee,
            permission="calls:number:assign",
        ):
            raise PermissionError(
                "You are not allowed to assign calls."
            )

        # GLOBAL and MANAGER may assign to visible contexts.
        # Other roles must only assign within their allowed hierarchy.
        current_family = AccessControl.get_context_family(
            current_context.context.code
        )

        if current_family not in {"GLOBAL", "MANAGER"}:
            visible_rms = AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=context_id,
            )

            visible_rm_context_ids = {
                rm.id for rm in visible_rms
            }

            if current_family == "RM":
                allowed = assigned_to.id == current_context.id
            else:
                allowed = assigned_to.id in visible_rm_context_ids

            if not allowed:
                raise PermissionError(
                    "You are not allowed to assign calls to this context."
                )

        # ---------------------------------------------------------
        # PREVENT DUPLICATE ACTIVE ASSIGNMENTS
        # ---------------------------------------------------------

        existing_assignment = (
            db.query(CallAssignment)
            .filter(
                CallAssignment.phone_number == phone_number,
                CallAssignment.deleted_at.is_(None),
                CallAssignment.assigned_to_id.isnot(None),
            )
            .first()
        )

        if existing_assignment:
            raise ValueError(
                "This phone number is already assigned."
            )

        # ---------------------------------------------------------
        # CREATE ASSIGNMENT
        # ---------------------------------------------------------

        assignment = CallAssignment(
            phone_number=phone_number,
            assigned_to_id=assigned_to.id,
            assigned_by_id=current_context.id,
            status="missed",
        )

        db.add(assignment)
        db.commit()
        db.refresh(assignment)

        return assignment


    @staticmethod
    def exchange(
        db: Session,
        employee: Employee,
        assignment_id: int,
        new_agent_id: int,
        context_id: int | None = None,
    ):
        # --------------------------------------------------
        # 1. Get the caller's active EmployeeContext
        # --------------------------------------------------
        current_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not current_context:
            raise ValueError("Active employee context not found.")

        # --------------------------------------------------
        # 2. Find the assignment within the caller's scope
        # --------------------------------------------------
        assignment_query = db.query(CallAssignment).filter(
            CallAssignment.id == assignment_id,
            CallAssignment.deleted_at.is_(None),
        )

        assignment_query = CallAssignmentService.apply_scope(
            assignment_query,
            db=db,
            employee=employee,
            context_id=current_context.id,
        )

        assignment = assignment_query.first()

        if not assignment:
            raise ValueError(
                "Call assignment not found or you do not have access to it."
            )

        # --------------------------------------------------
        # 3. Find the new recipient EmployeeContext
        # --------------------------------------------------
        new_agent = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id == new_agent_id,
                EmployeeContext.is_active.is_(True),
                EmployeeContext.deleted_at.is_(None),
            )
            .first()
        )

        if not new_agent:
            raise ValueError("Target employee context not found or inactive.")

        # --------------------------------------------------
        # 4. Check assignment permission
        # --------------------------------------------------
        if not AccessControl.has_permission(
            db=db,
            employee=employee,
            permission="calls:number:assign",
        ):
            raise PermissionError(
                "You do not have permission to assign call numbers."
            )

        # --------------------------------------------------
        # 5. Validate the target against the caller's context
        # --------------------------------------------------
        current_family = AccessControl.get_context_family(
            current_context.context.code
        )

        if current_family in {"GLOBAL", "MANAGER"}:
            # Global and manager contexts can assign according
            # to their existing application permissions.
            pass

        elif current_family == "RM":
            # An RM can only assign to their own active context.
            if new_agent.id != current_context.id:
                raise PermissionError(
                    "An RM can only assign calls to their own context."
                )

        elif current_family in {"AGENT", "TEAMLEAD"}:
            # Restrict the target to visible RM contexts.
            visible_rms = AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=current_context.id,
            )

            visible_rm_context_ids = {
                rm.id for rm in visible_rms
            }

            if new_agent.id not in visible_rm_context_ids:
                raise PermissionError(
                    "You are not allowed to assign calls to this context."
                )

        else:
            raise PermissionError(
                "Your active context is not allowed to exchange assignments."
            )

        # --------------------------------------------------
        # 6. Get the previous assignee and their phone number
        # --------------------------------------------------

        previous_agent = None
        from_phone_record = None

        if assignment.assigned_to_id is not None:
            previous_agent = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.id == assignment.assigned_to_id
                )
                .first()
            )

        if previous_agent:
            from_phone_record = (
                db.query(PhoneNumber)
                .filter(
                    PhoneNumber.employee_id == previous_agent.employee_id,
                    PhoneNumber.deleted_at.is_(None),
                )
                .first()
            )

        # --------------------------------------------------
        # 7. Get the new assignee's phone number
        # --------------------------------------------------

        to_phone_record = (
            db.query(PhoneNumber)
            .filter(
                PhoneNumber.employee_id == new_agent.employee_id,
                PhoneNumber.deleted_at.is_(None),
            )
            .first()
        )
        # --------------------------------------------------
        # 7. Create the reassignment audit log
        # --------------------------------------------------

        CallReassignmentAuditLogService.log_audit_log(
            db=db,
            action="CALL_ASSIGNMENT_EXCHANGED",
            action_by=current_context.id,
            action_on=new_agent.id,

            from_assigned_to=previous_agent.id if previous_agent else None,
            from_report_to=(
                previous_agent.reports_to_id
                if previous_agent
                else None
            ),

            to_assigned_to=new_agent.id,
            to_report_to=new_agent.reports_to_id,

            phone=assignment.phone_number,

            assigned_from_phone=(
                from_phone_record.phone
                if from_phone_record
                else None
            ),
            assigned_to_phone=(
                to_phone_record.phone
                if to_phone_record
                else None
            ),

            commit=False,
        )
        # --------------------------------------------------
        # 8. Update assignment using EmployeeContext IDs
        # --------------------------------------------------
        assignment.assigned_to_id = new_agent.id
        assignment.assigned_by_id = current_context.id

        # --------------------------------------------------
        # 9. Save changes
        # --------------------------------------------------
        try:
            db.commit()
            db.refresh(assignment)
        except Exception:
            db.rollback()
            raise

        return assignment, previous_agent


    @staticmethod
    def delete(
        db: Session,
        employee: Employee,
        assignment_id: int,
    ):
        assignment = (
            db.query(CallAssignment)
            .filter(
                CallAssignment.id == assignment_id,
                CallAssignment.deleted_at.is_(None),
            )
            .first()
        )

        if not assignment:
            raise ValueError("Call assignment not found")

        visible_assignment = (
            CallAssignmentService.apply_scope(
                query=db.query(CallAssignment).filter(
                    CallAssignment.id == assignment_id,
                    CallAssignment.deleted_at.is_(None),
                ),
                db=db,
                employee=employee,
            )
            .first()
        )

        if not visible_assignment:
            raise PermissionError(
                "You are not allowed to delete this assignment."
            )

        from datetime import datetime

        now = datetime.utcnow()

        assignment.deleted_at = now
        assignment.updated_at = now

        db.commit()
        db.refresh(assignment)

        return assignment

    @staticmethod
    def get_all(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
        status: Optional[str] = None,
        rm: Optional[str] = None,
        date_filter: Optional[str] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ):
        """Get one filtered page of call assignments visible to the employee."""

        if page < 1:
            raise ValueError("page must be greater than or equal to 1")

        if page_size not in {10, 25, 50, 100}:
            raise ValueError(
                "page_size must be one of 10, 25, 50, or 100"
            )

        query = (
            db.query(CallAssignment)
            .filter(
                CallAssignment.deleted_at.is_(None)
            )
        )

        query = CallAssignmentService.apply_scope(
            query=query,
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if search and search.strip():
            search_value = f"%{search.strip()}%"

            query = (
                query
                .outerjoin(CallAssignment.assigned_to)
                .outerjoin(EmployeeContext.employee)
                .filter(
                    or_(
                        CallAssignment.phone_number.ilike(
                            search_value
                        ),
                        Employee.name.ilike(search_value),
                    )
                )
            )

        if status and status.strip():
            normalized_status = status.strip().lower()

            if normalized_status in {
                item.value for item in StatusEnum
            }:
                query = query.filter(
                    CallAssignment.status == StatusEnum(
                        normalized_status
                    )
                )
            else:
                query = query.filter(False)

        if rm and str(rm).strip():
            try:
                rm_id = int(str(rm).strip())
            except (TypeError, ValueError):
                query = query.filter(False)
            else:
                query = query.filter(
                    CallAssignment.assigned_to_id == rm_id
                )

        date_range = None
        normalized_date_filter = (
            date_filter.strip().lower()
            if date_filter
            else ""
        )

        if normalized_date_filter != "custom":
            today = datetime.now().replace(
                hour=0,
                minute=0,
                second=0,
                microsecond=0,
            )

            if normalized_date_filter == "today":
                date_range = (today, today + timedelta(days=1))

            elif normalized_date_filter == "yesterday":
                start = today - timedelta(days=1)
                date_range = (start, today)

            elif normalized_date_filter == "this-week":
                start = today - timedelta(days=today.weekday())
                date_range = (start, today + timedelta(days=1))

            elif normalized_date_filter == "last-week":
                start = today - timedelta(days=today.weekday() + 7)
                date_range = (
                    start,
                    start + timedelta(days=7),
                )

            elif normalized_date_filter == "this-month":
                start = today.replace(day=1)
                date_range = (start, today + timedelta(days=1))

            elif normalized_date_filter == "last-month":
                end = today.replace(day=1)
                start = (end - timedelta(days=1)).replace(day=1)
                date_range = (start, end)

        else:
            start = None
            end = None

            if from_date:
                try:
                    start = datetime.strptime(
                        from_date,
                        "%Y-%m-%d",
                    )
                except ValueError:
                    raise ValueError(
                        "fromDate must use YYYY-MM-DD format"
                    )

            if to_date:
                try:
                    end = datetime.strptime(
                        to_date,
                        "%Y-%m-%d",
                    ) + timedelta(days=1)
                except ValueError:
                    raise ValueError(
                        "toDate must use YYYY-MM-DD format"
                    )

            if start or end:
                date_range = (start, end)

        if date_range:
            start, end = date_range

            if start:
                query = query.filter(
                    CallAssignment.created_at >= start
                )

            if end:
                query = query.filter(
                    CallAssignment.created_at < end
                )

        total = query.order_by(None).count()

        assignments = (
            query
            .order_by(
                CallAssignment.created_at.desc(),
                CallAssignment.id.desc(),
            )
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return assignments, total

    @staticmethod
    def get_available_call_numbers(
        db: Session,
        employee: Employee,
    ):
        """
        Return eligible missed-call numbers that have not already
        been assigned to an employee.
        """

        # ---------------------------------------------------------
        # 1. Find phone numbers having exactly one call
        # ---------------------------------------------------------

        call_count_subquery = (
            db.query(
                CallLog.phone_number.label("phone_number"),
                func.count(CallLog.id).label("call_count"),
            )
            .filter(
                CallLog.phone_number.isnot(None),
            )
            .group_by(
                CallLog.phone_number,
            )
            .having(
                func.count(CallLog.id) == 1,
            )
            .subquery()
        )

        # ---------------------------------------------------------
        # 2. Find numbers that are already assigned
        # ---------------------------------------------------------

        assigned_numbers_subquery = (
            db.query(
                CallAssignment.phone_number,
            )
            .filter(
                CallAssignment.deleted_at.is_(None),
                CallAssignment.assigned_to_id.isnot(None),
            )
            .distinct()
            .subquery()
        )

        # ---------------------------------------------------------
        # 3. Get eligible missed calls and exclude assigned numbers
        # ---------------------------------------------------------

        query = (
            db.query(CallLog)
            .join(
                call_count_subquery,
                call_count_subquery.c.phone_number
                == CallLog.phone_number,
            )
            .filter(
                CallLog.mobile_status == "MISSED",
                CallLog.phone_number.isnot(None),
                ~CallLog.phone_number.in_(
                    db.query(
                        assigned_numbers_subquery.c.phone_number
                    )
                ),
            )
        )

        # ---------------------------------------------------------
        # 4. Exclude numbers already present in loan applications
        # ---------------------------------------------------------

        application_numbers = (
            db.query(LoanApplication.phone)
            .filter(
                LoanApplication.phone.isnot(None),
            )
            .distinct()
            .all()
        )

        application_numbers = {
            row[0]
            for row in application_numbers
        }

        # ---------------------------------------------------------
        # 5. Retrieve available calls in chronological order
        # ---------------------------------------------------------

        call_logs = (
            query
            .order_by(
                CallLog.call_started_at.asc(),
                CallLog.id.asc(),
            )
            .all()
        )

        # ---------------------------------------------------------
        # 6. Build the response
        # ---------------------------------------------------------

        data = []

        for call in call_logs:

            if call.phone_number in application_numbers:
                continue

            data.append({
                "id": call.id,
                "phone_number": call.phone_number,

                "call_type": (
                    call.call_type.value
                    if call.call_type
                    else None
                ),

                "mobile_status": (
                    call.mobile_status.value
                    if call.mobile_status
                    else None
                ),

                "call_started_at": call.call_started_at,
                "call_ended_at": call.call_ended_at,
                "duration_seconds": call.duration_seconds,

                "employee_context_id": call.employee_context_id,

                "employee_name": (
                    call.employee_context.employee.name
                    if call.employee_context
                    and call.employee_context.employee
                    else None
                ),
            })

        return {
            "success": True,
            "data": data,
        }
