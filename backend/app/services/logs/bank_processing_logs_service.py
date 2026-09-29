# backend/app/services/logs/bank_processing_logs_service.py


from datetime import datetime, time

from sqlalchemy import (
    or_,
    String,
)
from sqlalchemy.orm import Session

from app.models.bank_processing_logs import BankProcessingLog
from app.models.employees import Employee

from app.models.loan_applications import LoanApplication
from app.core.access_control import AccessControl
from app.services.Loans.application_service import ApplicationService


class BankProcessingLogsService:

    @staticmethod
    def get_logs(
        db: Session,
        employee,
        context_id=None,
        search=None,
        loan_id=None,
        bp_id=None,
        employee_context_id=None,
        event=None,
        from_date=None,
        to_date=None,
        page=1,
        limit=10,
    ):
        # =====================================================
        # ACTIVE CONTEXT
        # =====================================================

        active_context = AccessControl.get_active_context(
            db,
            employee,
            context_id,
        )

        if not active_context:
            raise PermissionError(
                "No active employee context found"
            )

        # =====================================================
        # BASE QUERY
        # =====================================================

        query = (
            db.query(BankProcessingLog)
            .join(
                LoanApplication,
                LoanApplication.id
                == BankProcessingLog.loan_id,
            )
            .filter(
                BankProcessingLog.deleted_at.is_(None),
                LoanApplication.deleted_at.is_(None),
            )
        )

        # =====================================================
        # RBAC / APPLICATION VISIBILITY
        # =====================================================

        query = ApplicationService.apply_scope(
            query,
            db,
            employee,
        )

        # =====================================================
        # LOAN ID
        # =====================================================

        if loan_id:
            query = query.filter(
                BankProcessingLog.loan_id == int(loan_id)
            )

        # =====================================================
        # BANK PROCESSING ID
        # =====================================================

        if bp_id:
            query = query.filter(
                BankProcessingLog.bp_id == int(bp_id)
            )

        # =====================================================
        # EMPLOYEE CONTEXT
        # =====================================================

        if employee_context_id:
            query = query.filter(
                BankProcessingLog.employee_context_id
                == int(employee_context_id)
            )

        # =====================================================
        # EVENT
        # =====================================================

        if event:
            query = query.filter(
                BankProcessingLog.event == event
            )

        # =====================================================
        # FROM DATE
        # =====================================================

        if from_date:

            parsed_from_date = datetime.fromisoformat(
                from_date
            )

            start_datetime = datetime.combine(
                parsed_from_date.date(),
                time.min,
            )

            query = query.filter(
                BankProcessingLog.created_at
                >= start_datetime
            )

        # =====================================================
        # TO DATE
        # =====================================================

        if to_date:

            parsed_to_date = datetime.fromisoformat(
                to_date
            )

            end_datetime = datetime.combine(
                parsed_to_date.date(),
                time.max,
            )

            query = query.filter(
                BankProcessingLog.created_at
                <= end_datetime
            )

        # =====================================================
        # SEARCH
        #
        # Search:
        #   Loan ID
        #   BP ID
        #   Employee name
        #   Employee context ID
        #   Role
        #   Event
        # =====================================================

        if search and search.strip():

            search_value = (
                search.strip()
            )

            search_pattern = (
                f"%{search_value}%"
            )

            query = query.filter(
                or_(
                    LoanApplication.unique_id.ilike(
                        search_pattern
                    ),

                    BankProcessingLog.event.ilike(
                        search_pattern
                    ),
                    Employee.name.ilike(search_pattern),
              
                    BankProcessingLog.bp_id.cast(String).ilike(search_pattern),

                    BankProcessingLog.employee_context_id.cast(String).ilike(search_pattern),
                   

                    BankProcessingLog.loan_id.cast(String).ilike(search_pattern)
                )
            )

        # =====================================================
        # TOTAL
        # =====================================================

        total = query.count()

        # =====================================================
        # PAGINATION
        # =====================================================

        page = max(
            int(page),
            1,
        )

        limit = max(
            min(int(limit), 100),
            1,
        )

        total_pages = max(
            (total + limit - 1) // limit,
            1,
        )

        if page > total_pages:
            page = total_pages

        offset = (
            page - 1
        ) * limit

        # =====================================================
        # FETCH
        # =====================================================

        logs = (
            query
            .order_by(
                BankProcessingLog.created_at.desc(),
                BankProcessingLog.id.desc(),
            )
            .offset(offset)
            .limit(limit)
            .all()
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        items = []

        for log in logs:

            employee_context = (
                log.employee_context
            )

            employee_obj = (
                employee_context.employee
                if employee_context
                else None
            )
            # LoanApplication is already joined in the query
            loan_obj = log.loan

            items.append(
                {
                    "id": log.id,

                    "loanId": log.loan_id,
                     "phone": (
                            loan_obj.phone
                            if loan_obj
                            else None
                        ),


                    "bpId": log.bp_id,

                    "employeeContextId": (
                        log.employee_context_id
                    ),

                    "employeeId": (
                        employee_obj.id
                        if employee_obj
                        else None
                    ),

                    "employeeName": (
                        employee_obj.name
                        if employee_obj
                        else None
                    ),


                    "event": log.event,

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