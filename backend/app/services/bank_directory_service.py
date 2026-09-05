from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from app.models.bank import Bank
from app.models.banker_directories import BankerDirectory
from app.models.banker_directory_asms import BankerDirectoryASM
from app.models.banker_directory_sms import BankerDirectorySM

from app.schemas.banker_directory_schema import (
    CreateBankerDirectoryRequest,
    BankerFilterSearchRequest,
)


# =========================================================
# CREATE
# =========================================================

def create_banker_directory(
    db: Session,
    banker_directory_schema: CreateBankerDirectoryRequest
):

    try:

        banker_directory = BankerDirectory(
            bank_id=banker_directory_schema.bank_id,
            loan_type_id=banker_directory_schema.loan_type_id,
            state_id=banker_directory_schema.state_id,
            city_id=banker_directory_schema.city_id,
            status=banker_directory_schema.status.value,
        )

        db.add(banker_directory)

        # Generate parent ID
        db.flush()

        # Create ASM records
        for asm in banker_directory_schema.asms:

            banker_directory_asm = BankerDirectoryASM(
                banker_directory_id=banker_directory.id,
                name=asm.name,
                contact=asm.contact,
                email=asm.email,
            )

            db.add(banker_directory_asm)

        # Create SM records
        for sm in banker_directory_schema.sms:

            banker_directory_sm = BankerDirectorySM(
                banker_directory_id=banker_directory.id,
                name=sm.name,
                contact=sm.contact,
                email=sm.email,
            )

            db.add(banker_directory_sm)

        db.commit()

        db.refresh(banker_directory)

        return banker_directory

    except Exception as e:

        db.rollback()
        raise e


# =========================================================
# GET BY ID
# =========================================================

def get_banker_directory(
    db: Session,
    banker_directory_id: int
):

    banker_directory = (
        db.query(BankerDirectory)
        .options(
            joinedload(BankerDirectory.asms),
            joinedload(BankerDirectory.sms),
        )
        .filter(
            BankerDirectory.id == banker_directory_id,
            BankerDirectory.deleted_at.is_(None),
        )
        .first()
    )

    if not banker_directory:
        raise HTTPException(
            status_code=404,
            detail="Banker directory not found"
        )

    return banker_directory


# =========================================================
# UPDATE
# =========================================================

def update_banker_directory(
    db: Session,
    banker_directory_id: int,
    banker_directory_schema: CreateBankerDirectoryRequest
):

    try:

        # -----------------------------------------
        # Find existing parent
        # -----------------------------------------

        banker_directory = (
            db.query(BankerDirectory)
            .filter(
                BankerDirectory.id == banker_directory_id,
                BankerDirectory.deleted_at.is_(None),
            )
            .first()
        )

        if not banker_directory:
            raise HTTPException(
                status_code=404,
                detail="Banker directory not found"
            )

        # -----------------------------------------
        # Update parent
        # -----------------------------------------

        banker_directory.bank_id = banker_directory_schema.bank_id
        banker_directory.loan_type_id = (
            banker_directory_schema.loan_type_id
        )
        banker_directory.state_id = (
            banker_directory_schema.state_id
        )
        banker_directory.city_id = (
            banker_directory_schema.city_id
        )
        banker_directory.status = (
            banker_directory_schema.status.value
        )

        # -----------------------------------------
        # Update ASM records
        #
        # Simple approach:
        # Delete old child records and recreate them
        # -----------------------------------------

        db.query(BankerDirectoryASM).filter(
            BankerDirectoryASM.banker_directory_id
            == banker_directory_id
        ).delete(synchronize_session=False)

        for asm in banker_directory_schema.asms:

            banker_directory_asm = BankerDirectoryASM(
                banker_directory_id=banker_directory_id,
                name=asm.name,
                contact=asm.contact,
                email=asm.email,
            )

            db.add(banker_directory_asm)

        # -----------------------------------------
        # Update SM records
        # -----------------------------------------

        db.query(BankerDirectorySM).filter(
            BankerDirectorySM.banker_directory_id
            == banker_directory_id
        ).delete(synchronize_session=False)

        for sm in banker_directory_schema.sms:

            banker_directory_sm = BankerDirectorySM(
                banker_directory_id=banker_directory_id,
                name=sm.name,
                contact=sm.contact,
                email=sm.email,
            )

            db.add(banker_directory_sm)

        # -----------------------------------------
        # Commit
        # -----------------------------------------

        db.commit()

        db.refresh(banker_directory)

        return banker_directory

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        raise e


