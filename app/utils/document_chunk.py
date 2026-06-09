from sqlalchemy import Column, Integer, String, JSON
from app.core.database import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(String, index=True)
    text = Column(String)
    embedding = Column(JSON)