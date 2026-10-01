# backend/app/services/logs/loan_type_change_logs_service.py    

from datetime import datetime, time
from typing import Optional

from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_type_change_log import LoanTypeChangeLog
from app.models.loan_applications import LoanApplication


class LoanChangeTypeLogsService:

    @staticmethod
    def get_logs(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        search: Optional[str] = None,
        changed_by_id: Optional[int] = None,
        reports_to_id: Optional[int] = None,
        from_loan_type_id: Optional[int] = None,
        to_loan_type_id: Optional[int] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ):

        # =========================================================
        # ACTIVE CONTEXT
        # =========================================================

        active_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not active_context:
            raise PermissionError(
                "No active employee context found."
            )

        # =========================================================
        # BASE QUERY
        # =========================================================

        query = (
            db.query(LoanTypeChangeLog)
            .join(
                LoanApplication,
                LoanApplication.id
                == LoanTypeChangeLog.loan_id,
            )
            .filter(
                LoanTypeChangeLog.deleted_at.is_(None),
                LoanApplication.deleted_at.is_(None),
            )
            .order_by(
                LoanTypeChangeLog.created_at.desc()
            )
        )

        # =========================================================
        # RBAC
        #
        # Use the same application scope already used by
        # update_application_loan_type().
        # =========================================================

        from app.services.Loans.application_service import (
            ApplicationService,
        )

        query = ApplicationService.apply_scope(
            query=query,
            db=db,
            employee=employee,
        )

        # =========================================================
        # CHANGED BY
        # =========================================================

        if changed_by_id:
            query = query.filter(
                LoanTypeChangeLog.changed_by_id
                == changed_by_id
            )

        # =========================================================
        # REPORTS TO
        # =========================================================

        if reports_to_id:
            query = query.filter(
                LoanTypeChangeLog.reports_to_id
                == reports_to_id
            )

        # =========================================================
        # FROM LOAN TYPE
        # =========================================================

        if from_loan_type_id:
            query = query.filter(
                LoanTypeChangeLog.from_loan_type_id
                == from_loan_type_id
            )

        # =========================================================
        # TO LOAN TYPE
        # =========================================================

        if to_loan_type_id:
            query = query.filter(
                LoanTypeChangeLog.to_loan_type_id
                == to_loan_type_id
            )

        # =========================================================
        # FROM DATE
        # =========================================================

        if from_date:
            try:
                parsed_from = datetime.fromisoformat(
                    from_date
                )

                query = query.filter(
                    LoanTypeChangeLog.created_at
                    >= parsed_from
                )

            except ValueError:
                raise ValueError(
                    "Invalid from_date. Expected YYYY-MM-DD."
                )

        # =========================================================
        # TO DATE
        # =========================================================

        if to_date:
            try:
                parsed_to = datetime.fromisoformat(
                    to_date
                )

                parsed_to_datetime = datetime.combine(
                    parsed_to.date(),
                    time.max,
                )

                query = query.filter(
                    LoanTypeChangeLog.created_at
                    <= parsed_to_datetime
                )

            except ValueError:
                raise ValueError(
                    "Invalid to_date. Expected YYYY-MM-DD."
                )

        # =========================================================
        # SEARCH
        #
        # Search:
        #   - loan ID
        #   - changed-by employee name
        #   - changed-by context ID
        #   - reports-to context ID
        #
        # Employee name searching is handled below after the
        # database query because the existing relationships
        # are already configured on EmployeeContext.
        # =========================================================

        logs = query.all()

        search_value = (
            search.strip().lower()
            if search
            else None
        )

        filtered_logs = []

        for log in logs:

            changed_by_context = log.changed_by

            reports_to_context = log.reports_to

            changed_by_employee = (
                changed_by_context.employee
                if changed_by_context
                else None
            )

            reports_to_employee = (
                reports_to_context.employee
                if reports_to_context
                else None
            )

            # =====================================================
            # SEARCH
            # =====================================================

            if search_value:

                loan_match = (
                    search_value
                    in str(log.loan_id).lower()
                )

                changed_by_name = (
                    changed_by_employee.name
                    if changed_by_employee
                    else ""
                )

                reports_to_name = (
                    reports_to_employee.name
                    if reports_to_employee
                    else ""
                )

                changed_by_match = (
                    search_value
                    in changed_by_name.lower()
                )

                changed_by_id_match = (
                    search_value
                    in str(log.changed_by_id).lower()
                )

                reports_to_match = (
                    search_value
                    in reports_to_name.lower()
                )

                reports_to_id_match = (
                    search_value
                    in str(
                        log.reports_to_id or ""
                    ).lower()
                )

                if not (
                    loan_match
                    or changed_by_match
                    or changed_by_id_match
                    or reports_to_match
                    or reports_to_id_match
                ):
                    continue

            filtered_logs.append(
                (
                    log,
                    changed_by_employee,
                    reports_to_employee,
                )
            )

        # =========================================================
        # TOTAL
        # =========================================================

        total = len(filtered_logs)

        # =========================================================
        # PAGINATION
        # =========================================================

        offset = (page - 1) * limit

        paginated_logs = filtered_logs[
            offset: offset + limit
        ]

        total_pages = (
            (total + limit - 1) // limit
            if total
            else 0
        )

        # =========================================================
        # RESPONSE
        # =========================================================

        items = []

        for (
            log,
            changed_by_employee,
            reports_to_employee,
        ) in paginated_logs:

            items.append(
                {
                    "id": log.id,

                    "loanId": log.loan_id,

                    "changedById": (
                        log.changed_by_id
                    ),

                    "changedByName": (
                        changed_by_employee.name
                        if changed_by_employee
                        else None
                    ),

                    "changedByRole": (
                        log.changed_by_role
                    ),

                    "reportsToId": (
                        log.reports_to_id
                    ),

                    "reportsToName": (
                        reports_to_employee.name
                        if reports_to_employee
                        else None
                    ),

                    "fromLoanType": (
                        log.from_loan_type.name
                        if log.from_loan_type
                        else None
                    ),

                    "toLoanType": (
                        log.to_loan_type.name
                        if log.to_loan_type
                        else None
                    ),

                    "createdAt": (
                        log.created_at.isoformat()
                        if log.created_at
                        else None
                    ),

                    "deletedAt": (
                        log.deleted_at.isoformat()
                        if log.deleted_at
                        else None
                    ),
                }
            )

        return {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": total_pages,
        }