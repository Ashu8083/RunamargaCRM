# backend/app/services/Dashboard/monthly_trend_service.py

from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.bank_processings import BankProcessing


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
    period: int = 3,
):
    """
    Return month-wise disbursed application count and amount.

    Only active bank-processing records with status='disbursed'
    are considered.

    Month is determined by disbursed_at.
    Amount is taken from disbursement_amount.
    """

    # ---------------------------------------------------------
    # NORMALIZE PERIOD
    # ---------------------------------------------------------

    try:
        month_count = int(period)
    except (TypeError, ValueError):
        month_count = 3

    if month_count not in {3, 6, 12}:
        month_count = 3

    # ---------------------------------------------------------
    # LAST N MONTHS
    # ---------------------------------------------------------

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

    month_key_set = set(month_keys)

    # ---------------------------------------------------------
    # DISBURSED BANK PROCESSINGS
    # ---------------------------------------------------------

    processings = (
        db.query(BankProcessing)
        .filter(
            BankProcessing.deleted_at.is_(None),
            BankProcessing.status == "disbursed",
            BankProcessing.disbursed_at.isnot(None),
        )
        .all()
    )

    # ---------------------------------------------------------
    # INITIALIZE MONTH DATA
    # ---------------------------------------------------------

    grouped_data = {}

    for year, month in month_keys:
        grouped_data[(year, month)] = {
            "month": MONTH_NAMES[month - 1],
            "shortMonth": MONTH_NAMES[month - 1][:3],
            "status": "Disbursed",
            "count": 0,
            "amount": 0,
        }

    # ---------------------------------------------------------
    # GROUP DISBURSEMENTS BY MONTH
    # ---------------------------------------------------------

    for processing in processings:

        disbursed_at = processing.disbursed_at

        month_key = (
            disbursed_at.year,
            disbursed_at.month,
        )

        if month_key not in month_key_set:
            continue

        grouped_data[month_key]["count"] += 1

        grouped_data[month_key]["amount"] += (
            processing.disbursement_amount or 0
        )

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

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