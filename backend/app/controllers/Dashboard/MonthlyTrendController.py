# backend/app/controllers/Dashboard/MonthlyTrendController.py

from sqlalchemy.orm import Session

from app.services.Dashboard.monthly_trend_service import (
    get_monthly_trend,
)


class MonthlyTrendController:

    @staticmethod
    async def get_monthly_trend(
        db: Session,
        period: int = 3,
    ):
        return get_monthly_trend(
            db=db,
            period=period,
        )