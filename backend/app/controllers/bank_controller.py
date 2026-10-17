from sqlalchemy.orm import Session
from fastapi import HTTPException

# from app.models import Employee

from app.schemas.bank_schema import (
    BankCreateRequest,
    UpdateBankRequest,
    BankFilterSearchRequest,
)

from app.services.bank_service import (
    create_bank_service,
    update_bank_service,
    search_filter_bank_service,
    soft_delete_bank_service,
)


def create_bank_controller(
    db_session: Session,
    bank_create_schema: BankCreateRequest,
    # employee: Employee,
):
    bank = create_bank_service(
        db=db_session,
        bank_data=bank_create_schema,
    )

    if not bank:
        raise HTTPException(
            status_code=404,
            detail="Bank profile cannot be created",

        )
    return bank

def update_bank_controller(
    db_session: Session,
    bank_update_schema: UpdateBankRequest,
    # employee: Employee,
):
    bank = update_bank_service(
        db=db_session,
        bank_data=bank_update_schema,
    )

    if bank is None:
        raise HTTPException(
            status_code=404,
            detail="Bank not found",
        )

    return bank


def filter_bank_search_controller(
    db_session: Session,
    bank_search_filter: BankFilterSearchRequest,
    # employee: Employee,
):

    banks = search_filter_bank_service(
        db=db_session,
        bank_filter=bank_search_filter,
    )
    return banks or []

def delete_bank_controller(
    db_session: Session,
    bank_id: int,
    # employee: Employee,
):
    bank = soft_delete_bank_service(
        db=db_session,
        bank_id=bank_id,
    )

    if bank is None:
        raise HTTPException(
            status_code=404,
            detail="Bank not found",
        )

    return bank