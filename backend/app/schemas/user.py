from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    email: EmailStr
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None
    baseline_sleep_hours: Optional[float] = None
    work_hours_goal: Optional[float] = None
    primary_stress_source: Optional[str] = None
    goal: Optional[str] = None

class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserOnboarding(BaseModel):
    baseline_sleep_hours: float
    work_hours_goal: float
    primary_stress_source: str
    goal: str
