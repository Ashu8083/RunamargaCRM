from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from app.models.dsa_details import DSAStatus, DSADetail
from app.schemas.DSA_schema import (
    DSACreateRequest,
    DSA_filter_search_query,
    DSAResponse,
)


def create_dsa_service(
    db: Session,
    dsa_details_schema: DSACreateRequest,
):
    dsa = DSADetail(
        dsa_name=dsa_details_schema.dsa_name,
        dsa_code=dsa_details_schema.dsa_code,
        bank_id=dsa_details_schema.bank_id,
        loan_type_id=dsa_details_schema.loan_type_id,
        status=dsa_details_schema.status,
        is_default=dsa_details_schema.is_default,
    )
    db.add(dsa)
    db.commit()
    db.refresh(dsa)
    return dsa


def update_dsa_service(
    db: Session,
    dsa_id: int,
    dsa_details_schema: DSACreateRequest,
):
    dsa = (
        db.query(DSADetail)
        .filter(DSADetail.id == dsa_id, DSADetail.deleted_at.is_(None))
        .first()
    )

    if not dsa:
        raise HTTPException(status_code=404, detail="DSA not found")

    dsa.dsa_name = dsa_details_schema.dsa_name
    dsa.dsa_code = dsa_details_schema.dsa_code
    dsa.bank_id = dsa_details_schema.bank_id
    dsa.loan_type_id = dsa_details_schema.loan_type_id
    dsa.status = dsa_details_schema.status
    dsa.is_default = dsa_details_schema.is_default

    db.commit()
    db.refresh(dsa)
    return dsa


def delete_dsa_service(
    db: Session,
    dsa_id: int,
):
    dsa = (
        db.query(DSADetail)
        .filter(DSADetail.id == dsa_id, DSADetail.deleted_at.is_(None))
        .first()
    )

    if not dsa:
        raise HTTPException(status_code=404, detail="DSA not found")

    dsa.deleted_at = datetime.utcnow()
    db.commit()

    return {"message": "DSA deleted successfully"}


def filter_dsa_search_service(
    db: Session,
    dsa_search_filter: DSA_filter_search_query
):
    query = (
        db.query(DSADetail)
        .options(
            joinedload(DSADetail.bank),
            joinedload(DSADetail.loan_type)
        )
        .filter(DSADetail.deleted_at.is_(None))
    )

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

    offset = (dsa_search_filter.page - 1) * dsa_search_filter.limit
    items = query.order_by(DSADetail.id.desc()).offset(offset).limit(dsa_search_filter.limit).all()

    return [
        DSAResponse(
            id=item.id,
            dsa_name=item.dsa_name or "",
            dsa_code=item.dsa_code or "",
            loan_type_id=item.loan_type_id or 0,
            bank_id=item.bank_id or 0,
            status=item.status,
            is_default=item.is_default or False,
            bank_name=item.bank.name if item.bank else "",
            loan_type_name=item.loan_type.name if item.loan_type else "",
        )
        for item in items
    ]
