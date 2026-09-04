# app/routes/admin/__init__.py
from fastapi import APIRouter

from .auth_routes import router as auth_router
from .application_routes import router as application_router
from .employee_routes import router as employee_router
from .common_routes import router as common_router
router = APIRouter()

router.include_router(auth_router)
router.include_router(application_router)
router.include_router(employee_router)
router.include_router(common_router)

