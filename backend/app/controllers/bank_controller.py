from sqlalchemy.orm import Session

from app.models import Employee
from app.schemas.DSA_schema import DSA_filter_search_query
from app.services.bank_service import BankCreateRequest


def create_bank_controller(
        db_session: Session,
        bank_create_schema : BankCreateRequest,
        employee : Employee
):
    return

def update_bank_controller(
        db_session: Session,
        bank_update_schema: BankCreateRequest,
        employee : Employee
        ):
    return

def filter_bank_search_controller(
        db_session: Session,
        bank_search_filter: BankCreateRequest,
        employee : Employee
)

def delete_bank_controller(
        db_session: Session,
        bank_id : int,
        employee : Employee
):
    return