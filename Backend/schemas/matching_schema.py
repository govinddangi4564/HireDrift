from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional

class CandidateMatchOut(BaseModel):
    id: UUID
    candidate_id: UUID
    jd_id: UUID
    skill_match_percent: int
    sbert_score: float
    final_score: int
    matched_skills: Optional[List[str]]
    calculated_at: datetime

    class Config:
        orm_mode = True
