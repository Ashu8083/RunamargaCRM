from fastapi import FastAPI

from app.routes.auth_routes import router as auth_router
from app.routes.application_routes import router as application_router
from app.routes.employee_routes import router as employee_router
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
app.include_router(auth_router)
app.include_router(application_router)
app.include_router(employee_router)

