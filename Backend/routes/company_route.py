from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.base import get_db
from schemas.company_schema import *
from services.company_service import *
from utils.security import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


http_bearer = HTTPBearer()
router = APIRouter()


def get_current_company(creds: HTTPAuthorizationCredentials = Depends(http_bearer), db: Session = Depends(get_db)) -> Company:
    token = creds.credentials
    payload = decode_token(token)
    try:
        company_id: str = payload.get("sub")
        if company_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject",
            )
    except Exception as e:
        raise e

    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return company


# Company login
@router.post("/auth/company/login", response_model=CompanyLoginResponse)
def company_login(payload: CompanyLoginSchema, db: Session = Depends(get_db)):
    return login_company(db, payload.email, payload.password)


# Get company profile
@router.get("/company/profile", response_model=CompanyProfileResponse)
def company_profile(current_company=Depends(get_current_company), db: Session = Depends(get_db)):
    return get_company_profile(db, current_company.id)


# Update company profile
@router.put("/company/profile", response_model=CompanyProfileResponse)
def update_profile(payload: CompanyUpdateSchema, current_company=Depends(get_current_company), db: Session = Depends(get_db)):
    return update_company_profile(db, current_company.id, payload.model_dump())


# Change password
@router.post("/company/change-password")
def change_password_endpoint(payload: ChangePasswordSchema, current_company=Depends(get_current_company), db: Session = Depends(get_db)):
    return change_password(db, current_company.id, payload.currentPassword, payload.newPassword, payload.confirmPassword)


# Register company
@router.post("/companies/register", response_model=CompanyProfileResponse)
def register_company_endpoint(payload: RegisterCompanySchema, db: Session = Depends(get_db)):
    company = register_company(db, payload.model_dump())
    return {
        "companyID": company.id,
        "companyName": company.name,
        "companyEmail": company.email,
        "companyWebsite": company.website
    }


