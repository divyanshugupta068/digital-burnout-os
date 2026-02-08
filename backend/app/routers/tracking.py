from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from ..core.deps import get_current_user
from ..core.database import get_db
from ..models.user import User
from ..models.tracking import BehaviorLog, SleepLog, MoodEntry
from ..services.burnout_engine import update_burnout_score

router = APIRouter()

# Extended schemas for daily logging

class SleepLogCreate(BaseModel):
    hours: float
    quality: int

class MoodEntryCreate(BaseModel):
    score: int
    stress_level: Optional[int] = None
    anxiety_level: Optional[int] = None
    notes: Optional[str] = None

class DailyLogCreate(BaseModel):
    # Work metrics
    work_hours: Optional[float] = None
    screen_time_hours: Optional[float] = None
    focus_score: Optional[int] = None
    energy_level: Optional[int] = None
    motivation_level: Optional[int] = None
    breaks_taken: Optional[int] = None
    meetings_count: Optional[int] = None
    
    # Lifestyle
    exercise_minutes: Optional[int] = None
    caffeine_cups: Optional[int] = None
    water_glasses: Optional[int] = None
    social_interactions: Optional[int] = None
    
    # Physical symptoms
    has_headache: Optional[bool] = False
    has_eye_strain: Optional[bool] = False
    has_back_pain: Optional[bool] = False
    has_fatigue: Optional[bool] = False


@router.post("/sleep")
def log_sleep(
    *,
    db: Session = Depends(get_db),
    log_in: SleepLogCreate,
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    log = SleepLog(
        user_id=current_user.id,
        hours=log_in.hours,
        quality=log_in.quality
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    update_burnout_score(db, current_user.id)
    return {"id": log.id, "hours": log.hours, "quality": log.quality}


@router.post("/mood")
def log_mood(
    *,
    db: Session = Depends(get_db),
    log_in: MoodEntryCreate,
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    log = MoodEntry(
        user_id=current_user.id,
        score=log_in.score,
        stress_level=log_in.stress_level,
        anxiety_level=log_in.anxiety_level,
        notes=log_in.notes
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    update_burnout_score(db, current_user.id)
    return {"id": log.id, "score": log.score, "stress_level": log.stress_level}


@router.post("/daily")
def log_daily(
    *,
    db: Session = Depends(get_db),
    log_in: DailyLogCreate,
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Log comprehensive daily behavior data"""
    log = BehaviorLog(
        user_id=current_user.id,
        work_hours=log_in.work_hours,
        screen_time_hours=log_in.screen_time_hours,
        focus_score=log_in.focus_score,
        energy_level=log_in.energy_level,
        motivation_level=log_in.motivation_level,
        breaks_taken=log_in.breaks_taken,
        meetings_count=log_in.meetings_count,
        exercise_minutes=log_in.exercise_minutes,
        caffeine_cups=log_in.caffeine_cups,
        water_glasses=log_in.water_glasses,
        social_interactions=log_in.social_interactions,
        has_headache=log_in.has_headache,
        has_eye_strain=log_in.has_eye_strain,
        has_back_pain=log_in.has_back_pain,
        has_fatigue=log_in.has_fatigue
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    update_burnout_score(db, current_user.id)
    return {
        "id": log.id,
        "work_hours": log.work_hours,
        "energy_level": log.energy_level,
        "focus_score": log.focus_score
    }


@router.post("/behavior")
def log_behavior(
    *,
    db: Session = Depends(get_db),
    log_in: DailyLogCreate,
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Legacy endpoint - redirects to daily"""
    return log_daily(db=db, log_in=log_in, current_user=current_user)


@router.delete("/today")
def delete_todays_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """Delete all logs for the current day"""
    from datetime import date
    today = date.today()

    # Generic function to delete by date for a model
    def delete_for_model(model):
        db.query(model).filter(
            model.user_id == current_user.id,
            func.date(model.date) == today
        ).delete(synchronize_session=False)

    delete_for_model(BehaviorLog)
    delete_for_model(SleepLog)
    delete_for_model(MoodEntry)
    
    db.commit()
    return {"message": "Today's logs cleared"}
