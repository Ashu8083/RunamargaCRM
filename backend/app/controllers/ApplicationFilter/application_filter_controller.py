# backend/app/controllers/ApplicationFilter/application_filter_controller.py

from app.services.ApplicationFilter.application_filter_service import (
    get_application_filter_data,
    get_application_filter_options as get_application_filter_options_service,
)


# =========================================================
# APPLICATION FILTER
# =========================================================

def get_application_filter(
    db,
    employee,
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
    Controller for Application Filter.
    """

    return get_application_filter_data(
        db=db,
        employee=employee,
        context_id=context_id,
        search=search,
        agent_context_id=agent_context_id,
        rm_context_id=rm_context_id,
        loan_type_id=loan_type_id,
        status=status,
        month=month,
        year=year,
        from_date=from_date,
        to_date=to_date,
        page=page,
        limit=limit,
    )


# =========================================================
# APPLICATION FILTER OPTIONS
# =========================================================

def get_application_filter_options(
    db,
    employee,
    context_id: int | None = None,
):
    """
    Return application filter visibility and
    employee options based on the active context.
    """

    return get_application_filter_options_service(
        db=db,
        employee=employee,
        context_id=context_id,
    )