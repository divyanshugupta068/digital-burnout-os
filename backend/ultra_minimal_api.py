"""
ULTRA-MINIMAL PAYMENT API - NO EXTERNAL DEPENDENCIES
Works without razorpay library! Uses standard library only.
Run with: python ultra_minimal_api.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import hmac
import hashlib
import urllib.request
import urllib.parse
from datetime import datetime
from base64 import b64encode

# Configuration
PORT = 8000
RAZORPAY_KEY_ID = "rzp_test_SDG8SwjheuHVQb"
RAZORPAY_KEY_SECRET = "v1O3g4UE2IEDlfNRw3AVgrXT"

# Plan pricing in paise
PLAN_PRICING = {
    "pro": 74900,  # ₹749
    "enterprise": 499900,  # ₹4999
}

class PaymentHandler(BaseHTTPRequestHandler):
    
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self._handle_root()
        elif self.path == '/api/v1/payments/plans':
            self._handle_plans()
        else:
            self._send_404()
    
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        
        if self.path == '/api/v1/payments/create-order':
            self._handle_create_order(body)
        elif self.path == '/api/v1/payments/verify':
            self._handle_verify(body)
        else:
            self._send_404()
    
    def _handle_root(self):
        response = {
            "message": "Ultra-Minimal Payment API - No razorpay lib needed!",
            "status": "running"
        }
        self._send_json(200, response)
    
    def _handle_plans(self):
        response = {
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
        self._send_json(200, response)
    
    def _handle_create_order(self, body):
        try:
            data = json.loads(body)
            plan_id = data.get('plan_id')
            
            if plan_id not in PLAN_PRICING:
                self._send_json(400, {"detail": "Invalid plan ID"})
                return
            
            # Calculate amount with GST
            base_amount = PLAN_PRICING[plan_id]
            total_amount = int(base_amount * 1.18)
            
            # Create Razorpay order via API
            order = self._create_razorpay_order(total_amount, plan_id)
            
            if order:
                print(f"✅ Order created: {order['id']} for ₹{total_amount/100}")
                self._send_json(200, {
                    "id": order["id"],
                    "amount": order["amount"],
                    "currency": order["currency"],
                    "plan_id": plan_id
                })
            else:
                self._send_json(500, {"detail": "Failed to create Razorpay order"})
                
        except Exception as e:
            print(f"❌ Error: {e}")
            self._send_json(500, {"detail": str(e)})
    
    def _handle_verify(self, body):
        try:
            data = json.loads(body)
            
            # Verify signature
            verification_string = f"{data['razorpay_order_id']}|{data['razorpay_payment_id']}"
            expected_signature = hmac.new(
                RAZORPAY_KEY_SECRET.encode(),
                verification_string.encode(),
                hashlib.sha256
            ).hexdigest()
            
            if expected_signature == data['razorpay_signature']:
                print(f"✅ Payment verified: {data['razorpay_payment_id']}")
                self._send_json(200, {
                    "status": "success",
                    "message": "Payment verified successfully",
                    "order_id": data['razorpay_order_id'],
                    "payment_id": data['razorpay_payment_id'],
                    "plan_id": data['plan_id'],
                    "verified_at": datetime.utcnow().isoformat()
                })
            else:
                self._send_json(400, {"detail": "Invalid payment signature"})
                
        except Exception as e:
            print(f"❌ Verification error: {e}")
            self._send_json(500, {"detail": str(e)})
    
    def _create_razorpay_order(self, amount, plan_id):
        """Create order using Razorpay REST API"""
        try:
            url = "https://api.razorpay.com/v1/orders"
            
            # Basic auth
            credentials = f"{RAZORPAY_KEY_ID}:{RAZORPAY_KEY_SECRET}"
            auth_header = b64encode(credentials.encode()).decode()
            
            # Request body
            order_data = {
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1,
                "notes": {
                    "plan_id": plan_id,
                    "created_at": datetime.utcnow().isoformat()
                }
            }
            
            # Make request
            req = urllib.request.Request(
                url,
                data=json.dumps(order_data).encode('utf-8'),
                headers={
                    'Authorization': f'Basic {auth_header}',
                    'Content-Type': 'application/json'
                },
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                return result
                
        except Exception as e:
            print(f"❌ Razorpay API error: {e}")
            return None
    
    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def _send_404(self):
        self._send_json(404, {"detail": "Not found"})
    
    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format%args}")

def run_server():
    server = HTTPServer(('127.0.0.1', PORT), PaymentHandler)
    print("=" * 60)
    print("🚀 ULTRA-MINIMAL PAYMENT API")
    print("=" * 60)
    print(f"✅ Server running on: http://127.0.0.1:{PORT}")
    print(f"✅ Razorpay Key: {RAZORPAY_KEY_ID}")
    print(f"✅ No external dependencies needed!")
    print("=" * 60)
    print("\n📍 Available endpoints:")
    print(f"   GET  http://127.0.0.1:{PORT}/")
    print(f"   GET  http://127.0.0.1:{PORT}/api/v1/payments/plans")
    print(f"   POST http://127.0.0.1:{PORT}/api/v1/payments/create-order")
    print(f"   POST http://127.0.0.1:{PORT}/api/v1/payments/verify")
    print("\n💡 Now test your payment at: http://localhost:3000")
    print("\n⏹  Press Ctrl+C to stop\n")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped!")
        server.shutdown()

if __name__ == "__main__":
    run_server()
