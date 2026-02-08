from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import Dict, Any

from ..core.deps import get_current_user
from ..core.database import get_db
from ..models.user import User
from ..models.tracking import SleepLog, MoodEntry, BehaviorLog, BurnoutScore

router = APIRouter()


@router.get("/stats")
async def get_gamification_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get gamification stats: streaks, badges, XP"""
    user_id = current_user.id
    
    # Get all unique log dates
    sleep_dates = db.query(func.date(SleepLog.date)).filter(
        SleepLog.user_id == user_id
    ).distinct().all()
    
    mood_dates = db.query(func.date(MoodEntry.date)).filter(
        MoodEntry.user_id == user_id
    ).distinct().all()
    
    # Combine all log dates
    all_dates = set()
    for d in sleep_dates:
        if d[0]:
            all_dates.add(d[0])
    for d in mood_dates:
        if d[0]:
            all_dates.add(d[0])
    
    sorted_dates = sorted(all_dates, reverse=True)
    total_entries = len(sorted_dates)
    
    # Calculate current streak
    current_streak = 0
    today = datetime.now().date()
    
    for i, log_date in enumerate(sorted_dates):
        expected_date = today - timedelta(days=i)
        if log_date == expected_date:
            current_streak += 1
        elif log_date == expected_date - timedelta(days=1) and i == 0:
            # Allow for yesterday if not logged today yet
            for j, d in enumerate(sorted_dates):
                expected = (today - timedelta(days=1)) - timedelta(days=j)
                if d == expected:
                    current_streak += 1
                else:
                    break
            break
        else:
            break
    
    # Calculate longest streak
    longest_streak = 0
    if sorted_dates:
        streak = 1
        prev_date = sorted_dates[0]
        for i in range(1, len(sorted_dates)):
            if sorted_dates[i] == prev_date - timedelta(days=1):
                streak += 1
            else:
                longest_streak = max(longest_streak, streak)
                streak = 1
            prev_date = sorted_dates[i]
        longest_streak = max(longest_streak, streak)
    
    # Weekly goal progress (this week)
    week_start = today - timedelta(days=today.weekday())
    weekly_logs = sum(1 for d in sorted_dates if d >= week_start)
    
    # Calculate XP
    # 10 XP per entry + 5 XP per streak day + 50 XP per badge
    base_xp = total_entries * 10
    streak_xp = current_streak * 5
    
    # Determine unlocked badges
    unlocked_badges = []
    
    if total_entries >= 1:
        unlocked_badges.append("first_log")
    if current_streak >= 7 or longest_streak >= 7:
        unlocked_badges.append("week_streak")
    if current_streak >= 30 or longest_streak >= 30:
        unlocked_badges.append("month_streak")
    if total_entries >= 100:
        unlocked_badges.append("century_club")
    
    # Check for sleep champion (7+ hours for 7 days)
    recent_sleep = db.query(SleepLog).filter(
        SleepLog.user_id == user_id,
        SleepLog.date >= datetime.now() - timedelta(days=14)
    ).order_by(desc(SleepLog.date)).limit(7).all()
    
    if len(recent_sleep) >= 7 and all(s.hours >= 7 for s in recent_sleep):
        unlocked_badges.append("sleep_champ")
    
    # Check for mood master (avg mood 4+ for 7 days)
    recent_mood = db.query(MoodEntry).filter(
        MoodEntry.user_id == user_id,
        MoodEntry.date >= datetime.now() - timedelta(days=14)
    ).order_by(desc(MoodEntry.date)).limit(7).all()
    
    if len(recent_mood) >= 7 and sum(m.score for m in recent_mood) / 7 >= 4:
        unlocked_badges.append("mood_master")
    
    # Check for burnout beater (score under 30 for 14 days)
    recent_scores = db.query(BurnoutScore).filter(
        BurnoutScore.user_id == user_id,
        BurnoutScore.date >= datetime.now() - timedelta(days=14)
    ).all()
    
    if len(recent_scores) >= 14 and all(s.score < 30 for s in recent_scores):
        unlocked_badges.append("burnout_beater")
    
    badge_xp = len(unlocked_badges) * 50
    total_xp = base_xp + streak_xp + badge_xp
    
    return {
        "currentStreak": current_streak,
        "longestStreak": longest_streak,
        "totalEntries": total_entries,
        "totalXP": total_xp,
        "unlockedBadges": unlocked_badges,
        "weeklyGoalProgress": min(weekly_logs, 7),
        "weeklyGoal": 7
    }
