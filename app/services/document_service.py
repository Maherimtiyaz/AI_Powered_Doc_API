from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.document import Document
from app.utils.cloudinary_helper import upload_file
from app.utils.chunking import chunk_text
from app.utils.embeddings import get_embeddings
from app.utils.faiss_store import store_embeddings
from pypdf import PdfReader

router = APIRouter()

def extract_text(file):
    reader = PdfReader(file.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

@router.post("/upload")
async def upload_doc(file: UploadFile, db: Session = Depends(get_db)):
    
    url = upload_file(file)

    doc = Document(file_url=url)
    db.add(doc)
    db.commit()

    text = extract_text(file)
    chunks = chunk_text(text)
    embeddings = get_embeddings(chunks)

    store_embeddings(doc.id, chunks, embeddings)

    doc.status = "ready"
    db.commit()

    return {"doc_id": doc.id}