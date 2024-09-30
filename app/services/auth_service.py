from dataclasses import dataclass
from fastapi import Depends
from pydantic import EmailStr
from sqlalchemy.orm import Session
from msal import PublicClientApplication
from app.entities.user import User
from app.models.auth_models import DeviceCodeResponse
from app.utils.auth_dependencies import AZURE_CLIENT_ID, AUTHORITY, SCOPES



@dataclass
class AuthService:
    def __init__(self):  
        self.msal_app = PublicClientApplication(
        client_id=AZURE_CLIENT_ID,
        authority=AUTHORITY,
        )

    def get_device_code(self):
        flow = self.msal_app.initiate_device_flow(scopes=SCOPES)
        if "user_code" not in flow:
            raise HTTPException(status_code=500, detail="Failed to create device flow")
        return DeviceCodeResponse(**flow)

    def get_token(self, device_code: str):
        flow = self.msal_app.initiate_device_flow(scopes=SCOPES)
        flow = {"device_code": device_code}
        result = self.msal_app.acquire_token_by_device_flow(flow)
        if "access_token" in result:
            return {"access_token": result["access_token"]}
        else:
            raise HTTPException(status_code=400, detail="Failed to acquire token")
