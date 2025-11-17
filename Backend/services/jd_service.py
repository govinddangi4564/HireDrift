from sqlalchemy.orm import Session
from uuid import UUID

from models.job_description_model import JobDescription
from schemas.jd_schema import JDCreate, JDUpdate


class JDService:

    @staticmethod
    def get_all(db: Session):
        return db.query(JobDescription).all()

    @staticmethod
    def get_by_id(db: Session, jd_id: UUID):
        return db.query(JobDescription).filter(JobDescription.id == jd_id).first()

    @staticmethod
    def create(db: Session, data: JDCreate):
        jd = JobDescription(**data.dict())
        db.add(jd)
        db.commit()
        db.refresh(jd)
        return jd

    @staticmethod
    def update(db: Session, jd_id: UUID, data: JDUpdate):
        jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
        if not jd:
            return None

        update_data = data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(jd, key, value)

        db.commit()
        db.refresh(jd)
        return jd

    @staticmethod
    def delete(db: Session, jd_id: UUID):
        jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
        if not jd:
            return False
        db.delete(jd)
        db.commit()
        return True
