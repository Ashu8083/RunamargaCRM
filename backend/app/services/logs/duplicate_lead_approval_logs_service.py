# backend/app/services/logs/duplicate_lead_approval_logs_service.py


from sqlalchemy.orm import Session, joinedload

from app.models.duplicate_lead_approval_logs import (
    DuplicateLeadApprovalLog,
    DuplicateLeadApprovalLogStatus,
)


from app.models.employee_contexts import EmployeeContext
class DuplicateLeadApprovalLogService:

    @staticmethod
    def get_logs(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        status: str | None = None,
        duplicate_approval_id: int | None = None,
        loan_id: int | None = None,
    ):
        """
        Fetch duplicate lead approval logs.

        Filters:
        - status: approved or rejected
        - duplicate_approval_id: duplicate approval request ID
        - loan_id: actual loan application ID
        - skip and limit: pagination
        """

        query = (
            db.query(DuplicateLeadApprovalLog)
            .options(
                joinedload(
                    DuplicateLeadApprovalLog.duplicate_approval
                ),
                joinedload(
                    DuplicateLeadApprovalLog.loan_application
                ),
                joinedload(
                    DuplicateLeadApprovalLog.submitted_by
                ).joinedload(
                    EmployeeContext.employee
                ),
                joinedload(
                    DuplicateLeadApprovalLog.reports_to
                ).joinedload(
                    EmployeeContext.employee
                ),
                joinedload(
                    DuplicateLeadApprovalLog.reviewed_by
                ),
            )
            .filter(
                DuplicateLeadApprovalLog.deleted_at.is_(None)
            )
        )

        # Filter by approval status
        if status:
            try:
                status_enum = DuplicateLeadApprovalLogStatus(status.lower())
            except ValueError:
                return []

            query = query.filter(
                DuplicateLeadApprovalLog.status == status_enum
            )

        # Filter by duplicate approval request ID
        if duplicate_approval_id is not None:
            query = query.filter(
                DuplicateLeadApprovalLog.duplicate_approval_id
                == duplicate_approval_id
            )

        # Filter by actual loan application ID
        if loan_id is not None:
            query = query.filter(
                DuplicateLeadApprovalLog.loan_id == loan_id
            )

        return (
            query
            .order_by(
                DuplicateLeadApprovalLog.created_at.desc(),
                DuplicateLeadApprovalLog.id.desc(),
            )
            .offset(skip)
            .limit(limit)
            .all()
        )