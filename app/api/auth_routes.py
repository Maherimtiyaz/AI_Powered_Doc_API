from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

from app.api.deps import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_token, SECRET, ALGO

router = APIRouter()


@router.post("/register")
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Try logging in instead."
        )

    user = User(email=payload.email, password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"msg": "Account created successfully", "user_id": user.id}


@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_token({"user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}


# -----------------------------
# 🔹 Forgot Password
# -----------------------------

def create_reset_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    return jwt.encode({"sub": email, "exp": expire, "type": "reset"}, SECRET, algorithm=ALGO)


def verify_reset_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGO])
        if payload.get("type") != "reset":
            raise HTTPException(status_code=400, detail="Invalid token type")
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")


@router.post("/forgot-password")
def forgot_password(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    user = db.query(User).filter(User.email == email).first()

    # Always return the same message — don't reveal if email exists or not
    if not user:
        return {"msg": "If an account with that email exists, a reset link has been sent."}

    reset_token = create_reset_token(email)

    # TODO: send this via email (SendGrid / SMTP).
    # For now, returning it directly so you can test the flow.
    print(f"Password reset token for {email}: {reset_token}")

    return {
        "msg": "If an account with that email exists, a reset link has been sent.",
        "reset_token": reset_token  # remove this once email sending is set up
    }


@router.post("/reset-password")
def reset_password(payload: dict, db: Session = Depends(get_db)):
    token = payload.get("token")
    new_password = payload.get("new_password")

    email = verify_reset_token(token)

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(new_password)
    db.commit()

    return {"msg": "Password has been reset successfully. You can now log in."}