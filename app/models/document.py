from sqlalchemy import Column, String
from app.core.database import Base
import uuid

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String)
    file_url = Column(String)
    status = Column(String, default="processing")