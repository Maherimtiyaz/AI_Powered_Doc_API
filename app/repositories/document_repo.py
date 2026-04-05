from sqlalchemy.orm import Session
from app.models.document import Document

def create_document(db: Session, user_id: str, file_url: str):
    doc = Document(user_id=user_id, file_url=file_url, status="processing")
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

def get_documents_by_user(db: Session, user_id: str):
    return db.query(Document).filter(Document.user_id == user_id).all()

def get_document_by_id(db: Session, doc_id: str):
    return db.query(Document).filter(Document.id == doc_id).first()