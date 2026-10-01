# backend/app/services/logs/loan_shuffle_logs_service.py

from datetime import datetime, time
from typing import Optional

from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.loan_shuffle_history import LoanShuffleHistory
from app.models.loan_applications import LoanApplication

class LoanShuffleLogsService:

    @staticmethod
    def _resolve_context(
        db: Session,
        context_id: Optional[int],
    ):
        if not context_id:
            return None

        return (
            db.query(EmployeeContext)
            .filter(EmployeeContext.id == context_id)
            .first()
        )

    @staticmethod
    def _context_details(
        db: Session,
        context_id: Optional[int],
    ):
        context = LoanShuffleLogsService._resolve_context(
            db=db,
            context_id=context_id,
        )

        if not context:
            return {
                "id": context_id,
                "name": None,
                "role": None,
            }

        employee = getattr(context, "employee", None)
        context_obj = getattr(context, "context", None)

        return {
            "id": context.id,
            "name": getattr(employee, "name", None),
            "role": getattr(context_obj, "code", None),
        }

    @staticmethod
    def _can_access_history(
        db: Session,
        history: LoanShuffleHistory,
        employee: Employee,
        active_context,
        visible_agent_ids: set[int],
        visible_rm_ids: set[int],
    ) -> bool:

        context_code = getattr(
            getattr(active_context, "context", None),
            "code",
            None,
        )

        # GLOBAL / MANAGER can see all shuffle logs.
        if context_code in {"GLOBAL", "MANAGER"}:
            return True

        loan_items = history.loan_ids or []

        for item in loan_items:
            from_agent_id = item.get("from_agent_context_id")
            to_agent_id = item.get("to_agent_context_id")

            from_rm_id = item.get("from_rm_context_id")
            to_rm_id = item.get("to_rm_context_id")

            # Agent can see logs involving itself.
            if context_code == "AGENT":
                if active_context.id in {
                    from_agent_id,
                    to_agent_id,
                }:
                    return True

            # RM / Team Lead can see logs involving
            # agents/RMs visible to their context.
            if context_code in {
                "RM",
                "TEAMLEAD",
                "TEAMLEAD_AGENT_BUSINESS",
                "TEAMLEAD_AGENT_PERSONAL",
            }:
                if from_agent_id in visible_agent_ids:
                    return True

                if to_agent_id in visible_agent_ids:
                    return True

                if from_rm_id in visible_rm_ids:
                    return True

                if to_rm_id in visible_rm_ids:
                    return True

        return False

    @staticmethod
    def get_logs(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        search: Optional[str] = None,
        shuffled_by_context_id: Optional[int] = None,
        from_agent_context_id: Optional[int] = None,
        to_agent_context_id: Optional[int] = None,
        from_rm_context_id: Optional[int] = None,
        to_rm_context_id: Optional[int] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ):
        # ---------------------------------------------------------
        # 1. Resolve active context
        # ---------------------------------------------------------

        active_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not active_context:
            raise PermissionError(
                "No active employee context found."
            )

        # ---------------------------------------------------------
        # 2. Resolve visible agents / RMs
        # ---------------------------------------------------------

        visible_agents = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=active_context.id,
        )

        visible_rms = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=active_context.id,
        )

        visible_agent_ids = {
            item.id
            for item in (visible_agents or [])
        }

        visible_rm_ids = {
            item.id
            for item in (visible_rms or [])
        }

        # ---------------------------------------------------------
        # 3. Query histories
        # ---------------------------------------------------------

        query = (
            db.query(LoanShuffleHistory)
            .filter(
                LoanShuffleHistory.deleted_at.is_(None)
            )
            .order_by(
                LoanShuffleHistory.created_at.desc()
            )
        )

        # ---------------------------------------------------------
        # 4. Filter shuffled-by
        # ---------------------------------------------------------

        if shuffled_by_context_id:
            query = query.filter(
                LoanShuffleHistory.shuffled_by_context_id
                == shuffled_by_context_id
            )

        # ---------------------------------------------------------
        # 5. Date filters
        # ---------------------------------------------------------

        if from_date:
            try:
                parsed_from_date = datetime.fromisoformat(
                    from_date
                )

                query = query.filter(
                    LoanShuffleHistory.created_at
                    >= parsed_from_date
                )
            except ValueError:
                raise ValueError(
                    "Invalid from_date. Expected YYYY-MM-DD."
                )

        if to_date:
            try:
                parsed_to_date = datetime.fromisoformat(
                    to_date
                )

                # Include the entire end date.
                parsed_to_datetime = datetime.combine(
                    parsed_to_date.date(),
                    time.max,
                )

                query = query.filter(
                    LoanShuffleHistory.created_at
                    <= parsed_to_datetime
                )

            except ValueError:
                raise ValueError(
                    "Invalid to_date. Expected YYYY-MM-DD."
                )

        histories = query.all()

        # ---------------------------------------------------------
        # 6. Load all loans once
        # ---------------------------------------------------------

        all_loan_ids = {
            item.get("loan_id")
            for history in histories
            for item in (history.loan_ids or [])
            if item.get("loan_id") is not None
        }

        loan_map = {}

        if all_loan_ids:
            loan_map = {
                loan.id: loan
                for loan in db.query(LoanApplication)
                .filter(
                    LoanApplication.id.in_(all_loan_ids),
                    LoanApplication.deleted_at.is_(None),
                )
                .all()
            }

        # ---------------------------------------------------------
        # 7. Convert DB history → table rows
        # ---------------------------------------------------------

        rows = []

        for history in histories:

            # Access control
            if not LoanShuffleLogsService._can_access_history(
                db=db,
                history=history,
                employee=employee,
                active_context=active_context,
                visible_agent_ids=visible_agent_ids,
                visible_rm_ids=visible_rm_ids,
            ):
                continue

            shuffled_by = LoanShuffleLogsService._context_details(
                db=db,
                context_id=history.shuffled_by_context_id,
            )

            loan_items = history.loan_ids or []

            for item in loan_items:

                loan_id = item.get("loan_id")

                if loan_id is None:
                    continue

                # Get loan from already-loaded map
                loan = loan_map.get(loan_id)

                phone = loan.phone if loan else None

                # -------------------------------------------------
                # Search by loan ID OR phone
                # -------------------------------------------------

                if search and search.strip():
                    search_value = search.strip().lower()

                    if (
                        search_value not in str(loan_id).lower()
                        and search_value not in str(phone or "").lower()
                    ):
                        continue

                # -------------------------------------------------
                # Extract assignments
                # -------------------------------------------------

                from_agent_id = item.get(
                    "from_agent_context_id"
                )

                to_agent_id = item.get(
                    "to_agent_context_id"
                )

                from_rm_id = item.get(
                    "from_rm_context_id"
                )

                to_rm_id = item.get(
                    "to_rm_context_id"
                )

                # -------------------------------------------------
                # Apply agent filters
                # -------------------------------------------------

                if (
                    from_agent_context_id
                    and from_agent_id
                    != from_agent_context_id
                ):
                    continue

                if (
                    to_agent_context_id
                    and to_agent_id
                    != to_agent_context_id
                ):
                    continue

                # -------------------------------------------------
                # Apply RM filters
                # -------------------------------------------------

                if (
                    from_rm_context_id
                    and from_rm_id
                    != from_rm_context_id
                ):
                    continue

                if (
                    to_rm_context_id
                    and to_rm_id
                    != to_rm_context_id
                ):
                    continue

                # -------------------------------------------------
                # Resolve names
                # -------------------------------------------------

                from_agent = (
                    LoanShuffleLogsService._context_details(
                        db=db,
                        context_id=from_agent_id,
                    )
                )

                to_agent = (
                    LoanShuffleLogsService._context_details(
                        db=db,
                        context_id=to_agent_id,
                    )
                )

                from_rm = (
                    LoanShuffleLogsService._context_details(
                        db=db,
                        context_id=from_rm_id,
                    )
                )

                to_rm = (
                    LoanShuffleLogsService._context_details(
                        db=db,
                        context_id=to_rm_id,
                    )
                )

                # -------------------------------------------------
                # Create frontend-compatible row
                # -------------------------------------------------

                rows.append(
                    {
                        "id": history.id,

                        "loanId": loan_id,
                        "phone": phone,
                        "shuffledById": (
                            shuffled_by["id"]
                        ),

                        "shuffledByName": (
                            shuffled_by["name"]
                        ),

                        "shuffledByRole": (
                            shuffled_by["role"]
                        ),

                        "fromAgentId": (
                            from_agent["id"]
                        ),

                        "fromAgentName": (
                            from_agent["name"]
                        ),

                        "toAgentId": (
                            to_agent["id"]
                        ),

                        "toAgentName": (
                            to_agent["name"]
                        ),

                        "fromRmId": (
                            from_rm["id"]
                        ),

                        "fromRmName": (
                            from_rm["name"]
                        ),

                        "toRmId": (
                            to_rm["id"]
                        ),

                        "toRmName": (
                            to_rm["name"]
                        ),

                        "createdAt": (
                            history.created_at.isoformat()
                            if history.created_at
                            else None
                        ),

                        "deletedAt": (
                            history.deleted_at.isoformat()
                            if history.deleted_at
                            else None
                        ),
                    }
                )

        # ---------------------------------------------------------
        # 7. Pagination
        # ---------------------------------------------------------

        total = len(rows)

        offset = (page - 1) * limit

        paginated_rows = rows[
            offset: offset + limit
        ]

        total_pages = (
            (total + limit - 1) // limit
            if total
            else 0
        )

        return {
            "items": paginated_rows,
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": total_pages,
        }