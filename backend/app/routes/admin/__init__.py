# app/routes/admin/__init__.py
from fastapi import APIRouter

from .auth_routes import router as auth_router
from .application_routes import router as application_router
from .employee_routes import router as employee_router
from .common_routes import router as common_router
from .loan_types import router as loan_types_router
from .state_routes import router as state_router
from .city_routes import router as city_router
from .context_routes import router as context_router


router = APIRouter()

router.include_router(auth_router)
router.include_router(application_router)
router.include_router(employee_router)
router.include_router(common_router)
router.include_router(loan_types_router)
router.include_router(state_router)
router.include_router(city_router)
router.include_router(context_router)

