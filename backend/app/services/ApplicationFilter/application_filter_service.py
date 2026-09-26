# backend/app/services/ApplicationFilter/application_filter_service.py

from datetime import datetime

from sqlalchemy import extract
from sqlalchemy.orm import Session

from app.models.loan_applications import LoanApplication
from app.models.bank_processings import BankProcessing
from app.models.loan_types import LoanType
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.core.access_control import AccessControl


# =========================================================
# STATUS PRIORITY
# =========================================================

# One application can have multiple bank processings.
#
# Example:
#
# loan_application.status = inprocess
#
# bank_processings:
#     HDFC -> login
#     ICICI -> sanctioned
#     SBI  -> disbursed
#
# Final application status = disbursed
#
# =========================================================

STATUS_PRIORITY = {
    "inprocess": 1,
    "docspending": 1,

    "rejected": 2,
    "revert_rejected": 2,

    "login": 3,
    "sanctioned": 4,
    "disbursed": 5,
}


# =========================================================
# STATUS LABELS
# =========================================================

STATUS_LABELS = {
    "inprocess": "In Process",
    "docspending": "In Process",

    "rejected": "Rejected",
    "revert_rejected": "Rejected",

    "login": "Login",
    "sanctioned": "Sanctioned",
    "disbursed": "Disbursed",
}


# =========================================================
# BANK STATUS PRIORITY
# =========================================================

BANK_STATUS_PRIORITY = {
    "rejected": 2,
    "login": 3,
    "sanctioned": 4,
    "disbursed": 5,
}


# =========================================================
# STATUS NORMALIZATION
# =========================================================

def get_application_status(
    loan,
    processings,
):
    """
    Determine the effective application status.

    The loan application status is considered first.

    Bank processing statuses can move the application
    further along the pipeline.

    The highest priority status wins.
    """

    loan_status = (
        loan.status.value
        if loan.status
        else None
    )

    selected_status = loan_status

    selected_priority = STATUS_PRIORITY.get(
        loan_status,
        0,
    )

    selected_processing = None

    for processing in processings:

        bank_status = (
            str(processing.status or "")
            .strip()
            .lower()
        )

        bank_priority = BANK_STATUS_PRIORITY.get(
            bank_status,
            0,
        )

        if bank_priority > selected_priority:

            selected_priority = bank_priority

            selected_status = bank_status

            selected_processing = processing

    return (
        selected_status,
        selected_processing,
    )


# =========================================================
# EMPTY RESPONSE HELPER
# =========================================================

def _empty_response(
    page,
    limit,
):
    """
    Return a consistent empty paginated response.
    """

    return {
        "items": [],
        "total": 0,
        "page": page,
        "limit": limit,
    }


# =========================================================
# GET EMPLOYEE CONTEXT
# =========================================================

def _get_employee_context(
    db: Session,
    employee_id,
    context_code,
):
    """
    Resolve an employee ID to an active EmployeeContext.

    API filters continue to use employee IDs.

    LoanApplication ownership uses EmployeeContext IDs.
    """

    return (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.employee_id == employee_id,
            EmployeeContext.is_active.is_(True),
            EmployeeContext.context.has(
                code=context_code
            ),
        )
        .first()
    )


# =========================================================
# APPLICATION FILTER
# =========================================================

