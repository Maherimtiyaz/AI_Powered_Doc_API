from dotenv import load_dotenv
from pydantic_settings import BaseSettings
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class Settings(BaseSettings):
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()