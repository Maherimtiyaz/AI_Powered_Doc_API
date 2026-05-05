import faiss
import pickle
import os
import numpy as np

BASE_PATH = "faiss_indexes"


def store_embeddings(file_id, texts, embeddings):
    os.makedirs(BASE_PATH, exist_ok=True)

    dim = len(embeddings[0])
    index = faiss.IndexFlatL2(dim)

    index.add(np.array(embeddings).astype("float32"))

    faiss.write_index(index, f"{BASE_PATH}/{file_id}.index")

    with open(f"{BASE_PATH}/{file_id}.pkl", "wb") as f:
        pickle.dump(texts, f)


def load_index(file_id):
    try:
        index = faiss.read_index(f"{BASE_PATH}/{file_id}.index")

        with open(f"{BASE_PATH}/{file_id}.pkl", "rb") as f:
            texts = pickle.load(f)

        return index, texts

    except Exception:
        return None, None