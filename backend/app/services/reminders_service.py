# backend/app/services/reminders_service.py

from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import or_, text
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication
from app.models.reminders import Reminder
from app.schemas.reminders_schema import (
    ReminderCreateSchema,
    ReminderListResponseSchema,
    ReminderNotificationListSchema,
    ReminderNotificationSchema,
    ReminderResponseSchema,
)


VALID_STATUSES = {
    "pending",
    "completed",
    "cancelled",
}


class ReminderService:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    # ============================================================
    # INTERNAL - PUBLISH REMINDER EVENT
    # ============================================================

    def _publish_reminder_event(
        self,
        reminder: Reminder,
        event_type: str,
    ) -> None:

        payload = (
            f'{{"type":"{event_type}",'
            f'"data":{{'
            f'"id":{reminder.id},'
            f'"employee_id":{reminder.employee_id},'
            f'"application_id":{reminder.application_id},'
            f'"reminder_at":"{reminder.reminder_at.isoformat()}",'
            f'"note":{__import__("json").dumps(reminder.note)},'
            f'"status":"{reminder.status}"'
            f'}}}}'
        )

        self.db.execute(
            text(
                "SELECT pg_notify(:channel, :payload)"
            ),
            {
                "channel": "reminder_events",
                "payload": payload,
            },
        )

    # ============================================================
    # CREATE REMINDER
    # ============================================================

    def create_reminder(
        self,
        employee_id: int,
        data: ReminderCreateSchema,
    ):

        application = (
            self.db.query(LoanApplication)
            .filter(
                LoanApplication.id
                == data.application_id,
            )
            .first()
        )

        if not application:

            raise HTTPException(
                status_code=404,
                detail="Application not found",
            )

        reminder = Reminder(
            employee_id=employee_id,
            application_id=data.application_id,
            reminder_at=data.reminder_at,
            note=data.note,
            status="pending",
        )

        try:

            self.db.add(reminder)

            self.db.flush()

            self._publish_reminder_event(
                reminder,
                "REMINDER_CREATED",
            )

            self.db.commit()

            self.db.refresh(reminder)

            return ReminderResponseSchema.model_validate(
                reminder
            )

        except Exception:

            self.db.rollback()

            raise

    # ============================================================
    # EXISTING - GET REMINDERS
    # ============================================================
    #
    # DO NOT CHANGE.
    #
    # Existing reminder drawer depends on this method.
    # ============================================================

    def get_reminders(
        self,
        employee_id: int,
    ):

        reminders = (
            self.db.query(Reminder)
            .filter(
                Reminder.employee_id
                == employee_id,

                Reminder.deleted_at.is_(None),
            )
            .order_by(
                Reminder.reminder_at.asc()
            )
            .all()
        )

        return ReminderListResponseSchema(
            items=[
                ReminderResponseSchema.model_validate(
                    reminder
                )
                for reminder in reminders
            ],
            total=len(reminders),
        )

    # ============================================================
    # ACCESS CONTROL - ACTIVE CONTEXT
    # ============================================================

    @staticmethod
    def _get_active_context(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Optional[EmployeeContext]:

        return AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

    # ============================================================
    # ACCESS CONTROL - CONTEXT FAMILY
    # ============================================================

    @staticmethod
    def _get_context_family(
        context: Optional[EmployeeContext],
    ) -> Optional[str]:

        if not context:
            return None

        if not context.context:
            return None

        return AccessControl.get_context_family(
            context.context.code
        )

    # ============================================================
    # GET CONTEXT IDS
    # ============================================================

    @staticmethod
    def _get_context_ids(
        contexts: list[EmployeeContext],
    ) -> list[int]:

        return [
            int(context.id)
            for context in (contexts or [])
            if context is not None
            and context.id is not None
        ]

    # ============================================================
    # GET VISIBLE RM CONTEXT IDS
    # ============================================================

    @staticmethod
    def _get_visible_rm_context_ids(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[int]:

        contexts = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

        return ReminderService._get_context_ids(
            contexts
        )

    # ============================================================
    # GET VISIBLE AGENT CONTEXT IDS
    # ============================================================

    @staticmethod
    def _get_visible_agent_context_ids(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[int]:

        contexts = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

        return ReminderService._get_context_ids(
            contexts
        )

    # ============================================================
    # GET APPLICATION CONTEXT IDS
    # ============================================================

    @staticmethod
    def _get_application_context_ids(
        db: Session,
        employee: Employee,
        active_context: EmployeeContext,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> tuple[list[int], list[int]]:
        """
        Resolve the RM and Agent EmployeeContext IDs whose
        applications are visible to the authenticated employee.

        The returned IDs are compared directly against:

            LoanApplication.rm_context_id
            LoanApplication.agent_context_id
        """

        context_family = (
            ReminderService._get_context_family(
                active_context
            )
        )

        # --------------------------------------------------------
        # GLOBAL / MANAGER
        #
        # AccessControl already returns all visible RMs and Agents.
        # --------------------------------------------------------

        if context_family in {
            "GLOBAL",
            "MANAGER",
        }:

            rm_context_ids = (
                ReminderService
                ._get_visible_rm_context_ids(
                    db=db,
                    employee=employee,
                    context_id=context_id,
                    team_lead_context_id=team_lead_context_id,
                )
            )

            agent_context_ids = (
                ReminderService
                ._get_visible_agent_context_ids(
                    db=db,
                    employee=employee,
                    context_id=context_id,
                    team_lead_context_id=team_lead_context_id,
                )
            )

            return (
                rm_context_ids,
                agent_context_ids,
            )

        # --------------------------------------------------------
        # TEAM LEAD
        #
        # AccessControl returns:
        #
        #   RM contexts reporting to this Team Lead
        #   Agent contexts reporting to this Team Lead
        # --------------------------------------------------------

        if context_family == "TEAMLEAD":

            rm_context_ids = (
                ReminderService
                ._get_visible_rm_context_ids(
                    db=db,
                    employee=employee,
                    context_id=context_id,
                    team_lead_context_id=team_lead_context_id,
                )
            )

            agent_context_ids = (
                ReminderService
                ._get_visible_agent_context_ids(
                    db=db,
                    employee=employee,
                    context_id=context_id,
                    team_lead_context_id=team_lead_context_id,
                )
            )

            return (
                rm_context_ids,
                agent_context_ids,
            )

        # --------------------------------------------------------
        # RM
        #
        # AccessControl.get_visible_agents() gives the Agents
        # reporting to this RM.
        #
        # The RM's own EmployeeContext must also be included,
        # because applications can have:
        #
        #     rm_context_id = current RM context
        #
        # --------------------------------------------------------

        if context_family == "RM":

            rm_context_ids = []

            if active_context.id is not None:

                rm_context_ids.append(
                    int(active_context.id)
                )

            agent_context_ids = (
                ReminderService
                ._get_visible_agent_context_ids(
                    db=db,
                    employee=employee,
                    context_id=context_id,
                    team_lead_context_id=team_lead_context_id,
                )
            )

            return (
                rm_context_ids,
                agent_context_ids,
            )

        # --------------------------------------------------------
        # AGENT
        #
        # AccessControl.get_visible_agents() intentionally
        # returns no subordinate Agents.
        #
        # For reminders, however, the Agent must be able to
        # see applications assigned to their own Agent context.
        # --------------------------------------------------------

        if context_family == "AGENT":

            agent_context_ids = []

            if active_context.id is not None:

                agent_context_ids.append(
                    int(active_context.id)
                )

            return (
                [],
                agent_context_ids,
            )

        # --------------------------------------------------------
        # UNKNOWN
        # --------------------------------------------------------

        return (
            [],
            [],
        )

    # ============================================================
    # GET VISIBLE APPLICATION CONTEXTS
    # ============================================================

    @staticmethod
    def _get_visible_application_contexts(
        db: Session,
        employee: Employee,
        active_context: EmployeeContext,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> tuple[list[int], list[int]]:

        return ReminderService._get_application_context_ids(
            db=db,
            employee=employee,
            active_context=active_context,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

    # ============================================================
    # GET SELECTED EMPLOYEE CONTEXT
    # ============================================================

    @staticmethod
    def _get_employee_context_ids(
        db: Session,
        employee_id: int,
    ) -> tuple[list[int], list[int]]:

        employee_contexts = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.employee_id
                == employee_id,

                EmployeeContext.is_active.is_(True),
            )
            .all()
        )

        rm_context_ids = []

        agent_context_ids = []

        for employee_context in employee_contexts:

            if not employee_context.context:
                continue

            family = (
                AccessControl.get_context_family(
                    employee_context.context.code
                )
            )

            if employee_context.id is None:
                continue

            if family == "RM":

                rm_context_ids.append(
                    int(employee_context.id)
                )

            elif family == "AGENT":

                agent_context_ids.append(
                    int(employee_context.id)
                )

        return (
            rm_context_ids,
            agent_context_ids,
        )

    # ============================================================
    # REMINDER MANAGEMENT
    # ============================================================

    def get_reminders_management(
        self,
        employee: Employee,
        page: int = 1,
        page_size: int = 25,
        search: Optional[str] = None,
        employee_id: Optional[int] = None,
        status: Optional[str] = None,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ):

        # ========================================================
        # AUTHENTICATION
        # ========================================================

        if not employee:

            raise PermissionError(
                "Authenticated employee is required."
            )

        # ========================================================
        # PAGINATION NORMALIZATION
        # ========================================================

        page = max(
            page,
            1,
        )

        page_size = min(
            max(
                page_size,
                1,
            ),
            100,
        )

        # ========================================================
        # ACTIVE CONTEXT
        # ========================================================

        active_context = (
            ReminderService._get_active_context(
                db=self.db,
                employee=employee,
                context_id=context_id,
            )
        )

        if not active_context:

            raise PermissionError(
                "No active EmployeeContext found for the authenticated employee."
            )

        # ========================================================
        # CONTEXT FAMILY
        # ========================================================

        context_family = (
            ReminderService._get_context_family(
                active_context
            )
        )

        if not context_family:

            raise PermissionError(
                "Unable to determine employee context family."
            )

        # ========================================================
        # VISIBLE APPLICATION CONTEXTS
        # ========================================================

        (
            visible_rm_context_ids,
            visible_agent_context_ids,
        ) = (
            ReminderService
            ._get_visible_application_contexts(
                db=self.db,
                employee=employee,
                active_context=active_context,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        # ========================================================
        # SELECTED EMPLOYEE FILTER
        # ========================================================
        #
        # If EmployeeDropdown is used:
        #
        #   selected employee
        #       ↓
        #   EmployeeContext
        #       ↓
        #   RM / Agent context
        #       ↓
        #   LoanApplication.rm_context_id
        #   LoanApplication.agent_context_id
        #
        # This means the employee filter also follows hierarchy.
        # ========================================================

        if employee_id is not None:

            (
                selected_rm_context_ids,
                selected_agent_context_ids,
            ) = (
                ReminderService
                ._get_employee_context_ids(
                    db=self.db,
                    employee_id=employee_id,
                )
            )

            # ----------------------------------------------------
            # Security:
            #
            # Selected employee's contexts must already be within
            # the authenticated employee's visible hierarchy.
            # ----------------------------------------------------

            visible_rm_set = set(
                visible_rm_context_ids
            )

            visible_agent_set = set(
                visible_agent_context_ids
            )

            selected_rm_context_ids = [
                context_value
                for context_value
                in selected_rm_context_ids
                if context_value
                in visible_rm_set
            ]

            selected_agent_context_ids = [
                context_value
                for context_value
                in selected_agent_context_ids
                if context_value
                in visible_agent_set
            ]

            # ----------------------------------------------------
            # If the selected employee has no visible context,
            # return an empty result.
            # ----------------------------------------------------

            if (
                not selected_rm_context_ids
                and not selected_agent_context_ids
            ):

                return {
                    "items": [],
                    "pagination": {
                        "page": page,
                        "page_size": page_size,
                        "total": 0,
                        "total_pages": 0,
                        "has_next": False,
                        "has_previous": page > 1,
                    },
                }

            visible_rm_context_ids = (
                selected_rm_context_ids
            )

            visible_agent_context_ids = (
                selected_agent_context_ids
            )

        # ========================================================
        # NO APPLICATION SCOPE
        # ========================================================

        if (
            not visible_rm_context_ids
            and not visible_agent_context_ids
        ):

            return {
                "items": [],
                "pagination": {
                    "page": page,
                    "page_size": page_size,
                    "total": 0,
                    "total_pages": 0,
                    "has_next": False,
                    "has_previous": page > 1,
                },
            }

        # ========================================================
        # BASE QUERY
        # ========================================================
        #
        # IMPORTANT:
        #
        # Reminder ownership is NOT used to determine hierarchy.
        #
        # The hierarchy comes from:
        #
        #     LoanApplication.rm_context_id
        #     LoanApplication.agent_context_id
        #
        # The Reminder is connected to the application using:
        #
        #     Reminder.application_id
        #
        # ========================================================

        query = (
            self.db.query(
                Reminder,
                LoanApplication,
                Employee,
            )
            .join(
                LoanApplication,
                LoanApplication.id
                == Reminder.application_id,
            )
            .join(
                Employee,
                Employee.id
                == Reminder.employee_id,
            )
            .filter(
                Reminder.deleted_at.is_(None),
                LoanApplication.deleted_at.is_(None),
            )
        )

        # ========================================================
        # APPLICATION HIERARCHY FILTER
        # ========================================================

        hierarchy_conditions = []

        if visible_rm_context_ids:

            hierarchy_conditions.append(
                LoanApplication.rm_context_id.in_(
                    visible_rm_context_ids
                )
            )

        if visible_agent_context_ids:

            hierarchy_conditions.append(
                LoanApplication.agent_context_id.in_(
                    visible_agent_context_ids
                )
            )

        if not hierarchy_conditions:

            return {
                "items": [],
                "pagination": {
                    "page": page,
                    "page_size": page_size,
                    "total": 0,
                    "total_pages": 0,
                    "has_next": False,
                    "has_previous": page > 1,
                },
            }

        query = query.filter(
            or_(
                *hierarchy_conditions
            )
        )

        # ========================================================
        # STATUS FILTER
        # ========================================================

        if status:

            normalized_status = (
                status.strip().lower()
            )

            if normalized_status not in VALID_STATUSES:

                raise HTTPException(
                    status_code=422,
                    detail=(
                        "Status must be "
                        "'pending', "
                        "'completed' or "
                        "'cancelled'"
                    ),
                )

            query = query.filter(
                Reminder.status
                == normalized_status,
            )

        # ========================================================
        # SERVER-SIDE SEARCH
        # ========================================================

        if search:

            search_value = search.strip()

            if search_value:

                search_pattern = (
                    f"%{search_value}%"
                )

                conditions = [

                    # ------------------------------------------------
                    # Reminder note
                    # ------------------------------------------------

                    Reminder.note.ilike(
                        search_pattern
                    ),

                    # ------------------------------------------------
                    # Application number
                    # ------------------------------------------------

                    LoanApplication.unique_id.ilike(
                        search_pattern
                    ),

                    # ------------------------------------------------
                    # Application name
                    # ------------------------------------------------

                    LoanApplication.name.ilike(
                        search_pattern
                    ),

                    # ------------------------------------------------
                    # Application phone
                    # ------------------------------------------------

                    LoanApplication.phone.ilike(
                        search_pattern
                    ),

                    # ------------------------------------------------
                    # Employee name
                    # ------------------------------------------------

                    Employee.name.ilike(
                        search_pattern
                    ),

                    # ------------------------------------------------
                    # Employee code
                    # ------------------------------------------------

                    Employee.employee_code.ilike(
                        search_pattern
                    ),

                    # ------------------------------------------------
                    # Employee phone
                    # ------------------------------------------------

                    Employee.phone.ilike(
                        search_pattern
                    ),
                ]

                # ----------------------------------------------------
                # NUMERIC SEARCH
                # ----------------------------------------------------

                if search_value.isdigit():

                    numeric_value = int(
                        search_value
                    )

                    conditions.extend(
                        [

                            Reminder.id
                            == numeric_value,

                            LoanApplication.id
                            == numeric_value,

                            Employee.id
                            == numeric_value,

                        ]
                    )

                query = query.filter(
                    or_(*conditions)
                )

        # ========================================================
        # TOTAL
        # ========================================================

        total = query.count()

        # ========================================================
        # PAGINATION
        # ========================================================

        offset = (
            page - 1
        ) * page_size

        rows = (
            query
            .order_by(
                Reminder.created_at.desc(),
                Reminder.id.desc(),
            )
            .offset(offset)
            .limit(page_size)
            .all()
        )

        # ========================================================
        # RESPONSE
        # ========================================================

        items = []

        for (
            reminder,
            application,
            reminder_employee,
        ) in rows:

            items.append(
                {
                    "id": reminder.id,

                    "employee": {
                        "id": (
                            reminder_employee.id
                        ),

                        "name": (
                            reminder_employee.name
                        ),

                        "employee_code": (
                            reminder_employee.employee_code
                        ),

                        "phone": (
                            reminder_employee.phone
                        ),
                    },

                    "application": {
                        "id": application.id,

                        "unique_id": (
                            application.unique_id
                        ),

                        "name": (
                            application.name
                        ),

                        "phone": (
                            application.phone
                        ),
                    },

                    "reminder_at": (
                        reminder.reminder_at
                    ),

                    "note": (
                        reminder.note
                    ),

                    "status": (
                        reminder.status
                    ),

                    "completed_at": (
                        reminder.completed_at
                    ),

                    "created_at": (
                        reminder.created_at
                    ),

                    "updated_at": (
                        reminder.updated_at
                    ),
                }
            )

        # ========================================================
        # PAGINATION METADATA
        # ========================================================

        total_pages = (
            (
                total
                + page_size
                - 1
            )
            // page_size
            if total
            else 0
        )

        return {
            "items": items,

            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": total_pages,
                "has_next": (
                    page < total_pages
                ),
                "has_previous": (
                    page > 1
                ),
            },
        }

    # ============================================================
    # GET SINGLE REMINDER
    # ============================================================

    def get_reminder(
        self,
        reminder_id: int,
        employee_id: int,
    ):

        reminder = (
            self.db.query(Reminder)
            .filter(
                Reminder.id
                == reminder_id,

                Reminder.employee_id
                == employee_id,

                Reminder.deleted_at.is_(None),
            )
            .first()
        )

        if not reminder:

            raise HTTPException(
                status_code=404,
                detail="Reminder not found",
            )

        return ReminderResponseSchema.model_validate(
            reminder
        )

    # ============================================================
    # UPDATE REMINDER STATUS
    # ============================================================

    def update_reminder_status(
        self,
        reminder_id: int,
        employee_id: int,
        status: str,
    ):

        if status not in {
            "completed",
            "cancelled",
        }:

            raise HTTPException(
                status_code=422,
                detail=(
                    "Status must be "
                    "completed or cancelled"
                ),
            )

        reminder = (
            self.db.query(Reminder)
            .filter(
                Reminder.id
                == reminder_id,

                Reminder.employee_id
                == employee_id,

                Reminder.deleted_at.is_(None),
            )
            .with_for_update()
            .first()
        )

        if not reminder:

            raise HTTPException(
                status_code=404,
                detail="Reminder not found",
            )

        if reminder.status != "pending":

            if reminder.status == status:

                return ReminderResponseSchema.model_validate(
                    reminder
                )

            raise HTTPException(
                status_code=409,
                detail=(
                    f"Reminder is already "
                    f"{reminder.status}"
                ),
            )

        try:

            reminder.status = status

            if status == "completed":

                reminder.completed_at = (
                    datetime.now(timezone.utc)
                )

            self.db.flush()

            self._publish_reminder_event(
                reminder,
                "REMINDER_UPDATED",
            )

            self.db.commit()

            self.db.refresh(
                reminder
            )

            return ReminderResponseSchema.model_validate(
                reminder
            )

        except Exception:

            self.db.rollback()

            raise

    # ============================================================
    # COMPLETE REMINDER
    # ============================================================

    def complete_reminder(
        self,
        reminder_id: int,
        employee_id: int,
    ):

        return self.update_reminder_status(
            reminder_id=reminder_id,
            employee_id=employee_id,
            status="completed",
        )

    # ============================================================
    # CANCEL REMINDER
    # ============================================================

    def cancel_reminder(
        self,
        reminder_id: int,
        employee_id: int,
    ):

        return self.update_reminder_status(
            reminder_id=reminder_id,
            employee_id=employee_id,
            status="cancelled",
        )

    # ============================================================
    # DELETE REMINDER
    # ============================================================

    def delete_reminder(
        self,
        reminder_id: int,
        employee_id: int,
    ):

        reminder = (
            self.db.query(Reminder)
            .filter(
                Reminder.id
                == reminder_id,

                Reminder.employee_id
                == employee_id,

                Reminder.deleted_at.is_(None),
            )
            .first()
        )

        if not reminder:

            return False

        reminder.deleted_at = (
            datetime.now(timezone.utc)
        )

        try:

            self.db.commit()

            return True

        except Exception:

            self.db.rollback()

            raise

    # ============================================================
    # NOTIFICATIONS
    # ============================================================

    def get_notifications(
        self,
        employee_id: int,
    ):

        now = datetime.now(
            timezone.utc
        )

        reminders = (
            self.db.query(Reminder)
            .filter(
                Reminder.employee_id
                == employee_id,

                Reminder.deleted_at.is_(None),

                Reminder.status
                == "pending",

                Reminder.reminder_at
                <= now,
            )
            .order_by(
                Reminder.reminder_at.desc()
            )
            .all()
        )

        items = [
            ReminderNotificationSchema.model_validate(
                reminder
            )
            for reminder in reminders
        ]

        return ReminderNotificationListSchema(
            items=items,
            total=len(items),
            unread_count=len(items),
        )