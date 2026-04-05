# 📄 Document AI Backend (Production-Grade)

## 🚀 Overview

This project is a production-grade backend system that enables users to:

- Upload documents (PDFs)
- Ask questions based on document content
- Generate contextual summaries

The system is inspired by tools like NotebookLM and implements a **Retrieval-Augmented Generation (RAG)** architecture.

---

## 🧠 System Design

### High-Level Architecture

Client → FastAPI → Services → Storage Layers → AI

User
↓
API Layer (FastAPI)
↓
Service Layer (Business Logic)
↓
Repository Layer (DB Access)
↓
Storage Systems


---

## 🧱 Architecture Decisions

### 1. Layered Architecture

The system follows a **clean architecture pattern**:

- API Layer → handles HTTP  
- Service Layer → business logic  
- Repository Layer → DB abstraction  

#### Why?

- Separation of concerns  
- Testability  
- Scalability  

---

### 2. Multi-Storage Strategy

We intentionally use **different storage systems**:

#### PostgreSQL

- Stores structured data (users, documents metadata)  
- Ensures relational integrity  

#### Cloudinary

- Stores uploaded files  
- Offloads file handling from backend  

#### FAISS

- Stores embeddings  
- Enables semantic similarity search  

#### Redis

Used for:

- Caching responses  
- Rate limiting  

#### Why?

> “Use the right tool for the right job”

---

### 3. Document Processing Pipeline

When a document is uploaded:

1. File is uploaded to Cloudinary  
2. Metadata stored in PostgreSQL  
3. Text extracted from PDF  
4. Text is chunked into smaller parts  
5. Each chunk is converted into embeddings  
6. Stored in FAISS for retrieval  

---

### 4. Query Pipeline (RAG)

When user queries:

1. Query → embedding  
2. Retrieve similar chunks from FAISS  
3. Construct prompt with context  
4. Send to LLM  
5. Return response  

---

## 🤖 AI Integration

We use:

- Embeddings → sentence-transformers  
- LLM → OpenAI API  

This follows a **Retrieval-Augmented Generation (RAG)** pattern.

---

## ⚡ Performance Optimizations

### Caching (Redis)

- Frequently asked queries cached  
- Reduces LLM cost and latency  

---

### Rate Limiting

- Prevents API abuse  
- Protects system from overload  

---

## 🧵 Background Processing

Using Celery:

- Document processing can be async  
- Prevents blocking API  

---

## 🔐 Authentication

- JWT-based authentication  
- Stateless and scalable  

---

## 🐳 Deployment

- Containerized using Docker  
- Deployed on Render  

---

## 🧪 Testing

- Integration tests using FastAPI TestClient  
- Covers authentication and AI endpoints  

---

## 🔧 Tech Stack

- FastAPI  
- PostgreSQL  
- Redis  
- FAISS  
- Cloudinary  
- OpenAI API  
- Docker  
- Celery  

---

## 📈 Future Improvements

- Replace FAISS with distributed vector DB (e.g., Pinecone)  
- Add role-based access control  
- Implement streaming responses  
- Add observability (logs, metrics)  

---

## 🧠 Key Learnings

- Designing scalable backend systems  
- Working with multiple storage systems  
- Implementing RAG pipelines  
- Handling async processing  
- Applying production best practices  

---

## 💡 Conclusion

This project demonstrates how to build a scalable AI-powered backend system using modern backend architecture principles and tools.