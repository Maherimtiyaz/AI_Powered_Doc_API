from openai import OpenAI

from openai import OpenAI

def get_embeddings(texts: list[str]) -> list:
    client = OpenAI()  # ✅ only runs when function is called
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return [item.embedding for item in response.data]

def get_embedding(text: str) -> list:
    return get_embeddings([text])[0]
