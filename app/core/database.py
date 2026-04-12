from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import DATABASE_URL
import os 

DATABASE_URL = os.getenv("DATABASE_URL")
print("RAW DATABASE_URL:", repr(DATABASE_URL))

DATABASE_URL = DATABASE_URL.strip() if DATABASE_URL else None


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
    )

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

## TEST SCRIPT 

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "your_db_url_here"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)