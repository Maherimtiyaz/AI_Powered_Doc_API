import faiss
import numpy as np

index = faiss.IndexFlatL2(384)
data_store = []

def store_embeddings(chunks, embeddings):
    index.add(np.array(embeddings).astype("float32"))
    data_store.extend(chunks)

def search(query_embedding, k=5):
    D, I = index.search(np.array([query_embedding]).astype("float32"), k)
    return [data_store[i] for i in I[0]]