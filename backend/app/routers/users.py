from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from ..core.deps import get_current_user
from ..core.database import get_db
from ..models.user import User
from ..schemas.user import User as UserSchema, UserUpdate, UserOnboarding

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(get_current_user),
) -> UserSchema:
    return current_user

@router.patch("/me", response_model=UserSchema)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
) -> UserSchema:
    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/onboarding", response_model=UserSchema)
def perform_onboarding(
    *,
    db: Session = Depends(get_db),
    onboarding_data: UserOnboarding,
    current_user: User = Depends(get_current_user),
) -> UserSchema:
    current_user.baseline_sleep_hours = onboarding_data.baseline_sleep_hours
    current_user.work_hours_goal = onboarding_data.work_hours_goal
    current_user.primary_stress_source = onboarding_data.primary_stress_source
    current_user.goal = onboarding_data.goal
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=204)
def delete_user_me(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.delete(current_user)
    db.commit()
    return None

@router.get("/me/export")
def export_user_data(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Export all user data in a format suitable for PDF generation"""
    from ..models.tracking import SleepLog, MoodEntry, BehaviorLog, BurnoutScore
    
    sleep_logs = db.query(SleepLog).filter(SleepLog.user_id == current_user.id).order_by(SleepLog.date.desc()).all()
    mood_entries = db.query(MoodEntry).filter(MoodEntry.user_id == current_user.id).order_by(MoodEntry.date.desc()).all()
    behavior_logs = db.query(BehaviorLog).filter(BehaviorLog.user_id == current_user.id).order_by(BehaviorLog.date.desc()).all()
    burnout_scores = db.query(BurnoutScore).filter(BurnoutScore.user_id == current_user.id).order_by(BurnoutScore.date.desc()).all()
    
    # Serialize SQLAlchemy objects to dicts
    def serialize_sleep(log: SleepLog) -> Dict:
        return {
            "date": str(log.date),
            "hours": log.hours,
            "quality": log.quality
        }
    
    def serialize_mood(entry: MoodEntry) -> Dict:
        return {
            "date": str(entry.date),
            "score": entry.score,
            "notes": entry.notes
        }
    
    def serialize_behavior(log: BehaviorLog) -> Dict:
        return {
            "date": str(log.date),
            "screen_time_hours": log.screen_time_hours,
            "work_hours": log.work_hours,
            "focus_score": log.focus_score,
            "energy_level": log.energy_level
        }
    
    def serialize_score(score: BurnoutScore) -> Dict:
        return {
            "date": str(score.date),
            "score": score.score,
            "risk_level": score.risk_level,
            "drivers": score.drivers
        }
    
    return {
        "user": {
            "email": current_user.email,
            "full_name": current_user.full_name,
            "onboarding": {
                "baseline_sleep": current_user.baseline_sleep_hours,
                "work_goal": current_user.work_hours_goal,
                "stress_source": current_user.primary_stress_source,
                "goal": current_user.goal
            }
        },
        "data": {
            "sleep_logs": [serialize_sleep(log) for log in sleep_logs],
            "mood_entries": [serialize_mood(entry) for entry in mood_entries],
            "behavior_logs": [serialize_behavior(log) for log in behavior_logs],
            "burnout_scores": [serialize_score(score) for score in burnout_scores]
        }
    }
