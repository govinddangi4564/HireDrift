from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from sqlalchemy.orm import Session

from schemas.matching_schema import CandidateMatchOut
from services.matching_service import match_candidate, match_all_candidates
from models.base import get_db
from utils.security import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

http_bearer = HTTPBearer()

bearer = HTTPBearer()

router = APIRouter(prefix="/shortlist")

# You can replace this with your JWT dependency
def get_current_company_id(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    token = creds.credentials
    payload = decode_token(token)
    try:   
        company_id: str = payload.get("sub")
        if company_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject",
            )
        return UUID(company_id)
    except Exception as e:
        raise e

router = APIRouter(prefix="/matching")


@router.post("/run", response_model=List[CandidateMatchOut])
def run_matching(db: Session = Depends(get_db), company_id: UUID = Depends(get_current_company_id)):
    matches = match_all_candidates(db, company_id)
    if not matches:
        raise HTTPException(status_code=404, detail="No matches found")
    return matches


@router.post("/candidate/{candidate_id}", response_model=List[CandidateMatchOut])
def run_candidate_matching(candidate_id: UUID, db: Session = Depends(get_db), company_id: UUID = Depends(get_current_company_id)):
    matches = match_candidate(db, str(candidate_id), company_id)
    if not matches:
        raise HTTPException(status_code=404, detail="Candidate not found or no matches")
    return matches
