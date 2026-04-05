from app.utils.embeddings import get_embedding
from app.utils.faiss_store import search
from openai import OpenAI
from app.core.cache import get_cache, set_cache

client = OpenAI()

def answer_query(query):

    cached = get_cache(query)
    if cached:
        return cached

    emb = get_embedding(query)
    chunks = search(emb)

    prompt = f"Context: {chunks}\nQuestion: {query}"

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    answer = res.choices[0].message.content

    set_cache(query, answer)

    return answer