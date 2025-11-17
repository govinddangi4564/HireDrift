from fastapi import APIRouter, HTTPException
from schemas.user_schema import UserRegisterSchema, UserLoginSchema, UserResponseSchema, RefreshRequest, PasswordResetRequest, PasswordForgetRequest
from services.user_service import register_user_service, get_user_by_email_service, send_password_reset_email, update_password
from utils.log_config import logger
from utils.security import verify_password, create_access_token, create_refresh_token, decode_token
import jwt
user_router = APIRouter()


@user_router.post("/register")
async def register_user(user: UserRegisterSchema):

    existing_user = await get_user_by_email_service(user.email)
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        await register_user_service(user, role="user")
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        return {"message": f"Error registering user: {user.fullName}"}

    return {"message": f"User {user.fullName} registered successfully"}



@user_router.post("/login", response_model=UserResponseSchema)
async def login_user(user: UserLoginSchema):
    existing_user = await get_user_by_email_service(user.email)
    
    if not existing_user or verify_password(user.password, existing_user.password) is False:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(data={"user_id": str(existing_user.user_id), "email": existing_user.email})
    refresh_token = create_refresh_token(data={"user_id": str(existing_user.user_id), "email": existing_user.email})

    resp = {
        'token': token,
        'refresh_token': refresh_token,
        'user_id': existing_user.user_id,
        'fullName': existing_user.full_name,
        'email': existing_user.email,
        'phone': existing_user.phone,
        'newsletter': existing_user.newsletter,
        'picture': existing_user.picture
    }

    return resp


@user_router.post("/refresh")
def refresh_token(request: RefreshRequest):
    try:
        payload = decode_token(request.refresh_token)
        user_id = payload.get("user_id")
        email = payload.get("email")
        if not user_id or not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Error decoding token: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

    # Issue new access token
    access_token = create_access_token(data={"user_id": user_id, "email": email})
    return {"token": access_token}


@user_router.post("/forget-password")
async def forget_password(pw: PasswordForgetRequest):
    email = pw.email
    existing_user = await get_user_by_email_service(email)
    
    if not existing_user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    try:
        await send_password_reset_email(existing_user)
        logger.info(f"Password reset requested for email: {email}")
    except Exception as e:
        logger.error(f"Error sending password reset email: {e}")
        raise HTTPException(status_code=500, detail="Error sending password reset email")
    
    return {"message": f"Password reset link sent to {email}"}


@user_router.post("/reset-password")
async def reset_password(rp: PasswordResetRequest):
    try:
        payload = decode_token(rp.token)
        user_id = payload.get("user_id")
        email = payload.get("email")
        if not user_id or not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Error decoding token: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await get_user_by_email_service(email)
    if not user or str(user.user_id) != user_id:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        await update_password(user, rp.new_password)
    except Exception as e:
        logger.error(f"Error resetting password: {e}")
        raise HTTPException(status_code=500, detail="Error resetting password")

    return {"message": "Password reset successful"}
