from sqlalchemy.orm import Session
from models import Candidate, JobDescription, CandidateMatch
from datetime import datetime, timezone
from typing import List
import numpy as np

# Example placeholder for SBERT embedding function
def compute_sbert_similarity(text1: str, text2: str) -> float:
    # Implement actual SBERT embeddings & cosine similarity here
    return np.random.random()  # Placeholder

# Example skill matching calculation
def compute_skill_match(candidate_skills: list, jd_keywords: list) -> int:
    if not candidate_skills or not jd_keywords:
        return 0
    matched = set(candidate_skills) & set(jd_keywords)
    return int(len(matched) / len(jd_keywords) * 100)

def match_candidate(db: Session, candidate_id: str, company_id) -> List[CandidateMatch]:
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        return []

    matches = []
    job_descriptions = db.query(JobDescription).filter(JobDescription.company_id == company_id).all()

    for jd in job_descriptions:
        skill_percent = compute_skill_match(candidate.skills, jd.keywords)
        sbert_score = compute_sbert_similarity(candidate.resume_text, jd.description)
        final_score = int(0.5 * skill_percent + 0.5 * sbert_score * 100)  # Example weighting

        match = CandidateMatch(
            candidate_id=candidate.id,
            jd_id=jd.id,
            skill_match_percent=skill_percent,
            sbert_score=sbert_score,
            final_score=final_score,
            matched_skills=list(set(candidate.skills) & set(jd.keywords)),
            calculated_at=datetime.now(timezone.utc)
        )
        db.add(match)
        matches.append(match)

    db.commit()
    for m in matches:
        db.refresh(m)
    return matches


def match_all_candidates(db: Session, company_id) -> List[CandidateMatch]:
    candidates = db.query(Candidate).filter(Candidate.company_id == company_id).all()
    all_matches = []
    for c in candidates:
        all_matches.extend(match_candidate(db, str(c.id), company_id))
    return all_matches
