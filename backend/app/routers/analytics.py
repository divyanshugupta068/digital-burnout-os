from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Dict, Any, List
import datetime
from ..core.deps import get_current_user
from ..core.database import get_db
from ..models.user import User
from ..models.tracking import BurnoutScore, SleepLog, MoodEntry, BehaviorLog
from ..services.burnout_predictor import BurnoutPredictor

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    # Get latest burnout score
    latest_score = db.query(BurnoutScore).filter(
        BurnoutScore.user_id == current_user.id
    ).order_by(desc(BurnoutScore.date)).first()
    
    # Get trend (last 7 days)
    seven_days_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    trend_data = db.query(BurnoutScore).filter(
        BurnoutScore.user_id == current_user.id,
        BurnoutScore.date >= seven_days_ago
    ).order_by(BurnoutScore.date).all()
    
    # Get latest logs
    latest_sleep = db.query(SleepLog).filter(
        SleepLog.user_id == current_user.id
    ).order_by(desc(SleepLog.date)).first()
    
    latest_mood = db.query(MoodEntry).filter(
        MoodEntry.user_id == current_user.id
    ).order_by(desc(MoodEntry.date)).first()
    
    latest_behavior = db.query(BehaviorLog).filter(
        BehaviorLog.user_id == current_user.id
    ).order_by(desc(BehaviorLog.date)).first()
    
    # Check if user has any data
    has_data = latest_score is not None or latest_sleep is not None or latest_mood is not None
    
    # Build trend
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    trend = []
    for s in trend_data:
        day_name = days[s.date.weekday()] if hasattr(s.date, 'weekday') else 'Day'
        trend.append({"day": day_name, "score": s.score, "date": str(s.date)})
    
    # Calculate trends
    sleep_logs = db.query(SleepLog).filter(
        SleepLog.user_id == current_user.id
    ).order_by(desc(SleepLog.date)).limit(2).all()
    
    mood_logs = db.query(MoodEntry).filter(
        MoodEntry.user_id == current_user.id
    ).order_by(desc(MoodEntry.date)).limit(2).all()
    
    behavior_logs = db.query(BehaviorLog).filter(
        BehaviorLog.user_id == current_user.id
    ).order_by(desc(BehaviorLog.date)).limit(2).all()
    
    sleep_change = None
    if len(sleep_logs) >= 2:
        sleep_change = round(sleep_logs[0].hours - sleep_logs[1].hours, 1)
    
    mood_change = None
    if len(mood_logs) >= 2:
        mood_change = round(mood_logs[0].score - mood_logs[1].score, 1)
    
    energy_change = None
    if len(behavior_logs) >= 2 and behavior_logs[0].energy_level and behavior_logs[1].energy_level:
        energy_change = round(behavior_logs[0].energy_level - behavior_logs[1].energy_level, 1)
    
    # Get recommendation
    recommendation = "Log your daily entries to receive personalized recommendations."
    if latest_score and latest_score.drivers:
        drivers = latest_score.drivers.split(", ")
        if "poor_sleep" in drivers:
            recommendation = f"Your sleep quality has been low. Try going to bed 30 minutes earlier tonight."
        elif "high_work" in drivers:
            recommendation = f"You've been working long hours. Schedule a break or delegate tasks."
        elif "low_mood" in drivers:
            recommendation = "Your mood has been lower than usual. Consider a walk, meditation, or connecting with a friend."
        elif "high_stress" in drivers:
            recommendation = "Stress levels are elevated. Try deep breathing exercises or a short break."
        else:
            recommendation = "Keep up the great work! Your patterns are looking healthy."

    return {
        "hasData": has_data,
        "current_score": latest_score.score if latest_score else 0,
        "risk_level": latest_score.risk_level if latest_score else "Unknown",
        "drivers": latest_score.drivers.split(", ") if latest_score and latest_score.drivers else [],
        "trend": trend,
        "latest": {
            "sleep_hours": latest_sleep.hours if latest_sleep else None,
            "sleep_quality": latest_sleep.quality if latest_sleep else None,
            "mood_score": latest_mood.score if latest_mood else None,
            "energy_level": latest_behavior.energy_level if latest_behavior else None,
            "focus_score": latest_behavior.focus_score if latest_behavior else None,
            "work_hours": latest_behavior.work_hours if latest_behavior else None,
        },
        "trends": {
            "sleep_change": sleep_change,
            "mood_change": mood_change,
            "energy_change": energy_change,
        },
        "recommendation": recommendation,
    }


