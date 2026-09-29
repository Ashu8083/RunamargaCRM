# backend/app/controllers/Loans/revert_application_controller.py

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.reverted_loans import RevertedLoan
from app.models.loan_applications import LoanApplication
from app.models.loan_types import LoanType
from app.models.employees import Employee
from app.core.access_control import AccessControl
from app.services.Loans.application_service import ApplicationService

# =========================================================
# GET REVERTED APPLICATIONS
# =========================================================

def get_reverted_applications(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
    loan_type_id: int | None = None,
    reverted_by_id: int | None = None,
    reverted_date: str | None = None,
):
    """
    Get reverted loan applications with pagination.

    Only the latest revert record for each loan is returned
    in the main table.
    """

    # -----------------------------------------------------
    # NORMALIZE PAGINATION
    # -----------------------------------------------------

    page = max(page, 1)

    page_size = max(page_size, 1)
    page_size = min(page_size, 100)

    offset = (page - 1) * page_size

    # -----------------------------------------------------
    # GET LATEST REVERT RECORD FOR EACH LOAN
    # -----------------------------------------------------

    latest_revert = (
        db.query(
            RevertedLoan.loan_id,
            func.max(RevertedLoan.id).label("latest_id"),
        )
        .filter(
            RevertedLoan.deleted_at.is_(None),
            RevertedLoan.rejection_type == "revert",
        )
        .group_by(
            RevertedLoan.loan_id
        )
        .subquery()
    )

    # -----------------------------------------------------
    # BASE QUERY
    # -----------------------------------------------------

    query = (
        db.query(
            RevertedLoan,
            LoanApplication,
            LoanType,
        )
        .join(
            latest_revert,
            latest_revert.c.latest_id
            == RevertedLoan.id,
        )
        .join(
            LoanApplication,
            LoanApplication.id
            == RevertedLoan.loan_id,
        )
        .outerjoin(
            LoanType,
            LoanType.id
            == LoanApplication.loan_type_id,
        )
        .filter(
            LoanApplication.deleted_at.is_(None),
        )
    )
    query = ApplicationService.apply_scope(
        query=query,
        db=db,
        employee=employee,
        context_id=context_id,
    )
    # -----------------------------------------------------
    # SEARCH
    # -----------------------------------------------------

    if search:

        search_value = (
            f"%{search.strip()}%"
        )

        search_conditions = [
            LoanApplication.name.ilike(
                search_value
            ),

            LoanApplication.phone.ilike(
                search_value
            ),

            LoanApplication.unique_id.ilike(
                search_value
            ),

            RevertedLoan.reverted_by_name.ilike(
                search_value
            ),

            RevertedLoan.remarks.ilike(
                search_value
            ),
        ]

        # Search by application numeric ID
        if search.strip().isdigit():

            search_conditions.append(
                LoanApplication.id
                == int(search.strip())
            )

        query = query.filter(
            or_(*search_conditions)
        )

    # -----------------------------------------------------
    # LOAN TYPE
    # -----------------------------------------------------

    if loan_type_id is not None:

        query = query.filter(
            LoanApplication.loan_type_id
            == loan_type_id
        )

    # -----------------------------------------------------
    # REVERTED BY
    # -----------------------------------------------------

    if reverted_by_id is not None:

        query = query.filter(
            RevertedLoan.reverted_by_id
            == reverted_by_id
        )

    # -----------------------------------------------------
    # REVERTED DATE
    # -----------------------------------------------------

    if reverted_date:

        query = query.filter(
            func.date(
                RevertedLoan.reverted_at
            )
            == reverted_date
        )

    # -----------------------------------------------------
    # TOTAL
    # -----------------------------------------------------

    total = query.count()

    # -----------------------------------------------------
    # FETCH PAGE
    # -----------------------------------------------------

    rows = (
        query
        .order_by(
            RevertedLoan.reverted_at.desc(),
            RevertedLoan.id.desc(),
        )
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # -----------------------------------------------------
    # BUILD RESPONSE
    # -----------------------------------------------------

    items = []

    for (
        reverted_loan,
        application,
        loan_type,
    ) in rows:

        items.append(
            {
                "id": reverted_loan.id,

                "loan_id": reverted_loan.loan_id,

                "unique_id": (
                    application.unique_id
                ),

                "applicantName": (
                    application.name
                    or "N/A"
                ),

                "phone": (
                    application.phone
                    or "N/A"
                ),

                "loanType": (
                    loan_type.name
                    if loan_type
                    else "N/A"
                ),

                "loanTypeId": (
                    application.loan_type_id
                ),

                "revertedDate": (
                    reverted_loan.reverted_at
                ),

                "remarks": (
                    reverted_loan.remarks
                    or ""
                ),

                "revertedBy": (
                    reverted_loan.reverted_by_name
                    or "N/A"
                ),

                "revertedById": (
                    reverted_loan.reverted_by_id
                ),

                "revertedByRole": (
                    reverted_loan.reverted_by_role
                ),

                "rejectionType": (
                    reverted_loan.rejection_type
                ),
            }
        )

    # -----------------------------------------------------
    # TOTAL PAGES
    # -----------------------------------------------------

    total_pages = (
        (total + page_size - 1)
        // page_size
        if total > 0
        else 0
    )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "success": True,

        "data": items,

        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages,
        },
    }


# =========================================================
# GET REVERT HISTORY
# =========================================================
def get_revert_history(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
    loan_id: int = 0,
):
    """
    Get all revert records for a loan.
    """
    application = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.id == loan_id,
            LoanApplication.deleted_at.is_(None),
        )
        .first()
    )

    if not application:
        return {
            "success": True,
            "loan_id": loan_id,
            "history": [],
        }
        scoped_query = ApplicationService.apply_scope(
            query=db.query(LoanApplication),
            db=db,
            employee=employee,
            context_id=context_id,
        )

        accessible_application = (
            scoped_query
            .filter(
                LoanApplication.id == loan_id
            )
            .first()
        )

        if not accessible_application:
            return {
                "success": True,
                "loan_id": loan_id,
                "history": [],
            }
    history = (
        db.query(RevertedLoan)
        .filter(
            RevertedLoan.loan_id == loan_id,
            RevertedLoan.deleted_at.is_(None),
            RevertedLoan.rejection_type == "revert",
        )
        .order_by(
            RevertedLoan.reverted_at.asc(),
            RevertedLoan.id.asc(),
        )
        .all()
    )

    return {
        "success": True,

        "loan_id": loan_id,

        "history": [
            {
                "id": item.id,

                "changedBy": (
                    item.reverted_by_name
                    or "Unknown User"
                ),

                "changedAt": (
                    item.reverted_at
                ),

                "remarks": (
                    item.remarks
                    or ""
                ),

                "revertedById": (
                    item.reverted_by_id
                ),

                "revertedByRole": (
                    item.reverted_by_role
                ),

                "rejectionType": (
                    item.rejection_type
                ),
            }

            for item in history
        ],
    }