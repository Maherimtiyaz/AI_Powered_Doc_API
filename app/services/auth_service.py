from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.user_repo import create_user, get_user_by_email
from app.core.security import hash_password, verify_password, create_token


def authenticate_user(db: Session, email: str, password: str):
    # Find user by email
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        return None

    # Verify password
    if not verify_password(password, user.hashed_password):
        return None

    return user

def register_user(db, email, password):
    hashed = hash_password(password)
    return create_user(db, email, hashed)

def login_user(db, email, password):
    user = get_user_by_email(db, email)

    if not user or not verify_password(password, user.password):
        return None

    token = create_token({"user_id": user.id})
    return token