from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class BehaviorLogBase(BaseModel):
    work_intensity: int
    focus_quality: int
    screen_time_hours: Optional[float] = None

class BehaviorLogCreate(BehaviorLogBase):
    pass

class BehaviorLog(BehaviorLogBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True

class SleepLogBase(BaseModel):
    hours: float
    quality: int

class SleepLogCreate(SleepLogBase):
    pass

class SleepLog(SleepLogBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True

class MoodEntryBase(BaseModel):
    score: int
    energy_level: int
    note: Optional[str] = None

class MoodEntryCreate(MoodEntryBase):
    pass

class MoodEntry(MoodEntryBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True

class DailySummary(BaseModel):
    behavior: Optional[BehaviorLog] = None
    sleep: Optional[SleepLog] = None
    mood: Optional[MoodEntry] = None
