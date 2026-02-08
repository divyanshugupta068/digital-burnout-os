from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .base import Base

class PlanType(enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(enum.Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    TRIAL = "trial"
    PENDING = "pending"

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_type = Column(SQLEnum(PlanType), nullable=False, default=PlanType.FREE)
    status = Column(SQLEnum(SubscriptionStatus), nullable=False, default=SubscriptionStatus.TRIAL)
    
    # Pricing
    amount_paid = Column(Integer, default=0)  # in paise
    currency = Column(String, default="INR")
    
    # Dates
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    trial_end_date = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    
    # Auto-renewal
    auto_renew = Column(Boolean, default=True)
    
    # Razorpay subscription ID (if using Razorpay subscriptions)
    razorpay_subscription_id = Column(String, nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
    payments = relationship("Payment", back_populates="subscription", cascade="all, delete-orphan")
    
    def is_active(self) -> bool:
        """Check if subscription is currently active"""
        if self.status != SubscriptionStatus.ACTIVE:
            return False
        if self.end_date and self.end_date < datetime.utcnow():
            return False
        return True
    
    def has_feature_access(self, feature: str) -> bool:
        """Check if subscription has access to a specific feature"""
        if not self.is_active():
            return False
        
        # Free plan features
        free_features = ["basic_tracking", "7_day_history", "basic_insights"]
        
        # Pro plan features (includes all free features)
        pro_features = free_features + ["ai_insights", "30_day_history", "pdf_reports", "priority_support"]
        
        # Enterprise features (includes all pro features)
        enterprise_features = pro_features + ["team_dashboard", "api_access", "custom_integrations", "sso"]
        
        if self.plan_type == PlanType.FREE:
            return feature in free_features
        elif self.plan_type == PlanType.PRO:
            return feature in pro_features
        elif self.plan_type == PlanType.ENTERPRISE:
            return feature in enterprise_features
        
        return False
