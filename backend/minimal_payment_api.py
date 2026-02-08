"""
MINIMAL PAYMENT API - FOR TESTING ONLY
This is a simplified version that only handles payments, no database needed.
Run with: uvicorn minimal_payment_api:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import Optional
from datetime import datetime

# Try to import razorpay, if not available, show error
try:
    import razorpay
    RAZORPAY_AVAILABLE = True
except ImportError:
    RAZORPAY_AVAILABLE = False
    print("⚠️  WARNING: razorpay module not installed!")
    print("   Install with: pip install razorpay")

app = FastAPI(title="Payment API - Minimal")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load from environment or use defaults
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_SDG8SwjheuHVQb")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "v1O3g4UE2IEDlfNRw3AVgrXT")

# Initialize Razorpay client only if module is available
if RAZORPAY_AVAILABLE:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
else:
    razorpay_client = None

# Pydantic models
class OrderCreate(BaseModel):
    plan_id: str
    amount: int

class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan_id: str
    user_email: Optional[str] = None

# Plan pricing in paise (1 INR = 100 paise)
PLAN_PRICING = {
    "pro": 74900,  # ₹749
    "enterprise": 499900,  # ₹4999
}

@app.get("/")
def root():
    return {
        "message": "Minimal Payment API is running!",
        "razorpay_available": RAZORPAY_AVAILABLE,
        "razorpay_key_configured": bool(RAZORPAY_KEY_ID and RAZORPAY_KEY_ID != "your_key"),
    }

@app.get("/api/v1/payments/plans")
def get_plans():
    """Get available subscription plans with pricing"""
    return {
        "plans": [
            {
                "id": "pro",
                "name": "Pro",
                "price": 749,
                "price_with_gst": 884,
                "currency": "INR",
                "period": "month"
            },
            {
                "id": "enterprise",
                "name": "Enterprise",
                "price": 4999,
                "price_with_gst": 5899,
                "currency": "INR",
                "period": "month"
            }
        ]
    }

@app.post("/api/v1/payments/create-order")
async def create_order(order_data: OrderCreate):
    """Create a Razorpay order for payment"""
    
    if not RAZORPAY_AVAILABLE:
        raise HTTPException(
            status_code=500, 
            detail="Razorpay module not installed. Run: pip install razorpay"
        )
    
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
                "created_at": datetime.utcnow().isoformat()
            }
        })
        
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

@app.post("/api/v1/payments/verify")
async def verify_payment(payment_data: PaymentVerify):
    """Verify Razorpay payment signature"""
    
    if not RAZORPAY_AVAILABLE:
        raise HTTPException(
            status_code=500,
            detail="Razorpay module not installed"
        )
    
    try:
        import hmac
        import hashlib
        
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
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        print(f"✅ Payment verified: {payment_data.razorpay_payment_id}")
        
        return {
            "status": "success",
            "message": "Payment verified successfully",
            "order_id": payment_data.razorpay_order_id,
            "payment_id": payment_data.razorpay_payment_id,
            "plan_id": payment_data.plan_id,
            "verified_at": datetime.utcnow().isoformat()
        }
    
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Error verifying payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to verify payment: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Minimal Payment API...")
    print(f"   Razorpay Available: {RAZORPAY_AVAILABLE}")
    print(f"   Key ID: {RAZORPAY_KEY_ID[:15]}..." if RAZORPAY_KEY_ID else "   No key configured")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