# =========================================================
# SOFT DELETE
# =========================================================

def delete_banker_directory(
    db: Session,
    banker_directory_id: int
):

    banker_directory = (
        db.query(BankerDirectory)
        .filter(
            BankerDirectory.id == banker_directory_id,
            BankerDirectory.deleted_at.is_(None),
        )
        .first()
    )

    if not banker_directory:
        raise HTTPException(
            status_code=404,
            detail="Banker directory not found"
        )

    banker_directory.deleted_at = datetime.utcnow()

    db.commit()

    return {
        "message": "Banker directory deleted successfully"
    }


# =========================================================
# FILTER / SEARCH
# =========================================================

def filter_search_banker_directory(
    db: Session,
    filter_data: BankerFilterSearchRequest
):
    query = (
        db.query(BankerDirectory)
        .options(
            joinedload(BankerDirectory.bank),
            joinedload(BankerDirectory.loan_type),
            joinedload(BankerDirectory.state),
            joinedload(BankerDirectory.city),
            joinedload(BankerDirectory.asms),
            joinedload(BankerDirectory.sms),
        )
        .filter(
            BankerDirectory.deleted_at.is_(None)
        )
    )
    # =====================================================
    # 1. SEARCH

    # Bank / ASM / SM / Contact / Email
    # =====================================================
    if filter_data.search:
        search = f"%{filter_data.search}%"
        query = (
            query
            .outerjoin(
                Bank,
                Bank.id == BankerDirectory.bank_id
            )
            .outerjoin(
                BankerDirectoryASM,
                BankerDirectoryASM.banker_directory_id
                == BankerDirectory.id
            )
            .outerjoin(
                BankerDirectorySM,
                BankerDirectorySM.banker_directory_id
                == BankerDirectory.id
            )
            .filter(
                (Bank.name.ilike(search))
                |
                (BankerDirectoryASM.name.ilike(search))
                |
                (BankerDirectoryASM.contact.ilike(search))
                |
                (BankerDirectoryASM.email.ilike(search))
                |
                (BankerDirectorySM.name.ilike(search))
                |
                (BankerDirectorySM.contact.ilike(search))
                |
                (BankerDirectorySM.email.ilike(search))
            )
            .distinct()
        )
    # =====================================================
    # 2. STATE
    # =====================================================
    if filter_data.state_id is not None:
        query = query.filter(
            BankerDirectory.state_id
            == filter_data.state_id
        )
    # =====================================================
    # 3. CITY
    # =====================================================

    if filter_data.city_id is not None:

        query = query.filter(
            BankerDirectory.city_id
            == filter_data.city_id
        )
    # =====================================================
    # 4. BANK
    # =====================================================
    if filter_data.bank_id is not None:
        query = query.filter(
            BankerDirectory.bank_id
            == filter_data.bank_id
        )
    # =====================================================
    # 5. LOAN TYPE
    # =====================================================
    if filter_data.loan_type_id is not None:
        query = query.filter(
            BankerDirectory.loan_type_id
            == filter_data.loan_type_id
        )
    # =====================================================
    # PAGINATION
    # =====================================================
    offset = (
        (filter_data.page - 1)
        * filter_data.limit
    )
    query = (
        query
        .offset(offset)
        .limit(filter_data.limit)
    )
    return query.all()