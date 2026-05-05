from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import answer_query
from app.services.document_service import process_document_task

router = APIRouter()

class AskRequest(BaseModel):
    query: str
    file_id: str

@router.post("/process")
def process(file_url: str):
    try:
        task = process_document_task.delay(file_url)

        return {
            "task_id": task.id,
            "status": "processing"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ask")
def ask(request: AskRequest):
    try:
        result = answer_query(request.query, request.file_id)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))