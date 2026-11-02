"""Uvicorn entry point for launches from the repository root."""

import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.main import app  # noqa: E402


__all__ = ["app"]
