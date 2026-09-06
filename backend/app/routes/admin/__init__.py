# app/routes/admin/__init__.py
from fastapi import APIRouter

from .auth_routes import router as auth_router
from .application_routes import router as application_router
from .employee_routes import router as employee_router
from .common_routes import router as common_router
from .state_routes import router as state_router
from .city_routes import router as city_router
from .context_routes import router as context_router
from .team_leads_routes import router as team_leads_router
from .agents_routes import router as agents_router


router = APIRouter()

router.include_router(auth_router)
router.include_router(application_router)
router.include_router(employee_router)
router.include_router(common_router)
router.include_router(state_router)
router.include_router(city_router)
router.include_router(context_router)
router.include_router(team_leads_router)
router.include_router(agents_router)

