from typing import List
import numpy as np

from app.utils.embeddings import get_embedding
from app.utils.vector_store import load_index
from app.core.cache import get_cache, set_cache
from app.core.config import OPENAI_API_KEY
from openai import OpenAI


# -----------------------------
# 🔹 Helper: Cosine Similarity
# -----------------------------
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


# -----------------------------
# 🔹 Retrieve Relevant Chunks
# -----------------------------
def retrieve_chunks(query: str, file_id: str, top_k: int = 5):
    """
    1. Convert query to embedding
    2. Search FAISS index
    3. Return top matching chunks
    """

    query_vector = np.array(get_embedding(query)).astype("float32")

    index, texts = load_index(file_id)

    if index is None or texts is None:
        raise ValueError("No index found for this document")

    # FAISS search
    distances, indices = index.search(np.array([query_vector]), top_k)

    results = []
    for idx in indices[0]:
        if idx < len(texts):
            results.append(texts[idx])

    return results


# -----------------------------
# 🔹 Generate Answer (Simple)
# -----------------------------
def generate_answer(query: str, context_chunks: List[str]) -> str:
    """
    Generate an answer using OpenAI based on context.
    """
    if not OPENAI_API_KEY:
        return "Error: OPENAI_API_KEY is not configured in the environment."

    context = "\n\n".join(context_chunks)
    
    client = OpenAI(api_key=OPENAI_API_KEY)
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers questions based ONLY on the provided document context. If the answer cannot be found in the context, clearly state that."},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error communicating with OpenAI API: {str(e)}"


# -----------------------------
# 🔹 Main Function
# -----------------------------
def answer_query(query: str, file_id: str):
    """
    Full pipeline:
    1. Check cache
    2. Retrieve chunks
    3. Generate answer
    4. Cache result
    """

    cache_key = f"{file_id}:{query}"

    # -----------------------------
    # 1. Check cache
    # -----------------------------
    cached = get_cache(cache_key)
    if cached:
        return {
            "answer": cached,
            "source": "cache"
        }

    # -----------------------------
    # 2. Retrieve chunks
    # -----------------------------
    try:
        chunks = retrieve_chunks(query, file_id)
    except Exception as e:
        return {
            "error": str(e)
        }

    if not chunks:
        return {
            "answer": "No relevant information found in document.",
            "source": "search"
        }

    # -----------------------------
    # 3. Generate answer
    # -----------------------------
    answer = generate_answer(query, chunks)

    # -----------------------------
    # 4. Cache result
    # -----------------------------
    set_cache(cache_key, answer)

    return {
        "answer": answer,
        "chunks_used": len(chunks),
        "source": "generated"
    }