"""
Email templates for authentication flows
"""

from datetime import datetime


def email_verification_template(user_name: str, verification_link: str):
    """Email verification template"""
    subject = "✉️ Verify Your Email - Digital Burnout OS"
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .icon {{ font-size: 48px; margin-bottom: 10px; }}
            .button {{ display: inline-block; background: #8b5cf6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
            .code-box {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #8b5cf6; text-align: center; }}
            .link {{ color: #8b5cf6; word-break: break-all; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">📧</div>
                <h1>Verify Your Email</h1>
            </div>
            <div class="content">
                <p>Hi {user_name},</p>
                <p>Thanks for signing up for Digital Burnout OS! To get started, please verify your email address.</p>
                
                <center>
                    <a href="{verification_link}" class="button">Verify Email Address →</a>
                </center>
                
                <p style="margin-top: 30px;">Or copy and paste this link in your browser:</p>
                <div class="code-box">
                    <a href="{verification_link}" class="link">{verification_link}</a>
                </div>
                
                <p><strong>This link will expire in 7 days.</strong></p>
                
                <p style="margin-top: 30px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>© {datetime.now().year} Digital Burnout OS. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text = f"""
    Verify Your Email - Digital Burnout OS
    
    Hi {user_name},
    
    Thanks for signing up! Please verify your email address by clicking the link below:
    
    {verification_link}
    
    This link will expire in 7 days.
    
    If you didn't create an account, you can safely ignore this email.
    
    - Digital Burnout OS Team
    """
    
    return subject, html, text


def password_reset_template(user_name: str, reset_link: str):
    """Password reset template"""
    subject = "🔐 Reset Your Password - Digital Burnout OS"
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .icon {{ font-size: 48px; margin-bottom: 10px; }}
            .button {{ display: inline-block; background: #ef4444; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
            .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }}
            .link {{ color: #ef4444; word-break: break-all; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">🔐</div>
                <h1>Reset Your Password</h1>
            </div>
            <div class="content">
                <p>Hi {user_name},</p>
                <p>We received a request to reset your password for your Digital Burnout OS account.</p>
                
                <center>
                    <a href="{reset_link}" class="button">Reset Password →</a>
                </center>
                
                <p style="margin-top: 30px;">Or copy and paste this link in your browser:</p>
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; word-break: break-all;">
                    <a href="{reset_link}" class="link">{reset_link}</a>
                </div>
                
                <div class="warning">
                    <p style="margin: 0;"><strong>⚠️ Important:</strong></p>
                    <p style="margin: 5px 0 0 0;">This link will expire in 24 hours for security reasons.</p>
                </div>
                
                <p style="margin-top: 30px; color: #666;"><strong>If you didn't request a password reset, please ignore this email.</strong> Your password will remain unchanged.</p>
            </div>
            <div class="footer">
                <p>© {datetime.now().year} Digital Burnout OS. All rights reserved.</p>
                <p>For security reasons, this is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text = f"""
    Reset Your Password - Digital Burnout OS
    
    Hi {user_name},
    
    We received a request to reset your password. Click the link below to set a new password:
    
    {reset_link}
    
    ⚠️ This link will expire in 24 hours.
    
    If you didn't request a password reset, please ignore this email.
    
    - Digital Burnout OS Team
    """
    
    return subject, html, text


def welcome_email_template(user_name: str):
    """Welcome email after verification"""
    subject = "🎉 Welcome to Digital Burnout OS!"
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .icon {{ font-size: 48px; margin-bottom: 10px; }}
            .button {{ display: inline-block; background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }}
            .feature-list {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }}
            .feature {{ padding: 10px 0; border-bottom: 1px solid #e5e7eb; }}
            .feature:last-child {{ border-bottom: none; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">🎉</div>
                <h1>Welcome to Digital Burnout OS!</h1>
                <p>Your account is now verified and ready</p>
            </div>
            <div class="content">
                <p>Hi {user_name},</p>
                <p>Congratulations! Your email has been verified, and you're all set to start your journey towards better mental health and work-life balance.</p>
                
                <div class="feature-list">
                    <h3 style="margin-top: 0;">🚀 What's Next?</h3>
                    <div class="feature">
                        <strong>📝 Complete Your Profile</strong><br>
                        <span style="color: #666;">Set your baseline sleep hours and wellness goals</span>
                    </div>
                    <div class="feature">
                        <strong>📊 Start Tracking</strong><br>
                        <span style="color: #666;">Log your daily mood, sleep, and work intensity</span>
                    </div>
                    <div class="feature">
                        <strong>🧠 Get Insights</strong><br>
                        <span style="color: #666;">Receive AI-powered burnout predictions and recommendations</span>
                    </div>
                    <div class="feature">
                        <strong>⚡ Upgrade to Pro</strong><br>
                        <span style="color: #666;">Unlock advanced features and priority support</span>
                    </div>
                </div>
                
                <center>
                    <a href="https://yourapp.com/dashboard" class="button">Go to Dashboard →</a>
                </center>
                
                <p style="margin-top: 30px;">Need help getting started? Check out our <a href="https://yourapp.com/demo" style="color: #10b981;">interactive demo</a> or contact support.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text = f"""
    Welcome to Digital Burnout OS!
    
    Hi {user_name},
    
    Your account is now verified! Here's what you can do:
    
    📝 Complete Your Profile - Set your wellness goals
    📊 Start Tracking - Log daily mood and sleep  
    🧠 Get Insights - AI-powered burnout predictions
    ⚡ Upgrade to Pro - Unlock advanced features
    
    Visit your dashboard: https://yourapp.com/dashboard
    
    Welcome aboard!
    - Digital Burnout OS Team
    """
    
    return subject, html, text


def password_changed_template(user_name: str):
    """Password changed confirmation email"""
    subject = "✅ Password Changed Successfully"
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .icon {{ font-size: 48px; }}
            .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">✅</div>
                <h1>Password Changed</h1>
            </div>
            <div class="content">
                <p>Hi {user_name},</p>
                <p>This email confirms that your password was successfully changed on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}.</p>
                
                <div class="warning">
                    <p style="margin: 0;"><strong>⚠️ Didn't change your password?</strong></p>
                    <p style="margin: 5px 0 0 0;">If you didn't make this change, please contact us immediately at security@burnoutsolution.com</p>
                </div>
                
                <p>For your security, we recommend:</p>
                <ul>
                    <li>Using a unique password for each account</li>
                    <li>Using a password manager</li>
                    <li>Enabling two-factor authentication (coming soon!)</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    """
    
    text = f"""
    Password Changed Successfully
    
    Hi {user_name},
    
    Your password was successfully changed on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}.
    
    ⚠️ If you didn't make this change, contact us immediately at security@burnoutsolution.com
    
    - Digital Burnout OS Team
    """
    
    return subject, html, text
