from pydantic import BaseModel


class DeviceCodeResponse(BaseModel):
    user_code: str
    device_code: str
    verification_uri: str
    expires_in: int
    interval: int
    message: str
