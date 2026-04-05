from fastapi import APIRouter
from app.utils.embeddings import get_embedding
from app.utils.faiss_store import search
from openai import OpenAI
import os
from fastapi import APIRouter
from app.services.ai_service import answer_query

router = APIRouter()

@router.post("/query")
def query(q: str):
    return answer_query(q)


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()

@router.post("/query")
def query(q: str):

    q_emb = get_embedding(q)
    chunks = search(q_emb)

    prompt = f"Context: {chunks}\nQuestion: {q}"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"answer": response.choices[0].message.content}