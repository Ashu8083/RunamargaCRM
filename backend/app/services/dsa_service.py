from app.models.dsa_details import DSAStatus,DSADetail
from sqlalchemy.orm import Session
from app.schemas.DSA_schema import ( DSACreateRequest,
                                     DSA_filter_search_query)


def create_dsa_service(
        db: Session,
        dsa_details_schema:DSACreateRequest,
):

    dsa = DSADetail(
        dsa_name=dsa_details_schema.dsa_name,
        dsa_code=dsa_details_schema.dsa_code,
        bank_id=dsa_details_schema.bank_id,
        loan_type_id=dsa_details_schema.loan_type_id,
        status=dsa_details_schema.status,
        is_default = dsa_details_schema.is_default,
    )
    db.add(dsa)
    db.commit()
    db.refresh(dsa)
    return dsa

def filter_dsa_search_service(
                            db: Session,
                            dsa_search_filter : DSA_filter_search_query
                            ):
    query = db.query(DSADetail)

    if dsa_search_filter.search:
        search = f"%{dsa_search_filter.search}%"
        query = query.filter(
            (DSADetail.dsa_name.ilike(search)) |
            (DSADetail.dsa_code.ilike(search))
        )

    if dsa_search_filter.status is not None:
        query = query.filter(
            DSADetail.status == dsa_search_filter.status
        )

    if dsa_search_filter.is_default is not None:
        query = query.filter(
            DSADetail.is_default == dsa_search_filter.is_default
        )

    if dsa_search_filter.bank_id is not None:
        query = query.filter(
            DSADetail.bank_id == dsa_search_filter.bank_id
        )

    if dsa_search_filter.loan_type_id is not None:
        query = query.filter(
            DSADetail.loan_type_id == dsa_search_filter.loan_type_id
        )
    # pagination
    offset = (dsa_search_filter.page - 1) * dsa_search_filter.limit
    query = query.offset(offset).limit(dsa_search_filter.limit)
    return query.all()





