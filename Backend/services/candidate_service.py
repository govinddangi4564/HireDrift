from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from uuid import UUID
from models import Candidate
from schemas.candidate_schema import CandidateUpdate
from datetime import datetime, timedelta, timezone

def get_candidates(
    db: Session,
    role: Optional[str] = None,
    department: Optional[str] = None,
    days: Optional[int] = None,
    search: Optional[str] = None,
    minScore: Optional[int] = None,
    sortBy: Optional[str] = None,
    skip: int = 0,
    limit: int = 20
) -> List[Candidate]:
    query = db.query(Candidate)

    # Search by name or email
    if search:
        query = query.filter(or_(
            Candidate.name.ilike(f"%{search}%"),
            Candidate.email.ilike(f"%{search}%")
        ))

    # Filter by uploaded_at within the last `days` days
    if days:
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
        query = query.filter(Candidate.uploaded_at >= cutoff_date)

    # Filter by role (assuming stored in skills JSON)
    if role:
        query = query.filter(Candidate.skills.contains([role]))

    # Filter by department (assuming stored in skills JSON or separate field)
    if department:
        # If you have a `department` field, use:
        query = query.filter(Candidate.department == department)

    # Filter by minScore (assuming experience is a score metric)
    if minScore:
        query = query.filter(Candidate.experience >= minScore)

    # Sorting
    if sortBy in ["name", "uploaded_at", "experience"]:
        query = query.order_by(getattr(Candidate, sortBy))

    return query.offset(skip).limit(limit).all()


def get_candidate(db: Session, candidate_id: UUID) -> Optional[Candidate]:
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()


def update_candidate(db: Session, candidate_id: UUID, updates: CandidateUpdate) -> Optional[Candidate]:
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        return None
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(candidate, field, value)
    db.commit()
    db.refresh(candidate)
    return candidate


def delete_candidate(db: Session, candidate_id: UUID) -> bool:
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        return False
    db.delete(candidate)
    db.commit()
    return True
