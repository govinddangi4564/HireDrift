from models.base import Base
from sqlalchemy import Column, String, TIMESTAMP, UUID, func


class Resume(Base):
    __tablename__ = "resumes"

    resume_id = Column(UUID(as_uuid=True), primary_key=True)
    uploaded_path = Column(String(255), nullable=False)
    actual_name = Column(String(255), nullable=False)
    file_format = Column(String(20), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

