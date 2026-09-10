from sqlalchemy.orm import Session
from app.schemas.DSA_schema import DSACreateRequest, DSA_filter_search_query
from app.services.dsa_service import (
    create_dsa_service,
    update_dsa_service,
    delete_dsa_service,
    filter_dsa_search_service,
)


def create_dsa_details(
    db_session: Session,
    create_dsa_details_request: DSACreateRequest,
):
    return create_dsa_service(
        db_session,
        create_dsa_details_request,
    )


def update_dsa_details(
    db_session: Session,
    dsa_id: int,
    update_dsa_request: DSACreateRequest,
):
    return update_dsa_service(
        db_session,
        dsa_id,
        update_dsa_request,
    )


def delete_dsa_details(
    db_session: Session,
    dsa_id: int,
):
    return delete_dsa_service(
        db_session,
        dsa_id,
    )


def filter_dsa_details(
    db_session: Session,
    dsa_search_filter: DSA_filter_search_query,
):
    return filter_dsa_search_service(
        db_session,
        dsa_search_filter,
    )
