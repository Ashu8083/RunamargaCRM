from sqlalchemy.orm import Session


from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.bank import Bank
from app.schemas.bank_schema import (
    BankCreateRequest,
    UpdateBankRequest,
    BankFilterSearchRequest,
)


def create_bank_service(
    db: Session,
    bank_data: BankCreateRequest,
):
    bank = Bank(
        name=bank_data.name,
        is_active=bank_data.is_active,
    )

    db.add(bank)
    db.commit()
    db.refresh(bank)

    return bank


def search_filter_bank_service(
    db: Session,
    bank_filter: BankFilterSearchRequest,
):
    query = db.query(Bank)

    # Don't show soft-deleted records
    query = query.filter(
        Bank.deleted_at.is_(None)
    )

    if bank_filter.name:
        search = f"%{bank_filter.name}%"
        query = query.filter(
            Bank.name.ilike(search)
        )
    if bank_filter.is_active is not None:

        query = query.filter(
            Bank.is_active == bank_filter.is_active
        )
    return query.all()


def update_bank_service(
    db: Session,
    bank_data: UpdateBankRequest,
):
    query = select(Bank).where(
        Bank.id == bank_data.id
    )
    result = db.execute(query)
    bank = result.scalar_one_or_none()
    if bank is None:
        return None
    bank.name = bank_data.name
    bank.is_active = bank_data.is_active

    db.commit()
    db.refresh(bank)
    return bank


def soft_delete_bank_service(
    db: Session,
    bank_id: int,
):
    query = select(Bank).where(
        Bank.id == bank_id
    )
    result = db.execute(query)
    bank = result.scalar_one_or_none()
    if bank is None:
        return None
    bank.is_active = False
    bank.deleted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(bank)

    return bank