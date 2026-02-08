from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class TrendPoint(BaseModel):
    date: datetime
    score: float

class CorrelationPoint(BaseModel):
    x: float
    y: float
    label: Optional[str] = None

class AnalyticsDashboard(BaseModel):
    current_score: float
    risk_level: str
    drivers: List[str]
    trend: List[TrendPoint]
    correlations: dict # e.g. {"sleep_vs_mood": [...]}
