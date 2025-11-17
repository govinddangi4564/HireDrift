from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from schemas.candidate_schema import CandidateOut, CandidateUpdate
from services.candidate_service import get_candidates, get_candidate, update_candidate, delete_candidate
from models.base import get_db 
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from utils.security import decode_token

bearer = HTTPBearer()

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

router = APIRouter(prefix="/candidates")

@router.get("/", response_model=List[CandidateOut])
def fetch_candidates(
    role: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    days: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    minScore: Optional[int] = Query(None),
    sortBy: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    company_id: UUID = Depends(get_current_company_id)
):
    return get_candidates(db, role, department, days, search, minScore, sortBy, skip, limit)


@router.get("/{candidate_id}", response_model=CandidateOut)
def fetch_candidate(candidate_id: UUID, 
                    db: Session = Depends(get_db),
                    company_id: UUID = Depends(get_current_company_id)):
    candidate = get_candidate(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.put("/{candidate_id}", response_model=CandidateOut)
def update_candidate_endpoint(candidate_id: UUID, updates: CandidateUpdate, 
                              db: Session = Depends(get_db),
                              company_id: UUID = Depends(get_current_company_id)):
    candidate = update_candidate(db, candidate_id, updates)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.delete("/{candidate_id}", status_code=204)
def delete_candidate_endpoint(candidate_id: UUID, 
                              db: Session = Depends(get_db),
                              company_id: UUID = Depends(get_current_company_id)):
    success = delete_candidate(db, candidate_id)
    if not success:
        raise HTTPException(status_code=404, detail="Candidate not found")
