import uuid
import aiofiles
from pathlib import Path
from fastapi import HTTPException

from utils.utility import format_datetime_to_ist, BASE_DIR
from utils.log_config import logger
from models.base import session
from models.resume_model import Resume


UPLOADS_DIR = BASE_DIR / "uploads" / "resumes" 
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


async def get_resume_by_id_db(resume_id):
    try:
        resp = session.query(Resume).filter(Resume.resume_id == resume_id).first()
    except Exception as e:
        logger.error(f"Error fetching resume by ID: {e}")
        raise HTTPException(status_code=500, detail="Error fetching resume")

    if resp is None:
        raise HTTPException(status_code=404, detail=f"Resume not found for id: {resume_id}")
    
    D = {
        "resume_id":resp.resume_id, 
        "uploaded_path":resp.uploaded_path, 
        "actual_name":resp.actual_name,  
        "created_at": format_datetime_to_ist(resp.created_at)
    }
    return D


async def delete_resume_db(resume_id):
    try:
        resp = session.query(Resume).filter(Resume.resume_id == resume_id).first()
        if resp is None:
            raise HTTPException(status_code=404, detail=f"Resume not found for id: {resume_id}")   
        session.delete(resp)
        session.commit()
    except Exception as e:
        logger.error(f"Error deleting resume: {e}")
        raise HTTPException(status_code=500, detail="Error deleting resume")


async def insert_resume_db(resume_id, uploaded_path, actual_name, file_format):
    logger.info(f"Inserting resume with ID: {resume_id}")
    try:
        new_resume = Resume(
            resume_id=resume_id,
            uploaded_path=uploaded_path,
            actual_name=actual_name,
            file_format=file_format,
        )
        session.add(new_resume)
        session.commit()
    except Exception as e:
        logger.error(f"Error inserting resume: {e}")
        raise HTTPException(status_code=500, detail="Error inserting resume") 


async def process_resume_pdf(file):
    """
    Process the uploaded PDF resume and save it to the uploads/pdf directory.
    """
    
    resume_id = uuid.uuid4()
    file_name = f"resume_{resume_id}.pdf"
    file_path = f"{UPLOADS_DIR}/{file_name}"

    try:
        async with aiofiles.open(file_path, "wb") as f:
            content = await file.read()
            await f.write(content)
    except Exception as e:
        logger.error(f"Error saving uploaded resume: {e}")
        raise e
    
    try:
        await insert_resume_db(resume_id, file_path, file.filename, "pdf")
    except Exception as e:
        logger.error(f"Error inserting resume into database: {e}")
        await delete_resume_service(None, file_path)
        raise e
    
    return {"message": "Resume uploaded successfully", "resume_id": resume_id}


async def get_resume_by_id(resume_id):

    try:
        resp = await get_resume_by_id_db(resume_id)
    except Exception as e:
        raise e
    
    return resp

    
async def delete_resume_service(resume_id, path):
    logger.info(f"Deleting resume with ID: {resume_id} and path: {path}")
    file_path = Path(path)
    if file_path.exists():
        file_path.unlink()
        print(f"file deleted in disk for path: {file_path}")
    else:
        print(f"No file exist in disk for path: {file_path}")

    if resume_id:
        await delete_resume_db(resume_id)
    logger.info(f"Resume with ID: {resume_id} deleted successfully from database.")
