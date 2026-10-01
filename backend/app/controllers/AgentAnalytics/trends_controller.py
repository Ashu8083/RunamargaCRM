# backend\app\controllers\AgentAnalytics\trends_controller.py
import logging
from datetime import date
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.AgentAnalytics.trends_schema import (
    AgentAnalyticsTrendsResponse,
)
from app.services.AgentAnalytics.trends_service import (
    AgentAnalyticsTrendsService,
)


logger = logging.getLogger(__name__)


class AgentAnalyticsTrendsController:

    @staticmethod
    def get_trends(
        db: Session,
        employee: Employee,
        analytics_type: str = "agent",
        team_lead_context_id: Optional[int] = None,
        agent_context_id: Optional[int] = None,
        rm_context_id: Optional[int] = None,
        loan_type_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        context_id: Optional[int] = None,
    ) -> AgentAnalyticsTrendsResponse:

        try:
            return AgentAnalyticsTrendsService.get_trends(
                db=db,
                employee=employee,
                context_id=context_id,
                analytics_type=analytics_type,
                team_lead_context_id=team_lead_context_id,
                agent_context_id=agent_context_id,
                rm_context_id=rm_context_id,
                loan_type_id=loan_type_id,
                from_date=from_date,
                to_date=to_date,
            )

        except ValueError as exc:
            logger.warning(
                "Agent analytics trends validation error: %s",
                exc,
            )

            raise HTTPException(
                status_code=400,
                detail=str(exc),
            ) from exc

        except HTTPException:
            raise

        except Exception as exc:
            logger.exception(
                "Agent analytics trends failed"
            )

            raise HTTPException(
                status_code=500,
                detail="Failed to load agent analytics trends",
            ) from exc