def get_application_filter_data(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
    search=None,
    agent_context_id=None,
    rm_context_id=None,
    loan_type_id=None,
    status=None,
    month=None,
    year=None,
    from_date=None,
    to_date=None,
    page=1,
    limit=30,
):
    """
    Get filtered loan applications.

    API-level agent_id and rm_id are employee IDs.

    Database ownership is stored using:

        agent_context_id
        rm_context_id
        applied_by_context_id

    Effective status is calculated using:

        loan_applications.status
        +
        bank_processings.status

    Each loan application is returned only once.
    """

    # =====================================================
    # VALIDATE PAGINATION
    # =====================================================

    page = max(
        int(page or 1),
        1,
    )

    limit = max(
        min(
            int(limit or 30),
            100,
        ),
        1,
    )

    # =====================================================
    # DATE CONVERSION
    # =====================================================

    parsed_from_date = None
    parsed_to_date = None

    if from_date:

        parsed_from_date = datetime.strptime(
            from_date,
            "%Y-%m-%d",
        ).date()

    if to_date:

        parsed_to_date = datetime.strptime(
            to_date,
            "%Y-%m-%d",
        ).date()

    # =====================================================
    # BASE QUERY
    # =====================================================

    query = db.query(LoanApplication).filter(
        LoanApplication.deleted_at.is_(None)
    )

    # =====================================================
    # RBAC / CONTEXT SCOPE
    # =====================================================

    query = AccessControl.apply_application_scope(
        query=query,
        db=db,
        employee=employee,
        context_id=context_id,
    )

    


    # =====================================================
    # SEARCH
    # =====================================================

    if search:

        search_value = search.strip()

        if search_value:

            search_pattern = (
                f"%{search_value}%"
            )

            query = query.filter(
                (
                    LoanApplication.unique_id.ilike(
                        search_pattern
                    )
                )
                |
                (
                    LoanApplication.name.ilike(
                        search_pattern
                    )
                )
                |
                (
                    LoanApplication.phone.ilike(
                        search_pattern
                    )
                )
                |
                (
                    LoanApplication.email.ilike(
                        search_pattern
                    )
                )
            )

    # =====================================================
    # AGENT FILTER
    # =====================================================

    if agent_context_id is not None:

        query = query.filter(
            LoanApplication.agent_context_id
            == int(agent_context_id)
        )

    # =====================================================
    # RM FILTER
    # =====================================================

    if rm_context_id is not None:

        query = query.filter(
            LoanApplication.rm_context_id
            == int(rm_context_id)
        )
    # =====================================================
    # LOAN TYPE
    # =====================================================

    if loan_type_id is not None:

        query = query.filter(
            LoanApplication.loan_type_id
            == int(loan_type_id)
        )

    # =====================================================
    # APPLICATION DATE
    # =====================================================

    if parsed_from_date:

        query = query.filter(
            LoanApplication.applied_date
            >= parsed_from_date
        )

    if parsed_to_date:

        query = query.filter(
            LoanApplication.applied_date
            <= parsed_to_date
        )

    # =====================================================
    # YEAR
    # =====================================================

    if year:

        query = query.filter(
            LoanApplication.applied_date.isnot(None)
        )

        query = query.filter(
            extract(
                "year",
                LoanApplication.applied_date,
            )
            == int(year)
        )

    # =====================================================
    # MONTH
    # =====================================================

    if month:

        query = query.filter(
            extract(
                "month",
                LoanApplication.applied_date,
            )
            == int(month)
        )

    # =====================================================
    # GET APPLICATIONS
    # =====================================================

    applications = (
        query
        .order_by(
            LoanApplication.applied_date.desc(),
            LoanApplication.id.desc(),
        )
        .all()
    )

    # =====================================================
    # GET BANK PROCESSINGS
    # =====================================================

    loan_ids = [
        application.id
        for application in applications
    ]

    processing_by_loan = {}

    if loan_ids:

        processings = (
            db.query(BankProcessing)
            .filter(
                BankProcessing.loan_id.in_(
                    loan_ids
                ),
                BankProcessing.deleted_at.is_(None),
            )
            .all()
        )

        for processing in processings:

            if not processing.loan_id:
                continue

            processing_by_loan.setdefault(
                processing.loan_id,
                [],
            ).append(
                processing
            )

    # =====================================================
    # EFFECTIVE STATUS FILTER
    # =====================================================

    filtered_applications = []

    requested_status = (
        str(status).strip().lower()
        if status
        else None
    )

    for application in applications:

        processings = (
            processing_by_loan.get(
                application.id,
                [],
            )
        )

        (
            effective_status,
            selected_processing,
        ) = get_application_status(
            application,
            processings,
        )

        if requested_status:

            # Frontend sends:
            #
            # inprocess
            # login
            # sanctioned
            # disbursed
            # rejected
            #
            # But allow dashboard-style labels too.

            normalized_requested_status = (
                requested_status
            )

            if requested_status in {
                "pending",
                "processing",
            }:

                normalized_requested_status = (
                    "inprocess"
                )

            elif requested_status == "approved":

                normalized_requested_status = (
                    "sanctioned"
                )

            if normalized_requested_status == "rejected":

                matches = effective_status in {
                    "rejected",
                    "revert_rejected",
                }

            else:

                matches = (
                    effective_status
                    == normalized_requested_status
                )

            if not matches:
                continue

        filtered_applications.append(
            (
                application,
                effective_status,
                selected_processing,
            )
        )

    # =====================================================
    # TOTAL
    # =====================================================

    total = len(
        filtered_applications
    )

    # =====================================================
    # PAGINATION
    # =====================================================

    offset = (
        page - 1
    ) * limit

    paginated_applications = (
        filtered_applications[
            offset:
            offset + limit
        ]
    )

    # =====================================================
    # RESPONSE ITEMS
    # =====================================================

    items = []

    for (
        application,
        effective_status,
        selected_processing,
    ) in paginated_applications:

        # -------------------------------------------------
        # DISBURSEMENTS
        # -------------------------------------------------

        disbursements = []

        if effective_status == "disbursed":

            for processing in (
                processing_by_loan.get(
                    application.id,
                    [],
                )
            ):

                if (
                    str(
                        processing.status or ""
                    )
                    .strip()
                    .lower()
                    != "disbursed"
                ):
                    continue

                disbursements.append({
                    "id": processing.id,

                    "bank_id":
                        processing.bank_id,

                    "disbursedDate":
                        processing.disbursed_at,

                    "disbursedAmount":
                        processing.disbursement_amount
                        or processing.offered_amount,

                    "dsaId":
                        processing.dsa_id,

                    "dsaCode":
                        processing.dsa_code,

                    "dsaName":
                        processing.dsa_name,

                    "pf":
                        processing.processing_fees,

                    "insurance":
                        processing.insurance,
                })

        # -------------------------------------------------
        # AGENT
        # -------------------------------------------------

        agent_employee = None

        if (
            application.agent_context
            and application.agent_context.employee
        ):
            agent_employee = (
                application.agent_context.employee
            )

        # -------------------------------------------------
        # RM
        # -------------------------------------------------

        rm_employee = None

        if (
            application.rm_context
            and application.rm_context.employee
        ):
            rm_employee = (
                application.rm_context.employee
            )

        # -------------------------------------------------
        # ITEM
        # -------------------------------------------------

        items.append({

            "id":
                application.id,

            "uniqueId":
                application.unique_id,

            "name":
                application.name,

            "phone":
                application.phone,

            "email":
                application.email,

            "appliedDate":
                application.applied_date,

            # -------------------------------------------------
            # API continues to expose EMPLOYEE ID
            # -------------------------------------------------

            "agentId": (
                application.agent_context.id
                if application.agent_context
                else None
            ),

            "agentName": (
                agent_employee.name
                if agent_employee
                else None
            ),

            "rmId": (
                application.rm_context.id
                if application.rm_context
                else None
            ),

            "rmName": (
                rm_employee.name
                if rm_employee
                else None
            ),

            "loanTypeId":
                application.loan_type_id,

            "loanType":
                (
                    application.loan_type.name
                    if application.loan_type
                    else None
                ),

            "loanStatus":
                effective_status,

            "loanStatusLabel":
                STATUS_LABELS.get(
                    effective_status,
                    effective_status,
                ),

            "loanAmount":
                float(
                    application.loan_amt or 0
                ),

            "disbursements":
                disbursements,
        })

    # =====================================================
    # TOTAL PAGES
    # =====================================================

    total_pages = (
        (total + limit - 1)
        // limit
        if total
        else 0
    )

    # =====================================================
    # RESPONSE
    # =====================================================

    return {
        "success": True,

        "items":
            items,

        "pagination": {

            "page":
                page,

            "limit":
                limit,

            "total":
                total,

            "totalPages":
                total_pages,
        },
    }


