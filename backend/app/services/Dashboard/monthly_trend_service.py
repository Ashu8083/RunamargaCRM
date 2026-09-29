# backend/app/services/Dashboard/monthly_trend_service.py

from datetime import date
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.bank_processings import BankProcessing
from app.models.loan_applications import LoanApplication
from app.services.Loans.application_service import ApplicationService


MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]


def get_monthly_trend(
    db: Session,
    employee,
    context_id: Optional[int] = None,
    period: int = 3,
):
    """
    Return month-wise disbursed application count and amount.

    Rules:
    - Each LoanApplication is counted only once per month.
    - Disbursed data comes from BankProcessing.
    - Month is determined by BankProcessing.disbursed_at.
    - Count uses distinct LoanApplication IDs.
    - Amount sums all active disbursement records in the month.
    - Existing ApplicationService RBAC scope is preserved.
    """

    try:
        month_count = int(period)
    except (TypeError, ValueError):
        month_count = 3

    if month_count not in {3, 6, 12}:
        month_count = 3

    if context_id is None:
        raise HTTPException(
            status_code=400,
            detail="context_id is required.",
        )

    today = date.today()

    current_year = today.year
    current_month = today.month

    month_keys = []

    for offset in range(month_count - 1, -1, -1):
        month_index = current_month - offset
        year = current_year

        while month_index <= 0:
            month_index += 12
            year -= 1

        month_keys.append(
            (year, month_index)
        )

    first_year, first_month = month_keys[0]

    range_start = date(
        first_year,
        first_month,
        1,
    )

    if current_month == 12:
        range_end = date(
            current_year + 1,
            1,
            1,
        )
    else:
        range_end = date(
            current_year,
            current_month + 1,
            1,
        )

    applications_query = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.deleted_at.is_(None),
        )
    )

    applications_query = ApplicationService.apply_scope(
        query=applications_query,
        db=db,
        employee=employee,
        context_id=context_id,
    )

    scoped_applications = (
        applications_query
        .with_entities(
            LoanApplication.id.label("loan_id"),
        )
        .subquery()
    )

    rows = (
        db.query(
            func.extract(
                "year",
                BankProcessing.disbursed_at,
            ).label("year"),
            func.extract(
                "month",
                BankProcessing.disbursed_at,
            ).label("month"),
            func.count(
                func.distinct(BankProcessing.loan_id)
            ).label("count"),
            func.coalesce(
                func.sum(
                    BankProcessing.disbursement_amount
                ),
                0,
            ).label("amount"),
        )
        .join(
            scoped_applications,
            scoped_applications.c.loan_id
            == BankProcessing.loan_id,
        )
        .filter(
            BankProcessing.deleted_at.is_(None),
            func.lower(
                BankProcessing.status
            ) == "disbursed",
            BankProcessing.disbursed_at.isnot(None),
            BankProcessing.disbursed_at >= range_start,
            BankProcessing.disbursed_at < range_end,
        )
        .group_by(
            func.extract(
                "year",
                BankProcessing.disbursed_at,
            ),
            func.extract(
                "month",
                BankProcessing.disbursed_at,
            ),
        )
        .order_by(
            func.extract(
                "year",
                BankProcessing.disbursed_at,
            ),
            func.extract(
                "month",
                BankProcessing.disbursed_at,
            ),
        )
        .all()
    )

    grouped_data = {}

    for year, month in month_keys:
        grouped_data[(year, month)] = {
            "month": MONTH_NAMES[month - 1],
            "shortMonth": MONTH_NAMES[month - 1][:3],
            "status": "Disbursed",
            "count": 0,
            "amount": 0,
        }

    for row in rows:
        year = int(row.year)
        month = int(row.month)

        month_key = (year, month)

        if month_key not in grouped_data:
            continue

        grouped_data[month_key]["count"] = int(
            row.count or 0
        )

        grouped_data[month_key]["amount"] = float(
            row.amount or 0
        )

    data = [
        grouped_data[month_key]
        for month_key in month_keys
    ]

    total_applications = sum(
        item["count"]
        for item in data
    )

    total_amount = sum(
        item["amount"]
        for item in data
    )

    return {
        "data": data,
        "status": "Disbursed",
        "period": month_count,
        "totalApplications": total_applications,
        "totalAmount": total_amount,
    }