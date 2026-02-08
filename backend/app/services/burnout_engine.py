from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..models.user import User
from ..models.tracking import BehaviorLog, SleepLog, MoodEntry, BurnoutScore, Recommendation, Alert
import datetime


def update_burnout_score(db: Session, user_id: int):
    """
    Calculate burnout risk score based on multiple factors:
    - Sleep (30%): Hours and quality
    - Mental State (25%): Mood, stress, anxiety
    - Energy & Focus (20%): Energy levels, focus score
    - Work Load (15%): Work hours, meetings, screen time
    - Lifestyle (10%): Exercise, social, symptoms
    """
    seven_days_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    
    user = db.query(User).filter(User.id == user_id).first()
    recent_sleep = db.query(SleepLog).filter(
        SleepLog.user_id == user_id, 
        SleepLog.date >= seven_days_ago
    ).order_by(desc(SleepLog.date)).all()
    recent_mood = db.query(MoodEntry).filter(
        MoodEntry.user_id == user_id, 
        MoodEntry.date >= seven_days_ago
    ).order_by(desc(MoodEntry.date)).all()
    recent_behavior = db.query(BehaviorLog).filter(
        BehaviorLog.user_id == user_id, 
        BehaviorLog.date >= seven_days_ago
    ).order_by(desc(BehaviorLog.date)).all()

    if not recent_sleep and not recent_mood and not recent_behavior:
        return

    drivers = []
    
    # ========== SLEEP COMPONENT (30%) ==========
    sleep_health = 100
    if recent_sleep:
        avg_hours = sum(s.hours for s in recent_sleep) / len(recent_sleep)
        avg_quality = sum(s.quality for s in recent_sleep) / len(recent_sleep)
        baseline = user.baseline_sleep_hours or 7.5
        
        # Penalize for insufficient sleep
        if avg_hours < baseline:
            deficit = baseline - avg_hours
            sleep_health -= deficit * 15  # -15 pts per hour deficit
            if deficit > 1.5:
                drivers.append("poor_sleep")
        
        # Penalize for poor quality
        if avg_quality < 3:
            sleep_health -= (3 - avg_quality) * 10
            drivers.append("low_sleep_quality")
        
        sleep_health = max(0, min(100, sleep_health))
    
    # ========== MENTAL STATE COMPONENT (25%) ==========
    mental_health = 100
    if recent_mood:
        avg_mood = sum(m.score for m in recent_mood) / len(recent_mood)
        
        # Get stress and anxiety if available
        stress_scores = [m.stress_level for m in recent_mood if m.stress_level]
        anxiety_scores = [m.anxiety_level for m in recent_mood if m.anxiety_level]
        
        avg_stress = sum(stress_scores) / len(stress_scores) if stress_scores else 3
        avg_anxiety = sum(anxiety_scores) / len(anxiety_scores) if anxiety_scores else 2
        
        # Low mood decreases health
        if avg_mood < 3:
            mental_health -= (3 - avg_mood) * 20
            drivers.append("low_mood")
        
        # High stress increases burnout risk
        if avg_stress > 3.5:
            mental_health -= (avg_stress - 3) * 15
            drivers.append("high_stress")
        
        # High anxiety increases burnout risk
        if avg_anxiety > 3:
            mental_health -= (avg_anxiety - 2) * 10
            drivers.append("high_anxiety")
        
        mental_health = max(0, min(100, mental_health))
    
    # ========== ENERGY & FOCUS COMPONENT (20%) ==========
    energy_health = 100
    if recent_behavior:
        energy_scores = [b.energy_level for b in recent_behavior if b.energy_level]
        focus_scores = [b.focus_score for b in recent_behavior if b.focus_score]
        motivation_scores = [b.motivation_level for b in recent_behavior if b.motivation_level]
        
        avg_energy = sum(energy_scores) / len(energy_scores) if energy_scores else 3
        avg_focus = sum(focus_scores) / len(focus_scores) if focus_scores else 3
        avg_motivation = sum(motivation_scores) / len(motivation_scores) if motivation_scores else 3
        
        if avg_energy < 3:
            energy_health -= (3 - avg_energy) * 20
            drivers.append("low_energy")
        
        if avg_focus < 3:
            energy_health -= (3 - avg_focus) * 15
            drivers.append("poor_focus")
        
        if avg_motivation < 3:
            energy_health -= (3 - avg_motivation) * 10
            drivers.append("low_motivation")
        
        energy_health = max(0, min(100, energy_health))
    
    # ========== WORK LOAD COMPONENT (15%) ==========
    work_health = 100
    if recent_behavior:
        work_hours_list = [b.work_hours for b in recent_behavior if b.work_hours]
        screen_hours_list = [b.screen_time_hours for b in recent_behavior if b.screen_time_hours]
        meetings_list = [b.meetings_count for b in recent_behavior if b.meetings_count]
        breaks_list = [b.breaks_taken for b in recent_behavior if b.breaks_taken]
        
        avg_work = sum(work_hours_list) / len(work_hours_list) if work_hours_list else 8
        avg_screen = sum(screen_hours_list) / len(screen_hours_list) if screen_hours_list else 6
        avg_meetings = sum(meetings_list) / len(meetings_list) if meetings_list else 3
        avg_breaks = sum(breaks_list) / len(breaks_list) if breaks_list else 2
        
        work_goal = user.work_hours_goal or 8
        
        # Overwork penalty
        if avg_work > work_goal:
            overtime = avg_work - work_goal
            work_health -= overtime * 10
            if overtime > 2:
                drivers.append("high_work_hours")
        
        # Excessive screen time
        if avg_screen > 8:
            work_health -= (avg_screen - 8) * 5
            drivers.append("high_screen_time")
        
        # Too many meetings
        if avg_meetings > 5:
            work_health -= (avg_meetings - 5) * 5
            drivers.append("meeting_overload")
        
        # Not enough breaks
        if avg_breaks < 2:
            work_health -= (2 - avg_breaks) * 10
            drivers.append("insufficient_breaks")
        
        work_health = max(0, min(100, work_health))
    
    # ========== LIFESTYLE & SYMPTOMS COMPONENT (10%) ==========
    lifestyle_health = 100
    if recent_behavior:
        exercise_list = [b.exercise_minutes for b in recent_behavior if b.exercise_minutes is not None]
        caffeine_list = [b.caffeine_cups for b in recent_behavior if b.caffeine_cups is not None]
        social_list = [b.social_interactions for b in recent_behavior if b.social_interactions is not None]
        
        avg_exercise = sum(exercise_list) / len(exercise_list) if exercise_list else 0
        avg_caffeine = sum(caffeine_list) / len(caffeine_list) if caffeine_list else 2
        avg_social = sum(social_list) / len(social_list) if social_list else 2
        
        # No exercise is bad
        if avg_exercise < 15:
            lifestyle_health -= 20
            drivers.append("no_exercise")
        
        # Too much caffeine
        if avg_caffeine > 4:
            lifestyle_health -= (avg_caffeine - 4) * 5
            drivers.append("high_caffeine")
        
        # Social isolation
        if avg_social < 1:
            lifestyle_health -= 15
            drivers.append("social_isolation")
        
        # Physical symptoms
        symptom_count = sum([
            1 for b in recent_behavior 
            if b.has_headache or b.has_eye_strain or b.has_back_pain or b.has_fatigue
        ])
        if symptom_count > len(recent_behavior) * 0.5:
            lifestyle_health -= 20
            drivers.append("physical_symptoms")
        
        lifestyle_health = max(0, min(100, lifestyle_health))
    
    # ========== CALCULATE FINAL SCORE ==========
    # Higher health = lower burnout risk
    total_health = (
        sleep_health * 0.30 +
        mental_health * 0.25 +
        energy_health * 0.20 +
        work_health * 0.15 +
        lifestyle_health * 0.10
    )
    
    burnout_risk_score = round(100 - total_health)
    burnout_risk_score = max(0, min(100, burnout_risk_score))
    
    # Determine risk level
    if burnout_risk_score >= 60:
        risk_level = "High Risk"
    elif burnout_risk_score >= 30:
        risk_level = "Warning"
    else:
        risk_level = "Safe"
    
    # Save the score
    new_score = BurnoutScore(
        user_id=user_id,
        score=burnout_risk_score,
        risk_level=risk_level,
        drivers=", ".join(set(drivers)) if drivers else ""
    )
    db.add(new_score)
    
    # Generate Alerts and Recommendations
    if burnout_risk_score >= 60:
        alert = Alert(
            user_id=user_id,
            message="High burnout risk detected! Consider taking a break.",
            severity="Critical"
        )
        db.add(alert)
        
        rec = Recommendation(
            user_id=user_id,
            content="Your data shows elevated burnout signals. Prioritize rest, take breaks, and avoid overworking today.",
            category="Stress"
        )
        db.add(rec)
    elif burnout_risk_score >= 30:
        rec = Recommendation(
            user_id=user_id,
            content="You're approaching a warning zone. Try to maintain work-life boundaries for the next few days.",
            category="Work"
        )
        db.add(rec)

    db.commit()
