from datetime import timedelta
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from ..core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    create_verification_token,
    create_password_reset_token,
    verify_verification_token,
    verify_password_reset_token,
    decode_token
)
from ..core.config import settings
from ..core.database import get_db
from ..models.user import User
from ..schemas.token import Token
from ..schemas.user import UserCreate, User as UserSchema
from ..services.auth_emails import (
    email_verification_template,
    password_reset_template,
    welcome_email_template,
    password_changed_template
)
from ..services.email_service import EmailService

router = APIRouter()

# Pydantic models for request/response
class EmailVerificationRequest(BaseModel):
    email: EmailStr

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr


@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Please contact support.",
        )
    
    # Check if email is verified (optional - can be strict or lenient)
    # if not user.is_email_verified:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Please verify your email first.",
    #     )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "email": user.email}
    )
    
    print(f"✅ User logged in: {user.email}")
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/signup", response_model=UserSchema)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Create new user account and send verification email
    """
    # Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists.",
        )
    
    # Create verification token
    verification_token = create_verification_token(user_in.email)
    
    # Create user
    user_obj = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_email_verified=False,  # Will verify via email
        email_verification_token=verification_token
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    
    # Send verification email
    try:
        verification_link = f"http://localhost:3000/verify-email?token={verification_token}"
        subject, html, text = email_verification_template(user_in.full_name or "User", verification_link)
        EmailService.send_email(user_in.email, subject, html, text)
        print(f"✅ Verification email sent to {user_in.email}")
    except Exception as e:
        print(f"⚠️ Failed to send verification email: {str(e)}")
        # Don't fail signup if email fails
    
    print(f"✅ New user created: {user_in.email}")
    return user_obj


@router.post("/verify-email")
def verify_email(token: str = Body(..., embed=True), db: Session = Depends(get_db)):
    """
    Verify user's email address using the token from email
    """
    email = verify_verification_token(token)
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification token",
        )
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    
    if user.is_email_verified:
        return {
            "message": "Email already verified",
            "already_verified": True
        }
    
    # Mark email as verified
    user.is_email_verified = True
    user.email_verification_token = None
    db.commit()
    
    # Send welcome email
    try:
        subject, html, text = welcome_email_template(user.full_name or "User")
        EmailService.send_email(user.email, subject, html, text)
        print(f"✅ Welcome email sent to {user.email}")
    except Exception as e:
        print(f"⚠️ Failed to send welcome email: {str(e)}")
    
    print(f"✅ Email verified for: {user.email}")
    
    return {
        "message": "Email verified successfully!",
        "email": user.email
    }


@router.post("/resend-verification")
def resend_verification_email(
    request: ResendVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    Resend verification email
    """
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Don't reveal if user exists or not for security
        return {"message": "If the email exists, a verification link has been sent."}
    
    if user.is_email_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already verified",
        )
    
    # Generate new token
    verification_token = create_verification_token(user.email)
    user.email_verification_token = verification_token
    db.commit()
    
    # Send email
    try:
        verification_link = f"http://localhost:3000/verify-email?token={verification_token}"
        subject, html, text = email_verification_template(user.full_name or "User", verification_link)
        EmailService.send_email(user.email, subject, html, text)
        print(f"✅ Verification email resent to {user.email}")
    except Exception as e:
        print(f"❌ Failed to send verification email: {str(e)}")
    
    return {"message": "If the email exists, a verification link has been sent."}


@router.post("/forgot-password")
def forgot_password(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Request password reset email
    """
    user = db.query(User).filter(User.email == request.email).first()
    
    # Don't reveal if user exists for security
    if not user:
        return {"message": "If the email exists, a password reset link has been sent."}
    
    # Generate reset token
    reset_token = create_password_reset_token(user.email)
    
    # Send email
    try:
        reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
        subject, html, text = password_reset_template(user.full_name or "User", reset_link)
        EmailService.send_email(user.email, subject, html, text)
        print(f"✅ Password reset email sent to {user.email}")
    except Exception as e:
        print(f"❌ Failed to send password reset email: {str(e)}")
    
    return {"message": "If the email exists, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(
    request: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Reset password using token from email
    """
    email = verify_password_reset_token(request.token)
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired password reset token",
        )
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    
    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    db.commit()
    
    # Send confirmation email
    try:
        subject, html, text = password_changed_template(user.full_name or "User")
        EmailService.send_email(user.email, subject, html, text)
        print(f"✅ Password changed confirmation sent to {user.email}")
    except Exception as e:
        print(f"⚠️ Failed to send password changed email: {str(e)}")
    
    print(f"✅ Password reset successfully for: {user.email}")
    
    return {
        "message": "Password reset successfully!",
        "email": user.email
    }


@router.post("/change-password")
def change_password(
    request: PasswordChange,
    db: Session = Depends(get_db),
    current_user_id: int = 1  # TODO: Get from auth token
):
    """
    Change password (requires current password for security)
    """
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(request.current_password, user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Incorrect current password",
        )
    
    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    db.commit()
    
    # Send confirmation email
    try:
        subject, html, text = password_changed_template(user.full_name or "User")
        EmailService.send_email(user.email, subject, html, text)
    except Exception as e:
        print(f"⚠️ Failed to send password changed email: {str(e)}")
    
    print(f"✅ Password changed for: {user.email}")
    
    return {"message": "Password changed successfully!"}


@router.post("/refresh-token")
def refresh_token(refresh_token: str = Body(..., embed=True)):
    """
    Refresh access token using refresh token
    """
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )
    
    user_id = payload.get("sub")
    email = payload.get("email")
    
    # Create new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": user_id, "email": email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }
