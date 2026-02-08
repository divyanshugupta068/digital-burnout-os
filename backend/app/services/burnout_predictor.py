"""
Burnout Prediction Algorithm
Uses behavioral data to predict burnout risk
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
from sqlalchemy import and_
from sqlalchemy.orm import Session

from ..models.tracking import SleepLog, MoodEntry, BehaviorLog


class BurnoutPredictor:
    """
    AI-powered burnout prediction using behavioral analytics
    """
    
    # Weights for different factors (tuned based on research)
    WEIGHTS = {
        "sleep_deficit": 0.25,      # Sleep hours below target
        "sleep_quality": 0.15,      # Quality of sleep
        "mood_decline": 0.20,       # Declining mood trend
        "work_overload": 0.20,      # Excessive work hours
        "stress_level": 0.15,       # Current stress levels
        "consistency": 0.05,        # Pattern consistency (lack of variation)
    }
    
    # Thresholds
    OPTIMAL_SLEEP = 7.5  # hours
    MAX_HEALTHY_WORK = 9.0  # hours per day
    
    @staticmethod
    def calculate_burnout_score(db: Session, user_id: int, days: int = 30) -> Dict:
        """
        Calculate burnout risk score (0-100)
        Higher score = higher burnout risk
        """
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Fetch data
        sleep_logs = db.query(SleepLog).filter(
            and_(
                SleepLog.user_id == user_id,
                SleepLog.date >= start_date,
                SleepLog.date <= end_date
            )
        ).order_by(SleepLog.date).all()
        
        mood_entries = db.query(MoodEntry).filter(
            and_(
                MoodEntry.user_id == user_id,
                MoodEntry.date >= start_date,
                MoodEntry.date <= end_date
            )
        ).order_by(MoodEntry.date).all()
        
        behavior_logs = db.query(BehaviorLog).filter(
            and_(
                BehaviorLog.user_id == user_id,
                BehaviorLog.date >= start_date,
                BehaviorLog.date <= end_date
            )
        ).order_by(BehaviorLog.date).all()
        
        # Calculate individual factors
        sleep_score = BurnoutPredictor._calculate_sleep_score(sleep_logs)
        mood_score = BurnoutPredictor._calculate_mood_score(mood_entries)
        work_score = BurnoutPredictor._calculate_work_score(behavior_logs)
        
        # Weighted total (0-100)
        total_score = (
            sleep_score["total"] * BurnoutPredictor.WEIGHTS["sleep_deficit"] +
            sleep_score["quality"] * BurnoutPredictor.WEIGHTS["sleep_quality"] +
            mood_score["decline"] * BurnoutPredictor.WEIGHTS["mood_decline"] +
            work_score["overload"] * BurnoutPredictor.WEIGHTS["work_overload"] +
            work_score["stress"] * BurnoutPredictor.WEIGHTS["stress_level"] +
            work_score["consistency"] * BurnoutPredictor.WEIGHTS["consistency"]
        ) * 100
        
        # Determine risk level
        if total_score < 30:
            risk_level = "Low"
            risk_color = "green"
        elif total_score < 60:
            risk_level = "Medium"
            risk_color = "yellow"
        else:
            risk_level = "High"
            risk_color = "red"
        
        # Generate insights
        insights = BurnoutPredictor._generate_insights(
            sleep_score, mood_score, work_score, total_score
        )
        
        return {
            "score": round(total_score, 1),
            "risk_level": risk_level,
            "risk_color": risk_color,
            "factors": {
                "sleep": sleep_score,
                "mood": mood_score,
                "work": work_score
            },
            "insights": insights,
            "data_points": len(sleep_logs) + len(mood_entries) + len(behavior_logs),
            "period_days": days
        }
    
    @staticmethod
    def _calculate_sleep_score(sleep_logs: List[SleepLog]) -> Dict:
        """Calculate sleep-related burnout factors"""
        if not sleep_logs:
            return {"total": 0.5, "quality": 0.5, "avg_hours": 0, "avg_quality": 0}
        
        total_hours = sum(log.hours for log in sleep_logs)
        total_quality = sum(log.quality for log in sleep_logs)
        count = len(sleep_logs)
        
        avg_hours = total_hours / count
        avg_quality = total_quality / count
        
        # Sleep deficit score (0-1, higher = worse)
        if avg_hours >= BurnoutPredictor.OPTIMAL_SLEEP:
            deficit_score = 0.0
        else:
            deficit = BurnoutPredictor.OPTIMAL_SLEEP - avg_hours
            deficit_score = min(deficit / 3.0, 1.0)  # Normalize to 0-1
        
        # Quality score (0-1, higher = worse)
        quality_score = 1.0 - (avg_quality / 5.0)
        
        return {
            "total": deficit_score,
            "quality": quality_score,
            "avg_hours": round(avg_hours, 1),
            "avg_quality": round(avg_quality, 1)
        }
    
    @staticmethod
    def _calculate_mood_score(mood_entries: List[MoodEntry]) -> Dict:
        """Calculate mood-related burnout factors"""
        if not mood_entries:
            return {"decline": 0.5, "avg_mood": 0, "trend": "neutral"}
        
        scores = [entry.score for entry in mood_entries]
        avg_mood = sum(scores) / len(scores)
        
        # Calculate trend (recent vs earlier)
        if len(scores) >= 7:
            recent_avg = sum(scores[-7:]) / 7
            earlier_avg = sum(scores[:-7]) / len(scores[:-7]) if len(scores) > 7 else avg_mood
            trend_diff = earlier_avg - recent_avg  # Positive = declining
            
            if trend_diff > 0.5:
                trend = "declining"
                decline_score = min(trend_diff / 2.0, 1.0)
            elif trend_diff < -0.5:
                trend = "improving"
                decline_score = 0.0
            else:
                trend = "stable"
                decline_score = 0.3
        else:
            trend = "insufficient_data"
            decline_score = 0.5
        
        # Factor in overall low mood
        if avg_mood < 2.5:
            decline_score = max(decline_score, 0.7)
        
        return {
            "decline": decline_score,
            "avg_mood": round(avg_mood, 1),
            "trend": trend
        }
    
    @staticmethod
    def _calculate_work_score(behavior_logs: List[BehaviorLog]) -> Dict:
        """Calculate work-related burnout factors"""
        if not behavior_logs:
            return {
                "overload": 0.5,
                "stress": 0.5,
                "consistency": 0.5,
                "avg_work_hours": 0,
                "avg_stress": 0
            }
        
        total_work = sum(log.work_hours for log in behavior_logs)
        total_stress = sum(log.stress_level for log in behavior_logs)
        count = len(behavior_logs)
        
        avg_work = total_work / count
        avg_stress = total_stress / count
        
        # Work overload score (0-1, higher = worse)
        if avg_work <= BurnoutPredictor.MAX_HEALTHY_WORK:
            overload_score = 0.0
        else:
            excess = avg_work - BurnoutPredictor.MAX_HEALTHY_WORK
            overload_score = min(excess / 5.0, 1.0)
        
        # Stress score (0-1, higher = worse)
        stress_score = (avg_stress - 1) / 4.0  # Normalize 1-5 to 0-1
        
        # Consistency score - lack of recovery days is bad
        work_hours = [log.work_hours for log in behavior_logs]
        low_work_days = sum(1 for h in work_hours if h < 6)
        recovery_ratio = low_work_days / len(work_hours)
        consistency_score = 1.0 - recovery_ratio  # Higher = less recovery
        
        return {
            "overload": overload_score,
            "stress": stress_score,
            "consistency": consistency_score,
            "avg_work_hours": round(avg_work, 1),
            "avg_stress": round(avg_stress, 1)
        }
    
    @staticmethod
    def _generate_insights(sleep: Dict, mood: Dict, work: Dict, total_score: float) -> List[str]:
        """Generate actionable insights based on scores"""
        insights = []
        
        # Sleep insights
        if sleep["avg_hours"] < 6.5:
            insights.append(f"⚠️ You're averaging {sleep['avg_hours']}h of sleep. Aim for 7-9 hours.")
        elif sleep["avg_hours"] < 7:
            insights.append(f"Sleep could be better. Try for {BurnoutPredictor.OPTIMAL_SLEEP}h instead of {sleep['avg_hours']}h.")
        
        if sleep["avg_quality"] < 3:
            insights.append("😴 Sleep quality is low. Consider improving sleep hygiene.")
        
        # Mood insights
        if mood["trend"] == "declining":
            insights.append("📉 Your mood has been declining recently. This is a key burnout indicator.")
        elif mood["avg_mood"] < 2.5:
            insights.append(f"🫂 Your average mood is low ({mood['avg_mood']}/5). Consider reaching out for support.")
        
        # Work insights
        if work["avg_work_hours"] > 10:
            insights.append(f"🚨 You're working {work['avg_work_hours']}h/day on average. This is unsustainable.")
        elif work["avg_work_hours"] > 9:
            insights.append(f"⚠️ Work hours ({work['avg_work_hours']}h/day) are above healthy limits.")
        
        if work["avg_stress"] > 3.5:
            insights.append(f"😰 Stress levels are high ({work['avg_stress']}/5). Practice stress management techniques.")
        
        # Overall insights
        if total_score > 70:
            insights.append("🔴 High burnout risk detected. Take immediate action to reduce workload and stress.")
        elif total_score > 50:
            insights.append("🟡 Moderate burnout risk. Make lifestyle changes now to prevent escalation.")
        else:
            insights.append("✅ You're managing well! Keep maintaining these healthy patterns.")
        
        if not insights:
            insights.append("Keep tracking daily to get personalized insights!")
        
        return insights
    
    @staticmethod
    def get_recommendations(burnout_score: float, factors: Dict) -> List[Dict]:
        """Get personalized recommendations based on burnout analysis"""
        recommendations = []
        
        sleep = factors["sleep"]
        mood = factors["mood"]
        work = factors["work"]
        
        # Sleep recommendations
        if sleep["avg_hours"] < 7:
            recommendations.append({
                "category": "Sleep",
                "priority": "High",
                "action": f"Increase sleep to {BurnoutPredictor.OPTIMAL_SLEEP}h per night",
                "impact": "High - Sleep deficit is a major burnout contributor"
            })
        
        if sleep["avg_quality"] < 3:
            recommendations.append({
                "category": "Sleep Quality",
                "priority": "Medium",
                "action": "Improve sleep hygiene: dark room, cool temperature, no screens 1h before bed",
                "impact": "Medium - Better sleep quality aids recovery"
            })
        
        # Work recommendations
        if work["avg_work_hours"] > 9:
            recommendations.append({
                "category": "Work Hours",
                "priority": "Critical",
                "action": f"Reduce work hours from {work['avg_work_hours']}h to max 9h per day",
                "impact": "Critical - Overwork is the #1 burnout cause"
            })
        
        if work["avg_stress"] > 3.5:
            recommendations.append({
                "category": "Stress Management",
                "priority": "High",
                "action": "Practice stress reduction: meditation, exercise, breaks every hour",
                "impact": "High - Chronic stress damages mental health"
            })
        
        # Mood recommendations
        if mood["avg_mood"] < 2.5:
            recommendations.append({
                "category": "Mental Health",
                "priority": "Critical",
                "action": "Consider professional support - therapist or counselor",
                "impact": "Critical - Low mood may indicate depression"
            })
        
        # General recommendations
        if burnout_score > 60:
            recommendations.append({
                "category": "Recovery",
                "priority": "Critical",
                "action": "Take immediate time off if possible. Schedule vacation or mental health days.",
                "impact": "Critical - Prevention is easier than recovery"
            })
        
        return recommendations
