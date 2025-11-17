from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class ShortlistBase(BaseModel):
    candidate_id: UUID
    jd_id: UUID
    shortlisted: bool = False

class ShortlistCreate(ShortlistBase):
    pass

class ShortlistOut(ShortlistBase):
    id: UUID
    shortlisted_at: datetime
    shortlisted_by: Optional[UUID]

    class Config:
        orm_mode = True
