# backend/app/controllers/Dashboard/MonthlyTrendController.py

from sqlalchemy.orm import Session

from app.services.Dashboard.monthly_trend_service import (
    get_monthly_trend,
)


class MonthlyTrendController:

    @staticmethod
    async def get_monthly_trend(
        db: Session,
        employee,
        context_id: int | None = None,
        period: int = 3,
    ):
        return get_monthly_trend(
            db=db,
            employee=employee,
            context_id=context_id,
            period=period,
        )