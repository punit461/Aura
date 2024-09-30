import traceback
from fastapi import FastAPI, Request
from jose import JOSEError
from pydantic import ValidationError
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.connectors.database_connector import (
    TenantNotFoundError,
    build_db_session,
    get_master_database
)
from app.routes.route_entries import PROTECTED_ROUTES
from app.utils.constants import AUTHORIZATION
from fastapi import status
from fastapi import HTTPException
from fastapi.responses import JSONResponse


def setup_middlewares(app: FastAPI):
    # CORS middleware we are allowing api end points from any portal. because this api can be used with any portal as well as servers
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
    app.add_middleware(CreateTenentDbMiddleware)
