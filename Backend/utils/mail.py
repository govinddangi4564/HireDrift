from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os


async def send_reset_email(email_to: EmailStr, reset_link: str):
    conf = ConnectionConfig(
        MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
        MAIL_FROM=os.getenv("MAIL_FROM"),
        MAIL_SERVER=os.getenv("MAIL_SERVER"),
        MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
        MAIL_TLS=True,
        MAIL_SSL=False,
        USE_CREDENTIALS=True,
    )
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email_to],
        body=f"Click the link below to reset your password:\n{reset_link}",
        subtype="plain",
    )
    fm = FastMail(conf)
    await fm.send_message(message)
