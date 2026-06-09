import numpy as np
from sqlalchemy.orm import Session
from app.utils.document_chunk import DocumentChunk


def store_embeddings(file_id: str, texts: list, embeddings: list, db: Session):
    # Delete old chunks for this file if re-uploading
    db.query(DocumentChunk).filter(DocumentChunk.file_id == file_id).delete()

    for text, embedding in zip(texts, embeddings):
        chunk = DocumentChunk(
            file_id=file_id,
            text=text,
            embedding=embedding  # already a list of floats from OpenAI
        )
        db.add(chunk)

    db.commit()


def search_similar(file_id: str, query_embedding: list, top_k: int, db: Session):
    chunks = db.query(DocumentChunk).filter(
        DocumentChunk.file_id == file_id
    ).all()

    if not chunks:
        return []

    # Cosine similarity search
    query_vec = np.array(query_embedding)
    scored = []

    for chunk in chunks:
        chunk_vec = np.array(chunk.embedding)
        score = np.dot(query_vec, chunk_vec) / (
            np.linalg.norm(query_vec) * np.linalg.norm(chunk_vec) + 1e-9
        )
        scored.append((score, chunk.text))

    scored.sort(reverse=True)
    return [text for _, text in scored[:top_k]]