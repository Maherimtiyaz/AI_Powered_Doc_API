from jose import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
import os

pwd_context = CryptContext(schemes=["bcrypt"])

SECRET = os.getenv("SECRET_KEY", "change-me-in-production")
ALGO = os.getenv("ALGORITHM", "HS256")

def hash_password(p):
    return pwd_context.hash(p)

def verify_password(p, h):
    return pwd_context.verify(p, h)

def create_token(data):
    data["exp"] = datetime.now(timezone.utc) + timedelta(hours=24)
    return jwt.encode(data, SECRET, algorithm=ALGO)