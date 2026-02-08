from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class BurnoutScoreBase(BaseModel):
    score: float
    risk_level: str
    drivers: str

class BurnoutScore(BurnoutScoreBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True

class RecommendationBase(BaseModel):
    content: str
    category: str

class Recommendation(RecommendationBase):
    id: int
    user_id: int
    date: datetime
    is_read: bool

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    message: str
    severity: str

class Alert(AlertBase):
    id: int
    user_id: int
    date: datetime
    is_dismissed: bool

    class Config:
        from_attributes = True
