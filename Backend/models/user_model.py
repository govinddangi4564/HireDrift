from models.base import Base
from sqlalchemy import Column, String, Boolean, UUID


class UserModel(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    newsletter = Column(Boolean, nullable=True)
    picture = Column(String, nullable=True)
    role = Column(String, nullable=False, default="user")
