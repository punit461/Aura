from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi import status
from app.models.auth_models import DeviceCodeResponse
from jose import jwt
from app.services.auth_service import AuthService

from app.utils.auth_dependencies import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    SECRET_KEY,
)
from app.utils.constants import USER_NOT_FOUND
from app.utils.project_dependencies import company_database

router = APIRouter(tags=["Authentication"])
auth = AuthService()

@router.post(
    "/api/device_code",
    response_model=DeviceCodeResponse,
    status_code=status.HTTP_200_OK,
)
async def get_device_code():
    return auth.get_device_code()

@router.post(
    "/api/token/{device_code}",
    status_code=status.HTTP_200_OK,
)
async def get_token(device_code: str):
    response = auth.get_token(device_code)
    return response