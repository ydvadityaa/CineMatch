"""CineMatch FastAPI application factory.

Loads the movie CSV once at startup, registers CORS, health and movie
routes, and exposes the ``app`` object imported by ``server.py``.
"""
from __future__ import annotations

import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.movies import router as movies_router
from app.models.movie import HealthResponse
from app.services.movie_service import get_service, init_service

ROOT_DIR = Path(__file__).resolve().parent.parent  # /app/backend
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("cinematch")


def _resolve_csv_path() -> Path:
    """Allow overriding the CSV path via env, default to backend/data/."""
    custom = os.environ.get("MOVIES_CSV_PATH")
    if custom:
        return Path(custom)
    return ROOT_DIR / "data" / "movies_cleaned_final.csv"


def create_app() -> FastAPI:
    app = FastAPI(
        title="CineMatch API",
        description="Backend foundation for the CineMatch movie recommendation app.",
        version="0.1.0",
    )

    cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in cors_origins if o.strip()] or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def _load_dataset() -> None:
        csv_path = _resolve_csv_path()
        logger.info("Initialising MovieService (csv=%s)", csv_path)
        init_service(csv_path)

    @app.get("/health", response_model=HealthResponse, tags=["system"])
    def health() -> HealthResponse:
        try:
            count = get_service().count()
            return HealthResponse(
                status="ok",
                message="CineMatch API is running",
                movies_loaded=count,
            )
        except RuntimeError:
            return HealthResponse(
                status="starting",
                message="CineMatch API is starting; dataset not loaded yet",
                movies_loaded=0,
            )

    @app.get("/api/health", response_model=HealthResponse, tags=["system"])
    def api_health() -> HealthResponse:
        """Ingress-friendly alias of ``/health`` (served under the /api prefix)."""
        return health()

    app.include_router(movies_router)
    return app


app = create_app()
