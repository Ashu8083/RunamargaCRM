# backend\app\routes\admin\websockets\__init__.py

from fastapi import APIRouter

from .team_chat import router as team_chat_router
from .reminder_websocket import router as reminder_websocket_router

router = APIRouter()

router.include_router(team_chat_router)
router.include_router(reminder_websocket_router)