
##test script

from fastapi import APIRouter

router = APIRouter()

@router.post("/ai/query")
def query_ai(q: str):
    from app.utils.embeddings import get_embedding
    embedding = get_embedding(q)
    return {"result": "ok"}