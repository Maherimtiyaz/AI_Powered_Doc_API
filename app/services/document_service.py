from fastapi import APIRouter, UploadFile, Depends

from app.core.database import SessionLocal, get_db
from app.models.document import Document
from app.utils.chunking import chunk_text

import os
import uuid
from typing import List

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from pypdf import PdfReader

from app.utils.cloudinary_helper import upload_file
from app.utils.embeddings import get_embeddings
from app.utils.vector_store_model import store_embeddings



# -----------------------------
# 🔹 Helper: Read PDF Content
# -----------------------------
def extract_text_from_pdf(file_path: str) -> str:
    try:
        reader = PdfReader(file_path)
        text = ""

        for page in reader.pages:
            text += page.extract_text() or ""

        if not text.strip():
            raise ValueError("No text extracted from PDF")

        return text

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF parsing failed: {str(e)}")




# -----------------------------
# 🔹 Main Service Function
# -----------------------------
async def process_document(file: UploadFile, db: Session, user_id: str):
    """
    Full pipeline:
    1. Save file locally
    2. Upload to Cloudinary
    3. Extract text
    4. Chunk text
    5. Generate embeddings
    6. Store in FAISS
    7. Save to DB
    """

    # -----------------------------
    # 1. Validate file
    # -----------------------------
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # -----------------------------
    # 2. Save file locally
    # -----------------------------
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)

    file_id = str(uuid.uuid4())
    file_path = os.path.join(temp_dir, f"{file_id}.pdf")

    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File save failed: {str(e)}")

    # -----------------------------
    # 3. Upload to Cloudinary
    # -----------------------------
    try:
        cloudinary_url = upload_file(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloud upload failed: {str(e)}")

    # -----------------------------
    # 4. Extract text
    # -----------------------------
    text = extract_text_from_pdf(file_path)

    # -----------------------------
    # 5. Chunk text
    # -----------------------------
    chunks = chunk_text(text)

    if not chunks:
        raise HTTPException(status_code=400, detail="No text chunks created")

    # -----------------------------
    # 6. Generate embeddings
    # -----------------------------
    try:
        embeddings = get_embeddings(chunks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding failed: {str(e)}")

    # -----------------------------
    # 7. Store embeddings in DB
    # -----------------------------
    try:
        store_embeddings(file_id, chunks, embeddings, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding storage failed: {str(e)}")
    
    # -----------------------------
    # 8. Save metadata to DB
    # -----------------------------
    document = Document(
        id=file_id,
        user_id=user_id,
        file_url=cloudinary_url,
        status="processed"
    )
    db.add(document)
    db.commit()

    # -----------------------------
    # 9. Cleanup
    # -----------------------------
    try:
        os.remove(file_path)
    except Exception:
        pass  # not critical

    # -----------------------------
    # 10. Response
    # -----------------------------
    return {
        "file_id": file_id,
        "filename": file.filename,
        "cloudinary_url": cloudinary_url,
        "chunks": len(chunks),
        "message": "Document processed successfully"
    }