from typing import List, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr


class CandidateBase(BaseModel):
    name: str
    email: EmailStr
    company_id: UUID
    resume_id: UUID
    skills: Optional[List[str]] = []
    experience_years: Optional[int]
    experience: Optional[int]
    education: Optional[str]
    summary: Optional[str]
    department: Optional[str]
    projects: Optional[List[dict]] = []


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    skills: Optional[List[str]]
    experience_years: Optional[int]
    experience: Optional[int]
    education: Optional[str]
    summary: Optional[str]
    department: Optional[str]
    projects: Optional[List[dict]]


class CandidateOut(CandidateBase):
    id: UUID
    uploaded_at: datetime
    parsed_at: Optional[datetime]

    class Config:
        orm_mode = True
