import os
from dotenv import load_dotenv
from fastapi import Request

load_dotenv()
SECRET_KEY: str = os.getenv("JWT_SECRET")  # type: ignore
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300  # 3 hours
###################################################################################
#                 MS Graph Configurations                                         #
###################################################################################
AZURE_CLIENT_ID = os.getenv("AZURE_CLIENT_ID")
AZURE_CLIENT_SECRET = os.getenv("AZURE_CLIENT_SECRET")
AUTHORITY = f"https://login.microsoftonline.com/{os.getenv('AZURE_TENANT_ID')}"
getAToken_PATH = "/getAToken"  

# You can find more Microsoft Graph API endpoints from Graph Explorer
# https://developer.microsoft.com/en-us/graph/graph-explorer
ENDPOINT = 'https://graph.microsoft.com/v1.0/users'
SCOPES = ["User.ReadBasic.All"]