from sentence_transformers import SentenceTransformer

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def get_embeddings(texts: list[str]) -> list:
    return model.encode(texts).tolist()

def get_embedding(text: str):
    return get_embeddings([text])[0]