# =========================================================
# APPLICATION FILTER OPTIONS
# =========================================================

def get_application_filter_options(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
):
    """
    Return application filter visibility and
    employee options based on the active context.
    """

    context = AccessControl.get_active_context(
        db=db,
        employee=employee,
        context_id=context_id,
    )

    if not context or not context.context:
        return {
            "context": None,
            "visibility": {
                "show_rm": False,
                "show_agent": False,
                "show_team_lead": False,
            },
            "rms": [],
            "agents": [],
            "team_leads": [],
        }

    family = AccessControl.get_context_family(
        context.context.code
    )

    # ---------------------------------------------------------
    # VISIBILITY
    # ---------------------------------------------------------

    visibility = {
        "show_rm": family != "RM",
        "show_agent": family != "AGENT",
        "show_team_lead": family != "TEAMLEAD",
    }

    # ---------------------------------------------------------
    # VISIBLE EMPLOYEES
    # ---------------------------------------------------------

    rms = AccessControl.get_visible_rms(
        db=db,
        employee=employee,
        context_id=context_id,
    )

    agents = AccessControl.get_visible_agents(
        db=db,
        employee=employee,
        context_id=context_id,
    )

    team_leads = AccessControl.get_visible_team_leads(
        db=db,
        employee=employee,
        context_id=context_id,
    )

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    return {
        "context": {
            "id": context.id,
            "context_id": context.context.id,
            "code": context.context.code,
            "name": context.context.name,
        },

        "visibility": visibility,

        "rms": [
            {
                "id": item.id,
                "name": item.name,
            }
            for item in rms
        ],

        "agents": [
            {
                "id": item.id,
                "name": item.name,
            }
            for item in agents
        ],

        "team_leads": [
            {
                "id": item.id,
                "name": item.name,
            }
            for item in team_leads
        ],
    }