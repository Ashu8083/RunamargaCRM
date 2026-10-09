# backend/app/services/CallManagement/call_assignment_service.py

from typing import Optional
from sqlalchemy import func
from sqlalchemy.orm import Session, Query
from app.core.access_control import AccessControl
from app.models.call_assignments import CallAssignment
from app.models.loan_applications import LoanApplication
from app.models.call_logs import CallLog
from app.models.employees import Employee



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
    ):
        assigned_to = (
            db.query(Employee)
            .filter(Employee.id == assigned_to_id)
            .first()
        )

        if not assigned_to:
            raise ValueError("Assigned employee not found")

        if not AccessControl.can_assign_call_to_employee(
            db=db,
            employee=employee,
            target_employee=assigned_to,
        ):
            raise PermissionError(
                "You are not allowed to assign calls to this employee."
            )

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

        assignment = CallAssignment(
            phone_number=phone_number,
            assigned_to_id=assigned_to_id,
            assigned_by_id=employee.id,
            status="received",
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
                "You are not allowed to exchange this assignment."
            )

        new_agent = (
            db.query(Employee)
            .filter(Employee.id == new_agent_id)
            .first()
        )

        if not new_agent:
            raise ValueError("Assigned employee not found")

        if not AccessControl.can_assign_call_to_employee(
            db=db,
            employee=employee,
            target_employee=new_agent,
        ):
            raise PermissionError(
                "You are not allowed to assign calls to this employee."
            )

        previous_agent_id = assignment.assigned_to_id

        previous_agent = None

        if previous_agent_id:
            previous_agent = (
                db.query(Employee)
                .filter(Employee.id == previous_agent_id)
                .first()
            )

        assignment.assigned_to_id = new_agent_id
        assignment.assigned_by_id = employee.id

        db.commit()
        db.refresh(assignment)

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
    ):
        """Get call assignments visible to the employee."""

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

        return (
            query
            .order_by(
                CallAssignment.created_at.desc(),
                CallAssignment.id.desc(),
            )
            .all()
        )

    @staticmethod
    def get_available_call_numbers(
        db: Session,
        employee: Employee,
    ):
        # ---------------------------------------------------------
        # Find phone numbers that have EXACTLY ONE call
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
        # Get the actual call belonging to those phone numbers
        # ---------------------------------------------------------

        query = (
            db.query(CallLog)
            .join(
                call_count_subquery,
                call_count_subquery.c.phone_number
                == CallLog.phone_number,
            )
            .filter(
                # The only call must be MISSED
                CallLog.mobile_status == "MISSED",
            )
        )

        # ---------------------------------------------------------
        # Apply centralized access-control scope
        # ---------------------------------------------------------

        query = CallAssignmentService.apply_scope(
            query=query,
            db=db,
            employee=employee,
        )

        # ---------------------------------------------------------
        # Exclude phone numbers already in loan applications
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
        # Get eligible calls
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
        # Build response
        # ---------------------------------------------------------

        data = []

        for call in call_logs:

            # -----------------------------------------------------
            # Number already exists in loan applications
            # -----------------------------------------------------

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