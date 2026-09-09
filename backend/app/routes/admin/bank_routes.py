from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.core.log_config import logger
from app.config.database import get_db
from app.core.security import get_current_employee
from app.dependency.get_access_control_dependency import check_permission


from app.schemas.bank_schema import (
    BankCreateRequest,
    UpdateBankRequest,
    BankFilterSearchRequest,
    BankResponse,
)

from app.controllers.bank_controller import (
    create_bank_controller,
    update_bank_controller,
    filter_bank_search_controller,
    delete_bank_controller,
)


router = APIRouter(
    prefix="/admin/banks",
    tags=["Banks"],
    dependencies=[Depends(get_current_employee)],
    responses={
        404: {"description": "Not found"}
    },

)


@router.post(
    "/",
    response_model=BankResponse,
)
def create_bank(
    bank_data: BankCreateRequest,
    permission_check=Depends(check_permission("banks:create")),
    db: Session = Depends(get_db),
):
    return create_bank_controller(
        db_session=db,
        bank_create_schema=bank_data,
        # employee=employee,
    )


@router.get(
    "/",
    response_model=list[BankResponse],
)
def filter_search_banks(
    bank_filter: BankFilterSearchRequest = Depends(),
    employee=Depends(check_permission("banks:create")),
    db: Session = Depends(get_db),

):
    return filter_bank_search_controller(
        db_session=db,
        bank_search_filter=bank_filter,
    )


@router.put(
    "/",
    response_model=BankResponse,
)
def update_bank(
    bank_data: UpdateBankRequest,
    employee=Depends(check_permission("banks:create")),
    db: Session = Depends(get_db),
    # employee: Employee = Depends(get_current_employee),
):
    logger.info("bank data update called :")
    logger.info(f"bank data : {bank_data}")

    return update_bank_controller(
        db_session=db,
        bank_update_schema=bank_data,
        # employee=employee,
    )


@router.delete(
    "/{bank_id}",
    response_model=BankResponse,
)
def delete_bank(
    bank_id: int,
    employee=Depends(check_permission("banks:create")),
    db: Session = Depends(get_db),
    # employee: Employee = Depends(get_current_employee),
):
    return delete_bank_controller(
        db_session=db,
        bank_id=bank_id,
        # employee=employee,
    )