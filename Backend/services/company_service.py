from sqlalchemy.orm import Session
from models.companies_model import Company
from fastapi import HTTPException, status
from utils.security import create_access_token, verify_password, hash_password

# Login
def login_company(db: Session, email: str, password: str):
    company = db.query(Company).filter(Company.email == email).first()
    if not company or not verify_password(password, company.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(company.id)})
    return {"token": token, "company": {"id": company.id, "name": company.name}}

# Get profile
def get_company_profile(db: Session, company_id: str):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return {
        "companyID": company.id,
        "companyName": company.name,
        "companyEmail": company.email,
        "companyWebsite": company.website
    }

# Update profile
def update_company_profile(db: Session, company_id: str, data: dict):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company.name = data.get("companyName", company.name)
    company.email = data.get("companyEmail", company.email)
    company.website = data.get("companyWebsite", company.website)
    db.commit()
    db.refresh(company)
    return {
        "companyID": company.id,
        "companyName": company.name,
        "companyEmail": company.email,
        "companyWebsite": company.website
    }

# Change password
def change_password(db: Session, company_id: str, current_password: str, new_password: str, confirm_password: str):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    if not verify_password(current_password, company.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    company.password = hash_password(new_password)
    db.commit()
    return {"message": "Password updated successfully"}

# Register company
def register_company(db: Session, data: dict):
    company = Company(
        name=data['name'],
        email=data["email"],
        password=hash_password(data["password"]),
        description=f"{data['plan']} plan",
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company
