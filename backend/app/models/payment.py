from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .base import Base

class PaymentStatus(enum.Enum):
    PENDING = "pending"
    AUTHORIZED = "authorized"
    CAPTURED = "captured"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(enum.Enum):
    CARD = "card"
    UPI = "upi"
    NETBANKING = "netbanking"
    WALLET = "wallet"
    OTHER = "other"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=True)
    
    # Razorpay IDs
    razorpay_order_id = Column(String, unique=True, index=True, nullable=False)
    razorpay_payment_id = Column(String, unique=True, index=True, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    
    # Payment details
    amount = Column(Integer, nullable=False)  # in paise (₹749 = 74900 paise)
    currency = Column(String, default="INR")
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    payment_method = Column(SQLEnum(PaymentMethod), nullable=True)
    
    # Plan info
    plan_id = Column(String, nullable=False)  # "pro", "enterprise"
    plan_name = Column(String, nullable=True)
    
    # Additional info
    user_email = Column(String, nullable=True)
    user_contact = Column(String, nullable=True)
    
    # Error tracking
    error_code = Column(String, nullable=True)
    error_description = Column(Text, nullable=True)
    
    # Refund info
    refunded_amount = Column(Integer, default=0)
    refund_reason = Column(Text, nullable=True)
    refunded_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    authorized_at = Column(DateTime, nullable=True)
    captured_at = Column(DateTime, nullable=True)
    failed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="payments")
    subscription = relationship("Subscription", back_populates="payments")
    
    @property
    def amount_inr(self) -> float:
        """Get amount in rupees"""
        return self.amount / 100 if self.amount else 0
    
    def is_successful(self) -> bool:
        """Check if payment was successful"""
        return self.status in [PaymentStatus.AUTHORIZED, PaymentStatus.CAPTURED]
