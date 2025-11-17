from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from schemas.jd_schema import JDCreate, JDUpdate, JDOut
from services.jd_service import JDService
from models.base import get_db

router = APIRouter(prefix="/jds")


@router.get("/", response_model=list[JDOut])
def get_all_jds(db: Session = Depends(get_db)):
    return JDService.get_all(db)


@router.get("/{jd_id}", response_model=JDOut)
def get_jd(jd_id: UUID, db: Session = Depends(get_db)):
    jd = JDService.get_by_id(db, jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Job Description not found")
    return jd


@router.post("/", response_model=JDOut, status_code=201)
def create_jd(payload: JDCreate, db: Session = Depends(get_db)):
    return JDService.create(db, payload)


@router.put("/{jd_id}", response_model=JDOut)
def update_jd(jd_id: UUID, payload: JDUpdate, db: Session = Depends(get_db)):
    jd = JDService.update(db, jd_id, payload)
    if not jd:
        raise HTTPException(status_code=404, detail="Job Description not found")
    return jd


@router.delete("/{jd_id}", status_code=204)
def delete_jd(jd_id: UUID, db: Session = Depends(get_db)):
    success = JDService.delete(db, jd_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job Description not found")
    return None
