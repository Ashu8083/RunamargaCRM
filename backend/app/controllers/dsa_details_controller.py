from sqlalchemy.orm import Session
from app.schemas.DSA_schema import DSACreateRequest, DSA_filter_search_query
from app.services.dsa_service import create_dsa_service, filter_dsa_search_service


def create_dsa_details(
        db_session: Session,
        # employee: Employee,
        create_dsa_details_request: DSACreateRequest,
):
    return create_dsa_service(
        db_session,
        create_dsa_details_request,
    )

def filter_dsa_details(
        db_session: Session,
        dsa_search_filter: DSA_filter_search_query,
):
    return filter_dsa_search_service(
        db_session,
        dsa_search_filter,
    )