@router.get("/detailed")
def get_detailed_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Get detailed analytics data for charts - returns real data only, no mock data"""
    
    now = datetime.datetime.now()
    seven_days_ago = now - datetime.timedelta(days=7)
    thirty_days_ago = now - datetime.timedelta(days=30)
    
    # Check if user has any data
    total_logs = db.query(SleepLog).filter(SleepLog.user_id == current_user.id).count()
    total_mood = db.query(MoodEntry).filter(MoodEntry.user_id == current_user.id).count()
    total_behavior = db.query(BehaviorLog).filter(BehaviorLog.user_id == current_user.id).count()
    
    has_data = total_logs > 0 or total_mood > 0 or total_behavior > 0
    
    if not has_data:
        return {
            "hasData": False,
            "weeklyTrend": [],
            "monthlyTrend": [],
            "sleepMoodCorrelation": [],
            "performanceData": [],
            "heatmap": [],
            "insights": []
        }
    
    # Weekly trend (last 7 days)
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    weekly_trend = []
    for i in range(7):
        day_date = now - datetime.timedelta(days=6-i)
        day_start = day_date.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + datetime.timedelta(days=1)
        
        # Get data for this day
        score = db.query(BurnoutScore).filter(
            BurnoutScore.user_id == current_user.id,
            BurnoutScore.date >= day_start,
            BurnoutScore.date < day_end
        ).first()
        
        sleep = db.query(SleepLog).filter(
            SleepLog.user_id == current_user.id,
            SleepLog.date >= day_start,
            SleepLog.date < day_end
        ).first()
        
        mood = db.query(MoodEntry).filter(
            MoodEntry.user_id == current_user.id,
            MoodEntry.date >= day_start,
            MoodEntry.date < day_end
        ).first()
        
        behavior = db.query(BehaviorLog).filter(
            BehaviorLog.user_id == current_user.id,
            BehaviorLog.date >= day_start,
            BehaviorLog.date < day_end
        ).first()
        
        weekly_trend.append({
            "label": days[day_date.weekday()],
            "date": day_date.strftime("%Y-%m-%d"),
            "score": score.score if score else None,
            "sleep": sleep.hours if sleep else None,
            "mood": mood.score if mood else None,
            "energy": behavior.energy_level if behavior else None
        })
    
    # Monthly trend (last 30 days)
    monthly_trend = []
    for i in range(30):
        day_date = now - datetime.timedelta(days=29-i)
        day_start = day_date.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + datetime.timedelta(days=1)
        
        score = db.query(BurnoutScore).filter(
            BurnoutScore.user_id == current_user.id,
            BurnoutScore.date >= day_start,
            BurnoutScore.date < day_end
        ).first()
        
        sleep = db.query(SleepLog).filter(
            SleepLog.user_id == current_user.id,
            SleepLog.date >= day_start,
            SleepLog.date < day_end
        ).first()
        
        mood = db.query(MoodEntry).filter(
            MoodEntry.user_id == current_user.id,
            MoodEntry.date >= day_start,
            MoodEntry.date < day_end
        ).first()
        
        behavior = db.query(BehaviorLog).filter(
            BehaviorLog.user_id == current_user.id,
            BehaviorLog.date >= day_start,
            BehaviorLog.date < day_end
        ).first()
        
        monthly_trend.append({
            "label": day_date.strftime("%b %d"),
            "date": day_date.strftime("%Y-%m-%d"),
            "score": score.score if score else None,
            "sleep": sleep.hours if sleep else None,
            "mood": mood.score if mood else None,
            "energy": behavior.energy_level if behavior else None
        })
    
    # Sleep vs Mood correlation
    sleep_logs = db.query(SleepLog).filter(
        SleepLog.user_id == current_user.id
    ).order_by(desc(SleepLog.date)).limit(30).all()
    
    mood_logs = db.query(MoodEntry).filter(
        MoodEntry.user_id == current_user.id
    ).order_by(desc(MoodEntry.date)).limit(30).all()
    
    # Match by date
    correlations = []
    for sleep in sleep_logs:
        sleep_date = sleep.date.date() if hasattr(sleep.date, 'date') else sleep.date
        for mood in mood_logs:
            mood_date = mood.date.date() if hasattr(mood.date, 'date') else mood.date
            if sleep_date == mood_date:
                correlations.append({
                    "sleep": sleep.hours,
                    "mood": mood.score
                })
                break
    
    # Performance data (last 7 days)
    performance_data = []
    behavior_logs = db.query(BehaviorLog).filter(
        BehaviorLog.user_id == current_user.id,
        BehaviorLog.date >= seven_days_ago
    ).order_by(BehaviorLog.date).all()
    
    for log in behavior_logs:
        # Get mood for same day to get stress
        log_date = log.date.date() if hasattr(log.date, 'date') else log.date
        mood = db.query(MoodEntry).filter(
            MoodEntry.user_id == current_user.id
        ).filter(MoodEntry.date >= log.date.replace(hour=0, minute=0, second=0, microsecond=0)).filter(
            MoodEntry.date < log.date.replace(hour=0, minute=0, second=0, microsecond=0) + datetime.timedelta(days=1)
        ).first()
        
        performance_data.append({
            "day": days[log.date.weekday()],
            "focus": log.focus_score or 0,
            "energy": log.energy_level or 0,
            "stress": mood.stress_level if mood and hasattr(mood, 'stress_level') and mood.stress_level else 3
        })
    
    # Heatmap (days of current month with scores)
    heatmap = []
    for day in range(1, 32):
        try:
            day_date = datetime.datetime(now.year, now.month, day)
            day_start = day_date.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + datetime.timedelta(days=1)
            
            score = db.query(BurnoutScore).filter(
                BurnoutScore.user_id == current_user.id,
                BurnoutScore.date >= day_start,
                BurnoutScore.date < day_end
            ).first()
            
            heatmap.append({
                "day": day,
                "score": score.score if score else None
            })
        except ValueError:
            # Invalid day for this month
            pass
    
    # Generate insights based on real data
    insights = []
    
    if correlations:
        avg_sleep_high_mood = sum([c["sleep"] for c in correlations if c["mood"] >= 4]) / max(len([c for c in correlations if c["mood"] >= 4]), 1)
        avg_sleep_low_mood = sum([c["sleep"] for c in correlations if c["mood"] <= 2]) / max(len([c for c in correlations if c["mood"] <= 2]), 1)
        if avg_sleep_high_mood > avg_sleep_low_mood + 1:
            insights.append(f"You average {avg_sleep_high_mood:.1f}h sleep on good mood days vs {avg_sleep_low_mood:.1f}h on low mood days.")
    
    if len(behavior_logs) >= 3:
        avg_work = sum([b.work_hours or 0 for b in behavior_logs]) / len(behavior_logs)
        if avg_work > 9:
            insights.append(f"Your average work day is {avg_work:.1f} hours - consider scheduling more breaks.")
    
    if len(sleep_logs) >= 3:
        avg_sleep = sum([s.hours for s in sleep_logs]) / len(sleep_logs)
        if avg_sleep < 7:
            insights.append(f"Your average sleep is {avg_sleep:.1f} hours - aim for 7-8 hours for optimal recovery.")
    
    return {
        "hasData": has_data,
        "weeklyTrend": weekly_trend,
        "monthlyTrend": monthly_trend,
        "sleepMoodCorrelation": correlations,
        "performanceData": performance_data,
        "heatmap": heatmap,
        "insights": insights
    }


@router.get("/logs/daily")
def get_daily_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = datetime.date.today()
    sleep = db.query(SleepLog).filter(SleepLog.user_id == current_user.id, SleepLog.date >= today).first()
    mood = db.query(MoodEntry).filter(MoodEntry.user_id == current_user.id, MoodEntry.date >= today).first()
    behavior = db.query(BehaviorLog).filter(BehaviorLog.user_id == current_user.id, BehaviorLog.date >= today).first()
    
    return {
        "sleep": sleep,
        "mood": mood,
        "behavior": behavior
    }


@router.get("/burnout-prediction")
def get_burnout_prediction(
    days: int = 30,
    db: Session = Depends(get_db),
    user_id: int = 1  # TODO: Get from auth token
) -> Dict[str, Any]:
    """
    Get AI-powered burnout prediction based on historical data
    """
    try:
        prediction = BurnoutPredictor.calculate_burnout_score(db, user_id, days)
        print(f"✅ Burnout prediction calculated: {prediction['score']}/100 ({prediction['risk_level']} risk)")
        return prediction
    except Exception as e:
        print(f"❌ Error calculating burnout prediction: {str(e)}")
        return {
            "score": 0,
            "risk_level": "Unknown",
            "risk_color": "gray",
            "factors": {},
            "insights": ["Not enough data to calculate burnout risk. Keep tracking!"],
            "data_points": 0,
            "period_days": days
        }


@router.get("/recommendations")
def get_recommendations(
    db: Session = Depends(get_db),
    user_id: int = 1  # TODO: Get from auth token
) -> Dict[str, Any]:
    """
    Get personalized recommendations based on burnout analysis
    """
    try:
        # Get burnout prediction first
        prediction = BurnoutPredictor.calculate_burnout_score(db, user_id, 30)
        
        # Get recommendations
        recommendations = BurnoutPredictor.get_recommendations(
            prediction["score"],
            prediction["factors"]
        )
        
        return {
            "burnout_score": prediction["score"],
            "risk_level": prediction["risk_level"],
            "recommendations": recommendations,
            "insights": prediction["insights"]
        }
    except Exception as e:
        print(f"❌ Error generating recommendations: {str(e)}")
        return {
            "burnout_score": 0,
            "risk_level": "Unknown",
            "recommendations": [],
            "insights": ["Track your daily data to receive personalized recommendations"]
        }
