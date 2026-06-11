import bcrypt
import os
from jose import jwt
from datetime import datetime, timedelta, timezone

SECRET = os.getenv("SECRET_KEY", "change-me-in-production")
ALGO = os.getenv("ALGORITHM", "HS256")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_token(data):
    data["exp"] = datetime.now(timezone.utc) + timedelta(hours=24)
    return jwt.encode(data, SECRET, algorithm=ALGO)