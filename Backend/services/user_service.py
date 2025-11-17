from models.user_model import UserModel
from schemas.user_schema import UserRegisterSchema
from models.base import session
from utils.log_config import logger
from utils.utility import get_new_id
from utils.security import hash_password, create_access_token
from datetime import timedelta
from utils.mail import send_reset_email
import os


async def register_user_service(user: UserRegisterSchema, role):
    user_id = get_new_id()
    hashed_password = hash_password(user.password)
    user_instance = UserModel(
        user_id = user_id,
        full_name = user.fullName,
        email = user.email,
        password = hashed_password,
        phone = user.phone,
        picture = user.picture,
        newsletter = user.newsletter,
        role = role
    )
    try:
        session.add(user_instance)
        session.commit()
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise Exception("Error registering user")


async def get_user_by_email_service(email):
    try:
        user = session.query(UserModel).filter(UserModel.email == email).first()
    except Exception as e:
        logger.error(f"Error fetching user by email: {e}")
        raise Exception(f"Error fetching user by email: {email}")
    return user


async def get_user_by_id_service(user_id):
    try:
        user = session.query(UserModel).filter(UserModel.id == user_id).first()
    except Exception as e:
        logger.error(f"Error fetching user by ID: {e}")
        raise Exception(f"Error fetching user by ID: {user_id}")
    return user


async def send_password_reset_email(user: UserModel):
    FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL")
    token = create_access_token(data={"user_id": str(user.user_id), "email": user.email}, expires_delta=timedelta(hours=1))
    frontend_link = f"{FRONTEND_BASE_URL}/reset-password?token={token}"
    await send_reset_email(user.email, frontend_link)



async def update_password(user: UserModel, new_password: str):
    hashed_password = hash_password(new_password)
    try:
        user.password = hashed_password
        session.add(user)
        session.commit()
    except Exception as e:
        logger.error(f"Error updating password: {e}")
        raise Exception("Error updating password")

