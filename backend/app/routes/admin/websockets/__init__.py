# backend/app/routes/admin/websockets/__init__.py

from fastapi import APIRouter

from .team_chat import router as team_chat_router
# from .another_socket import router as another_socket_router
# from .notifications import router as notifications_router

router = APIRouter()

router.include_router(team_chat_router)
# router.include_router(another_socket_router)
# router.include_router(notifications_router)