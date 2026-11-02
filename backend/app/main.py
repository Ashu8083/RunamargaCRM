
# backend/app/main.py

import asyncio
import importlib
import logging
import pkgutil
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.database_triggers.runner import apply_database_triggers
from app import listeners as listeners_package
from app.core.request_gate import request_gate
from app.routes.admin import router as admin_router
from app.routes.admin.websockets import router as websocket_router
from app.routes.api import router as api_router


logger = logging.getLogger(__name__)


async def start_registered_listeners() -> list[asyncio.Task]:
    """Discover and start all async functions named listen_*."""
    tasks: list[asyncio.Task] = []

    for module_info in pkgutil.iter_modules(
        listeners_package.__path__,
        prefix=f"{listeners_package.__name__}.",
    ):
        module = importlib.import_module(module_info.name)

        for name in dir(module):
            if not name.startswith("listen_"):
                continue

            listener = getattr(module, name)

            if not asyncio.iscoroutinefunction(listener):
                logger.warning(
                    "Skipping non-async listener: %s.%s",
                    module_info.name,
                    name,
                )
                continue

            task = asyncio.create_task(
                listener(),
                name=f"listener:{module_info.name}.{name}",
            )
            tasks.append(task)

            logger.info(
                "Registered listener: %s.%s",
                module_info.name,
                name,
            )

    return tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    listener_tasks: list[asyncio.Task] = []

    try:
        # Install/update database triggers before listeners start.
        await asyncio.to_thread(apply_database_triggers)

        # Discover listeners automatically; no per-listener imports here.
        listener_tasks = await start_registered_listeners()
        app.state.listener_tasks = listener_tasks

        logger.info("Application startup completed")
        yield

    finally:
        for task in listener_tasks:
            task.cancel()

        if listener_tasks:
            await asyncio.gather(
                *listener_tasks,
                return_exceptions=True,
            )

        logger.info("Application listener shutdown completed")


app = FastAPI(
    title="Runamarga CRM API",
    lifespan=lifespan,
)
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# ============================================================
# GLOBAL HTTP REQUEST LOAD CONTROL
# ============================================================

@app.middleware("http")
async def control_request_load(
    request: Request,
    call_next,
):
    path = request.url.path

    # Preserve static upload serving without entering the API gate.
    if path == "/uploads" or path.startswith("/uploads/"):
        return await call_next(request)

    # Admin router is mounted under /api.
    # Other HTTP endpoints, including /android, use normal priority.
    is_admin = path == "/api" or path.startswith("/api/")

    admitted = await request_gate.acquire(
        is_admin=is_admin,
    )

    if not admitted:
        logger.warning(
            "Request rejected by load gate: method=%s path=%s",
            request.method,
            path,
        )

        return JSONResponse(
            status_code=503,
            content={
                "detail": "Server is busy. Please retry shortly."
            },
            headers={"Retry-After": "3"},
        )

    try:
        return await call_next(request)
    finally:
        await request_gate.release(
            is_admin=is_admin,
        )


# ============================================================
# STATIC FILES
# ============================================================

app.mount(
    "/uploads",
    StaticFiles(
        directory=Path(__file__).resolve().parent
        / "static"
        / "uploads",
    ),
    name="uploads",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTES
# ============================================================

app.include_router(
    admin_router,
    prefix="/api",
)

app.include_router(
    api_router,
    prefix="/android",
)

app.include_router(
    websocket_router,
)
