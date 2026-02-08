from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=False)
    email_verification_token = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Onboarding Data
    baseline_sleep_hours = Column(Float, nullable=True)
    work_hours_goal = Column(Float, nullable=True)
    primary_stress_source = Column(String, nullable=True)
    goal = Column(String, nullable=True) # productivity, mental health, balance
    
    # Relationships
    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user", cascade="all, delete-orphan")
    
    @property
    def current_subscription(self):
        """Get the user's current active subscription"""
        if not self.subscriptions:
            return None
        # Get the most recent active subscription
        active_subs = [s for s in self.subscriptions if s.is_active()]
        return active_subs[0] if active_subs else None
    
    @property
    def subscription_plan(self) -> str:
        """Get current subscription plan type"""
        sub = self.current_subscription
        return sub.plan_type.value if sub else "free"
    
    def has_feature_access(self, feature: str) -> bool:
        """Check if user has access to a specific feature"""
        sub = self.current_subscription
        if not sub:
            # Free features for users without subscription
            free_features = ["basic_tracking", "7_day_history", "basic_insights"]
            return feature in free_features
        return sub.has_feature_access(feature)

