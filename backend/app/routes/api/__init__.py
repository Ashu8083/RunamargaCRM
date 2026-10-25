# backend/app/routes/api/__init__.py

from fastapi import APIRouter
# Auth routes
from app.routes.api.auth_routes import router as auth_router
# Attendance routes
from app.routes.api.attendance.attendance_routes import router as attendance_router
from app.routes.api.call_log_api import router as call_log_router
from app.routes.api.profile_api_routes import router as profile_api_router

router = APIRouter()

# Auth routes
router.include_router(auth_router)
# Attendance routes
router.include_router(attendance_router)
# Call logs Router
router.include_router(call_log_router)
router.include_router(profile_api_router)
