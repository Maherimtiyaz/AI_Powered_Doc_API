from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.core.database import SessionLocal
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin
from app.services.auth_service import register_user, login_user
from app.core.security import hash_password, verify_password, create_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):
    user = User(email=email, password=hash_password(password))
    db.add(user)
    db.commit()
    return {"msg": "user created"}

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        return {"error": "invalid credentials"}

    token = create_token({"user_id": user.id})
    return {"access_token": token}