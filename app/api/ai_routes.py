from fastapi import APIRouter
from app.utils.embeddings import get_embeddings
from app.utils.faiss_store import search
from openai import OpenAI
import os
from fastapi import APIRouter
from app.services.ai_service import answer_query
from fastapi import APIRouter, HTTPException
from app.services.document_service import process_document

router = APIRouter()

@router.post("/process")
def process(file_url: str):
    try:
        task = process_document.delay(file_url)

        return {
            "task_id": task.id,
            "status": "processing"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))