from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from schemas.shortlist_schema import ShortlistOut, ShortlistCreate
from services.shortlist_service import get_shortlist, create_shortlist, delete_shortlist
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


@router.get("/", response_model=List[ShortlistOut])
def fetch_shortlist(candidateName: Optional[str] = Query(None), db: Session = Depends(get_db), company_id: UUID = Depends(get_current_company_id)):
    return get_shortlist(db, candidateName)


@router.post("/", response_model=ShortlistOut)
def add_to_shortlist(shortlist_data: ShortlistCreate, db: Session = Depends(get_db), company_id: UUID = Depends(get_current_company_id)):
    return create_shortlist(db, shortlist_data, company_id)


@router.delete("/{id}", status_code=204)
def remove_from_shortlist(id: UUID, db: Session = Depends(get_db), company_id: UUID = Depends(get_current_company_id)):
    success = delete_shortlist(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Shortlist entry not found")
