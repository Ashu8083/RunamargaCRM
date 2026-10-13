from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.logs.duplicate_lead_approval_logs_service import (
    DuplicateLeadApprovalLogService,
)


def get_duplicate_lead_approval_logs(
    db: Session,
    employee: Employee,
    skip: int = 0,
    limit: int = 50,
    status: str | None = None,
    duplicate_approval_id: int | None = None,
    loan_id: int | None = None,
):
    """
    Return duplicate lead approval logs for the frontend.
    """

    # Fetch logs from the service
    logs = DuplicateLeadApprovalLogService.get_logs(
        db=db,
        skip=skip,
        limit=min(limit, 200),
        status=status,
        duplicate_approval_id=duplicate_approval_id,
        loan_id=loan_id,
    )

    result = []

    for log in logs:
        submitted_by_name = None
        reports_to_name = None
        reviewed_by_name = None

        # Employee who submitted the duplicate approval
        if log.submitted_by and log.submitted_by.employee:
            submitted_by_name = log.submitted_by.employee.name

        # Manager/team lead who the submitter reports to
        if log.reports_to and log.reports_to.employee:
            reports_to_name = log.reports_to.employee.name

        # Employee who approved or rejected the request
        if log.reviewed_by:
            reviewed_by_name = log.reviewed_by.name

        result.append(
            {
                "id": log.id,
                "duplicate_approval_id": log.duplicate_approval_id,
                "loan_id": log.loan_id,
                "submitted_by_id": log.submitted_by_id,
                "submitted_by_name": submitted_by_name,
                "reports_to_id": log.reports_to_id,
                "reports_to_name": reports_to_name,
                "reviewed_by_id": log.reviewed_by_id,
                "reviewed_by_name": reviewed_by_name,
                "status": (
                    log.status.value
                    if log.status
                    else None
                ),
                "created_at": log.created_at,
            }
        )

    return result