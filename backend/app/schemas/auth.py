# backend/app/schemas/auth.py
from typing import Optional
from pydantic import BaseModel, EmailStr


class DeviceInfo(BaseModel):
    type: Optional[str] = None
    id: Optional[str] = None
    userAgent: Optional[str] = None
    platform: Optional[str] = None


class LocationInfo(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class RequestOTPRequest(BaseModel):
    emailId: EmailStr
    device: Optional[DeviceInfo] = None
    ipAddress: Optional[str] = None
    location: Optional[LocationInfo] = None


class VerifyOTPRequest(BaseModel):
    emailId: EmailStr
    otp: str
    deviceId: Optional[str] = None
    device: Optional[DeviceInfo] = None
    ipAddress: Optional[str] = None
    location: Optional[LocationInfo] = None