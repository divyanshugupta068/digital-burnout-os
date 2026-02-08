"""
Email Notification Service
Supports both SMTP (development) and SendGrid (production)
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from datetime import datetime

# Configuration
EMAIL_FROM = os.getenv("EMAIL_FROM", "noreply@burnoutsolution.com")
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "Digital Burnout OS")

# SMTP Configuration (for development/Gmail)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")  # App password for Gmail

# SendGrid (for production)
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")

# Feature flag
USE_SENDGRID = os.getenv("USE_SENDGRID", "false").lower() == "true"


class EmailService:
    """
    Email service that can use either SMTP or SendGrid
    """
    
    @staticmethod
    def send_email_smtp(to_email: str, subject: str, html_body: str, text_body: Optional[str] = None):
        """Send email via SMTP"""
        try:
            if not SMTP_USER or not SMTP_PASSWORD:
                print("⚠️ SMTP not configured - email not sent")
                print(f"   Would send to: {to_email}")
                print(f"   Subject: {subject}")
                return False
            
            msg = MIMEMultipart('alternative')
            msg['From'] = f"{EMAIL_FROM_NAME} <{EMAIL_FROM}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add text version
            if text_body:
                text_part = MIMEText(text_body, 'plain')
                msg.attach(text_part)
            
            # Add HTML version
            html_part = MIMEText(html_body, 'html')
            msg.attach(html_part)
            
            # Send via SMTP
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
            
            print(f"✅ Email sent via SMTP to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ SMTP email error: {str(e)}")
            return False
    
    @staticmethod
    def send_email_sendgrid(to_email: str, subject: str, html_body: str, text_body: Optional[str] = None):
        """Send email via SendGrid"""
        try:
            if not SENDGRID_API_KEY:
                print("⚠️ SendGrid not configured - email not sent")
                return False
            
            # Import sendgrid only if needed
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail, Email, To, Content
            
            message = Mail(
                from_email=Email(EMAIL_FROM, EMAIL_FROM_NAME),
                to_emails=To(to_email),
                subject=subject,
                plain_text_content=Content("text/plain", text_body or ""),
                html_content=Content("text/html", html_body)
            )
            
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            
            print(f"✅ Email sent via SendGrid to {to_email} (status: {response.status_code})")
            return True
            
        except ImportError:
            print("⚠️ SendGrid package not installed. Install with: pip install sendgrid")
            return False
        except Exception as e:
            print(f"❌ SendGrid email error: {str(e)}")
            return False
    
    @staticmethod
    def send_email(to_email: str, subject: str, html_body: str, text_body: Optional[str] = None):
        """
        Send email using configured provider
        """
        if USE_SENDGRID:
            return EmailService.send_email_sendgrid(to_email, subject, html_body, text_body)
        else:
            return EmailService.send_email_smtp(to_email, subject, html_body, text_body)


# Email Templates
class EmailTemplates:
    """Pre-built email templates"""
    
    @staticmethod
    def payment_success(user_name: str, plan_name: str, amount: float, payment_id: str):
        """Payment success confirmation email"""
        subject = f"✅ Payment Successful - {plan_name} Plan Activated!"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .success-icon {{ font-size: 48px; margin-bottom: 10px; }}
                .details {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }}
                .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
                .button {{ display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="success-icon">🎉</div>
                    <h1>Payment Successful!</h1>
                    <p>Welcome to {plan_name} Plan</p>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    <p>Thank you for subscribing! Your payment has been processed successfully, and your <strong>{plan_name}</strong> plan is now active.</p>
                    
                    <div class="details">
                        <h3>Payment Details</h3>
                        <p><strong>Plan:</strong> {plan_name}</p>
                        <p><strong> Amount Paid:</strong> ₹{amount}</p>
                        <p><strong>Payment ID:</strong> {payment_id}</p>
                        <p><strong>Date:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                    </div>
                    
                    <p>🎯 <strong>What's Next?</strong></p>
                    <ul>
                        <li>Start tracking your sleep, mood, and work patterns</li>
                        <li>Get AI-powered burnout predictions</li>
                        <li>Download comprehensive PDF reports</li>
                        <li>Access priority support anytime</li>
                    </ul>
                    
                    <center>
                        <a href="https://yourapp.com/dashboard" class="button">Go to Dashboard →</a>
                    </center>
                    
                    <p style="margin-top: 30px;">If you have any questions, reply to this email or contact us at support@burnoutsolution.com.</p>
                </div>
                <div class="footer">
                    <p>© {datetime.now().year} Digital Burnout OS. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply directly to this message.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Payment Successful!
        
        Hi {user_name},
        
        Thank you for subscribing to the {plan_name} plan!
        
        Payment Details:
        - Plan: {plan_name}
        - Amount: ₹{amount}
        - Payment ID: {payment_id}
        - Date: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
        
        Your subscription is now active. Visit your dashboard to get started!
        
        Questions? Contact us at support@burnoutsolution.com
        
        - Digital Burnout OS Team
        """
        
        return subject, html, text
    
    @staticmethod
    def burnout_alert(user_name: str, risk_score: int, risk_level: str):
        """Burnout warning alert email"""
        subject = f"⚠️ Burnout Alert: {risk_level} Risk Detected"
        
        emoji = "⚠️" if risk_level == "Medium" else "🚨" if risk_level == "High" else "😟"
        color = "#f59e0b" if risk_level == "Medium" else "#ef4444" if risk_level == "High" else "#6b7280"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: {color}; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .warning-icon {{ font-size: 48px; }}
                .score-box {{ background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid {color}; }}
                .score {{ font-size: 48px; font-weight: bold; color: {color}; }}
                .button {{ display: inline-block; background: {color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="warning-icon">{emoji}</div>
                    <h1>Burnout Alert</h1>
                    <p>{risk_level} Risk Detected</p>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    <p>Our AI has detected concerning patterns in your behavioral data. Your current burnout risk score indicates a <strong>{risk_level} risk</strong> of burnout.</p>
                    
                    <div class="score-box">
                        <div class="score">{risk_score}/100</div>
                        <p>Burnout Risk Score</p>
                    </div>
                    
                    <p>💡 <strong>Recommended Actions:</strong></p>
                    <ul>
                        <li>Take a break and practice self-care</li>
                        <li>Review your sleep patterns and improve sleep quality</li>
                        <li>Consider reducing work intensity temporarily</li>
                        <li>Talk to a mental health professional if needed</li>
                    </ul>
                    
                    <center>
                        <a href="https://yourapp.com/analytics" class="button">View Detailed Analysis →</a>
                    </center>
                    
                    <p style="margin-top: 30px;"><em>Remember: This is an early warning system. Taking action now can prevent serious burnout later.</em></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Burnout Alert: {risk_level} Risk
        
        Hi {user_name},
        
        Our AI has detected a {risk_level} burnout risk (score: {risk_score}/100).
        
        Recommended Actions:
        - Take breaks and practice self-care
        - Improve sleep quality
        - Reduce work intensity
        - Consider professional help if needed
        
        View detailed analysis: https://yourapp.com/analytics
        
        Take care of yourself!
        - Digital Burnout OS
        """
        
        return subject, html, text
    
    @staticmethod
    def weekly_summary(user_name: str, avg_mood: float, avg_sleep: float, burnout_trend: str):
        """Weekly summary email"""
        subject = f"📊 Your Weekly Burnout Summary"
        
        trend_emoji = "📈" if burnout_trend == "improving" else "📉" if burnout_trend == "worsening" else "➡️"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .stat-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }}
                .stat {{ background: white; padding: 15px; border-radius: 8px; text-align: center; }}
                .stat-value {{ font-size: 32px; font-weight: bold; color: #8b5cf6; }}
                .button {{ display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 Your Weekly Summary</h1>
                    <p>{datetime.now().strftime('%B %d, %Y')}</p>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    <p>Here's your burnout analytics summary for the past week:</p>
                    
                    <div class="stat-grid">
                        <div class="stat">
                            <div class="stat-value">{avg_mood:.1f}/5</div>
                            <p>Average Mood</p>
                        </div>
                        <div class="stat">
                            <div class="stat-value">{avg_sleep:.1f}h</div>
                            <p>Average Sleep</p>
                        </div>
                    </div>
                    
                    <p>{trend_emoji} <strong>Trend:</strong> Your burnout risk is {burnout_trend} this week</p>
                    
                    <center>
                        <a href="https://yourapp.com/analytics" class="button">View Full Report →</a>
                    </center>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Your Weekly Summary
        
        Hi {user_name},
        
        Here's your week at a glance:
        - Average Mood: {avg_mood:.1f}/5
        - Average Sleep: {avg_sleep:.1f} hours
        - Trend: {burnout_trend}
        
        View full report: https://yourapp.com/analytics
        
        Keep tracking!
        - Digital Burnout OS
        """
        
        return subject, html, text


# Convenience functions
def send_payment_confirmation(to_email: str, user_name: str, plan_name: str, amount: float, payment_id: str):
    """Send payment confirmation email"""
    subject, html, text = EmailTemplates.payment_success(user_name, plan_name, amount, payment_id)
    return EmailService.send_email(to_email, subject, html, text)


def send_burnout_alert(to_email: str, user_name: str, risk_score: int, risk_level: str):
    """Send burnout alert email"""
    subject, html, text = EmailTemplates.burnout_alert(user_name, risk_score, risk_level)
    return EmailService.send_email(to_email, subject, html, text)


def send_weekly_summary(to_email: str, user_name: str, avg_mood: float, avg_sleep: float, burnout_trend: str):
    """Send weekly summary email"""
    subject, html, text = EmailTemplates.weekly_summary(user_name, avg_mood, avg_sleep, burnout_trend)
    return EmailService.send_email(to_email, subject, html, text)
