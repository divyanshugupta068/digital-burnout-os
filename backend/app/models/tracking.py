from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String, Text, Boolean
from sqlalchemy.sql import func
from .base import Base

class BehaviorLog(Base):
    __tablename__ = "behavior_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Work metrics
    work_hours = Column(Float, nullable=True)
    screen_time_hours = Column(Float, nullable=True)
    focus_score = Column(Integer, nullable=True)  # 1-5
    energy_level = Column(Integer, nullable=True)  # 1-5
    motivation_level = Column(Integer, nullable=True)  # 1-5
    breaks_taken = Column(Integer, nullable=True)
    meetings_count = Column(Integer, nullable=True)
    
    # Lifestyle
    exercise_minutes = Column(Integer, nullable=True)
    caffeine_cups = Column(Integer, nullable=True)
    water_glasses = Column(Integer, nullable=True)
    social_interactions = Column(Integer, nullable=True)
    
    # Physical symptoms
    has_headache = Column(Boolean, default=False)
    has_eye_strain = Column(Boolean, default=False)
    has_back_pain = Column(Boolean, default=False)
    has_fatigue = Column(Boolean, default=False)
    
    # Legacy fields for compatibility
    work_intensity = Column(Integer, nullable=True)  # 1-5
    focus_quality = Column(Integer, nullable=True)  # 1-5

class SleepLog(Base):
    __tablename__ = "sleep_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    hours = Column(Float)
    quality = Column(Integer)  # 1-5

class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Integer)  # 1-5 mood
    stress_level = Column(Integer, nullable=True)  # 1-5
    anxiety_level = Column(Integer, nullable=True)  # 1-5
    energy_level = Column(Integer, nullable=True)  # 1-5 (legacy)
    notes = Column(Text, nullable=True)
    note = Column(Text, nullable=True)  # Legacy field

class BurnoutScore(Base):
    __tablename__ = "burnout_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Float)  # 0-100
    risk_level = Column(String)  # Safe, Warning, High Risk
    drivers = Column(Text)  # Comma-separated drivers

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    content = Column(Text)
    category = Column(String)  # Sleep, Work, Stress
    is_read = Column(Boolean, default=False)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    message = Column(Text)
    severity = Column(String)  # Info, Warning, Critical
    is_dismissed = Column(Boolean, default=False)
