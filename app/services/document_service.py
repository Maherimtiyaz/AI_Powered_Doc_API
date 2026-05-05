from fastapi import APIRouter, UploadFile, Depends

from app.core.database import SessionLocal, get_db
from app.models.document import Document
from app.utils.chunking import chunk_text

import os
import uuid
import requests
from typing import List

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from pypdf import PdfReader

from app.utils.cloudinary_helper import upload_file
from app.utils.embeddings import get_embeddings
from app.utils.faiss_store import store_embeddings

from app.core.celery_app import celery_app

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
# 🔹 Helper: Chunk Text
# -----------------------------
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


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
    # 7. Store in FAISS
    # -----------------------------
    try:
        store_embeddings(file_id, chunks, embeddings)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"FAISS storage failed: {str(e)}")

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


@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=5, retry_kwargs={"max_retries": 3}, name="process_document_task")
def process_document_task(self, file_url: str):
    try:
        # Download file
        response = requests.get(file_url)

        if response.status_code != 200:
            raise Exception("Failed to download file")

        content = response.content

        # Simulate processing
        text = content[:100]

        return {"status": "success", "length": len(text)}

    except Exception as e:
        print(f"Error processing document: {str(e)}")
        raise e