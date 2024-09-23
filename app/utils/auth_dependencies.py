import os
from dotenv import load_dotenv
from fastapi import Request
from app.models.user_models import CurrentContextUser
from jose import jwt

from app.utils.constants import AUTHORIZATION

load_dotenv()

SECRET_KEY: str = os.getenv("JWT_SECRET")  # type: ignore
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300  # 3 hours


def __verify_jwt(token: str):
    token = token.replace("Bearer ", "")
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_sub": True})  # type: ignore
    user = payload.get("sub")
    if user:
        cur_user = CurrentContextUser()
        cur_user.username = str(user)
        return cur_user


async def verify_auth_token(request: Request):
    if (
        "login" not in request.url.path
        and "refresh" not in request.url.path
        and "admin" in request.url.path
    ):
        auth: str = request.headers.get(AUTHORIZATION) or ""
        try:
            token = auth.strip().rsplit(".", 1)[0]
            request.state.user = __verify_jwt(token=token)
        except Exception:
            request.state.user = __verify_jwt(token=auth)


###################################################################################
#                 MS Graph Configurations                                         #
###################################################################################
# Application (client) ID of app registration
CLIENT_ID = os.getenv("CLIENT_ID")
# Application's generated client secret: never check this into source control!
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

# AUTHORITY = "https://login.microsoftonline.com/common"  # For multi-tenant app
AUTHORITY = f"https://login.microsoftonline.com/{os.getenv('TENANT_ID', 'common')}"

REDIRECT_PATH = "/getAToken"  # Used for forming an absolute URL to your redirect URI.
# The absolute URL must match the redirect URI you set
# in the app's registration in the Azure portal.

# You can find more Microsoft Graph API endpoints from Graph Explorer
# https://developer.microsoft.com/en-us/graph/graph-explorer
ENDPOINT = 'https://graph.microsoft.com/v1.0/users'  # This resource requires no admin consent

# You can find the proper permission names from this document
# https://docs.microsoft.com/en-us/graph/permissions-reference
SCOPE = ["User.ReadBasic.All"]