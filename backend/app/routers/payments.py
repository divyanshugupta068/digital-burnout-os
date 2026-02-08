from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import razorpay
import hmac
import hashlib
import os
from typing import Optional
from datetime import datetime, timedelta
from ..core.database import get_db
from ..models.user import User
from ..models.payment import Payment, PaymentStatus
from ..models.subscription import Subscription, PlanType, SubscriptionStatus

router = APIRouter()

# Initialize Razorpay client
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_SDG8SwjheuHVQb")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "v1O3g4UE2IEDlfNRw3AVgrXT")

# Only create client if Razorpay is available
try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    RAZORPAY_AVAILABLE = True
except:
    RAZORPAY_AVAILABLE = False
    razorpay_client = None

# Pydantic models
class OrderCreate(BaseModel):
    plan_id: str
    amount: int
    user_id: Optional[int] = None  # Will be from auth token in future

class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan_id: str
    user_id: Optional[int] = None  # Will be from auth token in future
    user_email: Optional[str] = None

# Plan pricing in paise (1 INR = 100 paise)
PLAN_PRICING = {
    "pro": 74900,  # ₹749
    "enterprise": 499900,  # ₹4999
}

PLAN_NAMES = {
    "pro": "Pro",
    "enterprise": "Enterprise"
}

@router.post("/create-order")
async def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """
    Create a Razorpay order for payment and save pending payment record
    """
    if not RAZORPAY_AVAILABLE:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    try:
        # Validate plan
        if order_data.plan_id not in PLAN_PRICING:
            raise HTTPException(status_code=400, detail="Invalid plan ID")
        
        # Get amount with GST (18%)
        base_amount = PLAN_PRICING[order_data.plan_id]
        total_amount = int(base_amount * 1.18)  # Add 18% GST
        
        # Create Razorpay order
        razorpay_order = razorpay_client.order.create({
            "amount": total_amount,
            "currency": "INR",
            "payment_capture": 1,  # Auto capture payment
            "notes": {
                "plan_id": order_data.plan_id,
                "created_at": datetime.utcnow().isoformat(),
                "user_id": str(order_data.user_id) if order_data.user_id else "guest"
            }
        })
        
        # Save pending payment record to database
        payment = Payment(
            user_id=order_data.user_id or 1,  # TODO: Get from auth, default to demo user
            razorpay_order_id=razorpay_order["id"],
            amount=total_amount,
            currency="INR",
            status=PaymentStatus.PENDING,
            plan_id=order_data.plan_id,
            plan_name=PLAN_NAMES.get(order_data.plan_id, order_data.plan_id)
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
        
        print(f"✅ Order created: {razorpay_order['id']} for ₹{total_amount/100}")
        
        return {
            "id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "plan_id": order_data.plan_id
        }
    
    except Exception as e:
        print(f"❌ Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@router.post("/verify")
async def verify_payment(payment_data: PaymentVerify, db: Session = Depends(get_db)):
    """
    Verify Razorpay payment signature and activate subscription
    """
    try:
        # Create signature verification string
        verification_string = f"{payment_data.razorpay_order_id}|{payment_data.razorpay_payment_id}"
        
        # Generate expected signature
        expected_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            verification_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Verify signature
        if expected_signature != payment_data.razorpay_signature:
            # Update payment as failed
            payment = db.query(Payment).filter(Payment.razorpay_order_id == payment_data.razorpay_order_id).first()
            if payment:
                payment.status = PaymentStatus.FAILED
                payment.error_description = "Invalid signature"
                payment.failed_at = datetime.utcnow()
                db.commit()
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Find the payment record
        payment = db.query(Payment).filter(Payment.razorpay_order_id == payment_data.razorpay_order_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment record not found")
        
        # Update payment record
        payment.razorpay_payment_id = payment_data.razorpay_payment_id
        payment.razorpay_signature = payment_data.razorpay_signature
        payment.status = PaymentStatus.CAPTURED
        payment.captured_at = datetime.utcnow()
        if payment_data.user_email:
            payment.user_email = payment_data.user_email
        
        # Get or create user (TODO: Use actual authenticated user)
        user_id = payment_data.user_id or payment.user_id or 1
        user = db.query(User).filter(User.id == user_id).first()
        
        # Create or update subscription
        # Check if user already has an active subscription for this plan
        existing_sub = db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.plan_type == PlanType[payment_data.plan_id.upper()]
        ).first()
        
        if existing_sub:
            # Extend existing subscription
            if existing_sub.end_date and existing_sub.end_date > datetime.utcnow():
                # Extend from current end date
                existing_sub.end_date = existing_sub.end_date + timedelta(days=30)
            else:
                # Restart from now
                existing_sub.start_date = datetime.utcnow()
                existing_sub.end_date = datetime.utcnow() + timedelta(days=30)
            existing_sub.status = SubscriptionStatus.ACTIVE
            existing_sub.amount_paid = payment.amount
            subscription = existing_sub
        else:
            # Create new subscription
            subscription = Subscription(
                user_id=user_id,
                plan_type=PlanType[payment_data.plan_id.upper()],
                status=SubscriptionStatus.ACTIVE,
                amount_paid=payment.amount,
                currency="INR",
                start_date=datetime.utcnow(),
                end_date=datetime.utcnow() + timedelta(days=30),  # 30-day subscription
                auto_renew=True
            )
            db.add(subscription)
        
        # Link payment to subscription
        db.flush()  # Get subscription ID
        payment.subscription_id = subscription.id
        
        db.commit()
        db.refresh(payment)
        db.refresh(subscription)
        
        print(f"✅ Payment verified and subscription activated!")
        print(f"   User: {user_id}, Plan: {payment_data.plan_id}, Subscription ID: {subscription.id}")
        
        # TODO: Send confirmation email here
        
        return {
            "status": "success",
            "message": "Payment verified and subscription activated!",
            "order_id": payment_data.razorpay_order_id,
            "payment_id": payment_data.razorpay_payment_id,
            "subscription": {
                "id": subscription.id,
                "plan": payment_data.plan_id,
                "start_date": subscription.start_date.isoformat(),
                "end_date": subscription.end_date.isoformat(),
                "status": subscription.status.value
            },
            "verified_at": datetime.utcnow().isoformat()
        }
    
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Error verifying payment: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to verify payment: {str(e)}")


@router.get("/plans")
async def get_plans():
    """
    Get available subscription plans with pricing
    """
    return {
        "plans": [
            {
                "id": "pro",
                "name": "Pro",
                "price": 749,
                "price_with_gst": 884,
                "currency": "INR",
                "period": "month",
                "features": [
                    "Everything in Free",
                    "AI-powered insights",
                    "30-day pattern analysis",
                    "Unlimited PDF reports",
                    "Priority support"
                ]
            },
            {
                "id": "enterprise",
                "name": "Enterprise",
                "price": 4999,
                "price_with_gst": 5899,
                "currency": "INR",
                "period": "month",
                "features": [
                    "Everything in Pro",
                    "Team analytics dashboard",
                    "Admin controls & SSO",
                    "API access",
                    "Dedicated success manager"
                ]
            }
        ]
    }


@router.get("/subscription/status")
async def get_subscription_status(user_id: int = 1, db: Session = Depends(get_db)):
    """
    Get user's current subscription status
    TODO: Get user_id from auth token
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_sub = user.current_subscription
    
    if not current_sub:
        return {
            "has_subscription": False,
            "plan": "free",
            "status": "free"
        }
    
    return {
        "has_subscription": True,
        "plan": current_sub.plan_type.value,
        "status": current_sub.status.value,
        "start_date": current_sub.start_date.isoformat(),
        "end_date": current_sub.end_date.isoformat() if current_sub.end_date else None,
        "auto_renew": current_sub.auto_renew,
        "is_active": current_sub.is_active()
    }


@router.get("/payments/history")
async def get_payment_history(user_id: int = 1, db: Session = Depends(get_db)):
    """
    Get user's payment history
    TODO: Get user_id from auth token
    """
    payments = db.query(Payment).filter(Payment.user_id == user_id).order_by(Payment.created_at.desc()).limit(20).all()
    
    return {
        "payments": [
            {
                "id": p.id,
                "amount": p.amount_inr,
                "currency": p.currency,
                "status": p.status.value,
                "plan": p.plan_name,
                "created_at": p.created_at.isoformat(),
                "payment_id": p.razorpay_payment_id
            }
            for p in payments
        ]
    }


@router.post("/webhook")
async def razorpay_webhook(payload: dict, db: Session = Depends(get_db)):
    """
    Handle Razorpay webhooks for payment events
    Configure this URL in your Razorpay dashboard
    """
    try:
        # TODO: Verify webhook signature in production
        # webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
        
        event = payload.get("event")
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id")
        
        if not order_id:
            return {"status": "ok", "info": "No order_id in webhook"}
        
        # Find payment by order_id
        payment = db.query(Payment).filter(Payment.razorpay_order_id == order_id).first()
        if not payment:
            print(f"⚠️ Payment not found for order: {order_id}")
            return {"status": "ok"}
        
        if event == "payment.captured":
            # Payment successful
            print(f"✅ Webhook: Payment captured: {payment_entity.get('id')}")
            payment.status = PaymentStatus.CAPTURED
            payment.razorpay_payment_id = payment_entity.get("id")
            payment.captured_at = datetime.utcnow()
            
            # TODO: Trigger email notification
            
        elif event == "payment.failed":
            # Payment failed
            print(f"❌ Webhook: Payment failed: {payment_entity.get('id')}")
            payment.status = PaymentStatus.FAILED
            payment.error_code = payment_entity.get("error_code")
            payment.error_description = payment_entity.get("error_description")
            payment.failed_at = datetime.utcnow()
        
        db.commit()
        return {"status": "ok"}
    
    except Exception as e:
        print(f"❌ Webhook error: {str(e)}")
        import traceback
        traceback.print_exc()
        # Don't raise exception for webhooks - just log and return ok
        return {"status": "error", "message": str(e)}
