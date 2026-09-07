from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.phone_numbers import (
    PhoneNumber,
    PhoneNumberStatus,
)
from app.models.employees import Employee


def get_phone_numbers(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
):
    query = (
        db.query(PhoneNumber)
        .filter(
            PhoneNumber.deleted_at.is_(None)
        )
    )

    # ---------------------------------------------------------
    # OPTIONAL CONTEXT FILTER
    # ---------------------------------------------------------

    if context_id is not None:
        query = query.filter(
            PhoneNumber.employee_id == context_id
        )

    phone_numbers = (
        query
        .order_by(PhoneNumber.id.desc())
        .all()
    )

    result = []

    for phone_number in phone_numbers:

        assigned_employee = phone_number.employee

        result.append({
            "id": phone_number.id,

            "number": phone_number.phone,

            "phone": phone_number.phone,

            "employeeId":
                phone_number.employee_id,

            "employeeName":
                assigned_employee.name
                if assigned_employee
                else None,

            "teamId":
                getattr(
                    assigned_employee,
                    "team_id",
                    None,
                )
                if assigned_employee
                else None,

            "teamName":
                getattr(
                    assigned_employee,
                    "team_name",
                    None,
                )
                if assigned_employee
                else None,

            "status":
                "Active"
                if phone_number.status ==
                    PhoneNumberStatus.active
                else "Inactive",

            "trackable":
                phone_number.trackable ==
                PhoneNumberStatus.active,

            "assignedAt":
                phone_number.created_at,

            "createdAt":
                phone_number.created_at,

            "updatedAt":
                phone_number.updated_at,

            "assignmentHistory": [],
        })

    return result


def create_phone_number(
    db: Session,
    employee: Employee,
    data: dict,
):
    phone = data.get("number") or data.get("phone")
    employee_id = data.get("employeeId")
    status = data.get("status", "Active")
    trackable = data.get("trackable", False)

    # ---------------------------------------------------------
    # VALIDATION
    # ---------------------------------------------------------

    if not phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number is required.",
        )

    if not employee_id:
        raise HTTPException(
            status_code=400,
            detail="Employee is required.",
        )

    if not phone.isdigit() or len(phone) != 10:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid 10-digit phone number.",
        )

    # ---------------------------------------------------------
    # CHECK EMPLOYEE
    # ---------------------------------------------------------

    assigned_employee = (
        db.query(Employee)
        .filter(
            Employee.id == int(employee_id)
        )
        .first()
    )

    if not assigned_employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found.",
        )

    # ---------------------------------------------------------
    # CHECK EXISTING PHONE
    # ---------------------------------------------------------

    existing_phone = (
        db.query(PhoneNumber)
        .filter(
            PhoneNumber.phone == phone,
            PhoneNumber.deleted_at.is_(None),
        )
        .first()
    )

    if existing_phone:
        raise HTTPException(
            status_code=409,
            detail="Phone number already exists.",
        )

    # ---------------------------------------------------------
    # CHECK EMPLOYEE ALREADY HAS NUMBER
    # ---------------------------------------------------------

    existing_employee_number = (
        db.query(PhoneNumber)
        .filter(
            PhoneNumber.employee_id ==
                int(employee_id),
            PhoneNumber.deleted_at.is_(None),
        )
        .first()
    )

    if existing_employee_number:
        raise HTTPException(
            status_code=409,
            detail="This employee already has a phone number.",
        )

    # ---------------------------------------------------------
    # CONVERT STATUS
    # ---------------------------------------------------------

    phone_status = (
        PhoneNumberStatus.active
        if status == "Active"
        else PhoneNumberStatus.inactive
    )

    trackable_status = (
        PhoneNumberStatus.active
        if trackable is True
        else PhoneNumberStatus.inactive
    )

    # ---------------------------------------------------------
    # CREATE
    # ---------------------------------------------------------

    phone_number = PhoneNumber(
        employee_id=int(employee_id),
        phone=phone,
        status=phone_status,
        trackable=trackable_status,
    )

    db.add(phone_number)
    db.commit()
    db.refresh(phone_number)

    return phone_number


def update_phone_number(
    db: Session,
    employee: Employee,
    phone_number_id: int,
    data: dict,
):
    phone_number = (
        db.query(PhoneNumber)
        .filter(
            PhoneNumber.id == phone_number_id,
            PhoneNumber.deleted_at.is_(None),
        )
        .first()
    )

    if not phone_number:
        raise HTTPException(
            status_code=404,
            detail="Phone number not found.",
        )

    # ---------------------------------------------------------
    # PHONE
    # ---------------------------------------------------------

    phone = data.get("number")

    if phone is not None:

        phone = phone.strip()

        if not phone.isdigit() or len(phone) != 10:
            raise HTTPException(
                status_code=400,
                detail="Please enter a valid 10-digit phone number.",
            )

        duplicate = (
            db.query(PhoneNumber)
            .filter(
                PhoneNumber.phone == phone,
                PhoneNumber.id != phone_number_id,
                PhoneNumber.deleted_at.is_(None),
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=409,
                detail="Phone number already exists.",
            )

        phone_number.phone = phone

    # ---------------------------------------------------------
    # EMPLOYEE
    # ---------------------------------------------------------

    employee_id = data.get("employeeId")

    if employee_id is not None:

        assigned_employee = (
            db.query(Employee)
            .filter(
                Employee.id == int(employee_id)
            )
            .first()
        )

        if not assigned_employee:
            raise HTTPException(
                status_code=404,
                detail="Employee not found.",
            )

        duplicate_employee = (
            db.query(PhoneNumber)
            .filter(
                PhoneNumber.employee_id ==
                    int(employee_id),
                PhoneNumber.id != phone_number_id,
                PhoneNumber.deleted_at.is_(None),
            )
            .first()
        )

        if duplicate_employee:
            raise HTTPException(
                status_code=409,
                detail="This employee already has a phone number.",
            )

        phone_number.employee_id = int(employee_id)

    # ---------------------------------------------------------
    # STATUS
    # ---------------------------------------------------------

    if data.get("status") is not None:

        phone_number.status = (
            PhoneNumberStatus.active
            if data["status"] == "Active"
            else PhoneNumberStatus.inactive
        )

    # ---------------------------------------------------------
    # TRACKABLE
    # ---------------------------------------------------------

    if data.get("trackable") is not None:

        phone_number.trackable = (
            PhoneNumberStatus.active
            if data["trackable"] is True
            else PhoneNumberStatus.inactive
        )

    db.commit()
    db.refresh(phone_number)

    return phone_number