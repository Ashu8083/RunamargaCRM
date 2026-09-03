# app/main.py
from fastapi import FastAPI
from app.routes.admin import router as admin_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI(
    title="Runamarga CRM API",
)
app.mount(
    "/uploads",
    StaticFiles(
        directory=Path(__file__).resolve().parent / "static" / "uploads"
    ),
    name="uploads",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------------
# ROUTES
# --------------------------------------------------------
app.include_router(admin_router,prefix="/api")


