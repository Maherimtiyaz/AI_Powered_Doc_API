from typing import List
import numpy as np

from app.utils.embeddings import get_embedding
from app.utils.faiss_store import load_index
from app.core.cache import get_cache, set_cache


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
    Mock LLM generation based on context.
    """

    context = "\n\n".join(context_chunks)

    answer = f"Based on the document context, here is the answer to your query: '{query}'.\n\nI found {len(context_chunks)} relevant chunks of information. The most relevant text says:\n\n\"{context[:300]}...\"\n\n(This is a mock AI response simulated using local chunk retrieval without incurring external API costs.)"

    return answer.strip()


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