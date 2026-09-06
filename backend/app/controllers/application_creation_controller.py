from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication
from app.models.loan_applications import LoanStatus


def create_application(
    db: Session,
    employee: Employee,
    payload,
):
    # Access-control validation will happen here
    # before creating the application.

    # ---------------------------------------------------------
    # Validate selected RM
    # ---------------------------------------------------------

    rm = (
        db.query(Employee)
        .filter(
            Employee.id == payload.rm_id,
            Employee.status == "active",
        )
        .first()
    )

    if not rm:
        raise HTTPException(
            status_code=404,
            detail="Relationship Manager not found",
        )

    # ---------------------------------------------------------
    # IMPORTANT:
    # Check whether logged-in employee can use this RM.
    # ---------------------------------------------------------

    # We will connect this to your AccessControl logic here.

    # ---------------------------------------------------------
    # Create application
    # ---------------------------------------------------------

    application = LoanApplication(
        name=payload.name,
        phone=payload.phone,
        gender=payload.gender,
        loan_type_id=payload.loan_type_id,
        loan_amt=payload.loan_amount,
        credit_score=payload.credit_score,
        loan_purpose=payload.loan_purpose,
        referral=payload.reference_name,
        rm_id=payload.rm_id,
        state_id=payload.state_id,
        city_id=payload.city_id,
        applied_by_id=employee.id,
        status=LoanStatus.inprocess,
        applied_date=date.today(),
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "success": True,
    "existing_loan": False,
        "message": "Loan application created successfully.",
        "data": {
            "id": application.id,
            "status": application.status.value,
        },
    }