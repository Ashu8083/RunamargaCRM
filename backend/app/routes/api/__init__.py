# backend/app/routes/api/__init__.py

from fastapi import APIRouter

# Auth routes
from app.routes.api.auth_routes import router as auth_router

# Attendance routes
from app.routes.api.attendance.attendance_routes import router as attendance_router


router = APIRouter()

# Auth routes
router.include_router(auth_router)

# Attendance routes
router.include_router(attendance_router)
