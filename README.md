# 📄 Document AI Backend (Production-Grade)

## 🚀 Overview

This project is a production-grade backend system that enables users to:

- Upload documents (PDFs)
- Process and index document content
- Ask questions based on the document
- Receive AI-generated contextual answers

The system follows a **Retrieval-Augmented Generation (RAG)** architecture and is designed with **scalability, modularity, and performance** in mind.

---

## 🧠 Key Features

- 🔐 JWT-based Authentication
- 📄 Document Upload & Processing Pipeline
- 🧩 Text Chunking & Embedding Generation
- 🔍 Semantic Search using Vector Similarity
- 🤖 AI-powered Question Answering
- ⚡ Caching using Redis
- 🚦 Rate Limiting
- 🧵 Background Job Processing (Celery)
- 🐳 Dockerized Deployment
- ☁️ Cloud File Storage

---

## 🏗️ System Architecture

### High-Level Flow

Client
↓
FastAPI (API Layer)
↓
Service Layer (Business Logic)
↓
Repository Layer (DB Access)
↓
Storage Systems + AI


---

### Layered Architecture

#### 1. API Layer

Handles:

- HTTP requests/responses
- Input validation
- Routing

#### 2. Service Layer

Handles:

- Business logic
- Document processing
- AI interaction

#### 3. Repository Layer

Handles:

- Database queries
- Data persistence

#### 4. Storage Layer

| Component  | Purpose                  |
|------------|--------------------------|
| PostgreSQL | Structured metadata      |
| Cloudinary | File storage             |
| FAISS      | Vector similarity search |
| Redis      | Cache + rate limiting    |

---

## 🧱 Database Design

### Users Table

| Field    | Type   |
|----------|--------|
| id       | UUID   |
| email    | String |
| password | String |

---

### Documents Table

| Field    | Type   |
|----------|--------|
| id       | UUID   |
| user_id  | UUID   |
| file_url | String |
| status   | String |

---

## 🔐 Authentication

- Uses JWT (JSON Web Tokens)
- Stateless authentication model
- Tokens include:
  - user_id
  - expiration time

### Flow:

1. User logs in  
2. Token generated  
3. Token used in protected routes  

---

## 📄 Document Processing Pipeline

When a document is uploaded:

1. File uploaded to Cloudinary  
2. Metadata stored in PostgreSQL  
3. PDF text extracted  
4. Text split into chunks  
5. Chunks converted into embeddings  
6. Embeddings stored in FAISS  

---

### Why Chunking?

- LLMs have token limits  
- Improves semantic retrieval accuracy  

---

## 🤖 Query Processing (RAG)

When a user asks a question:

1. Query → embedding  
2. Search similar chunks in FAISS  
3. Select top-K results  
4. Build context prompt  
5. Send to LLM  
6. Return response  

---

## ⚡ Performance Optimization

### Redis Caching

- Stores frequently asked queries  
- Reduces response time  
- Minimizes LLM API calls  

---

### Rate Limiting

- Limits API usage per user  
- Prevents abuse  
- Protects system resources  

---

## 🧵 Background Processing

Using Celery:

- Offloads heavy tasks  
- Improves API responsiveness  

### Example Tasks:

- Document embedding generation  
- Large file processing  

---

## 🐳 Dockerization

### Why Docker?

- Environment consistency  
- Easy deployment  
- Scalable infrastructure  

---

## 🚀 Deployment

Deployed using a cloud platform.

### Steps:

1. Push code to GitHub  
2. Connect repository  
3. Configure environment variables  
4. Deploy service  

---

## 🧪 Testing

- Integration testing using FastAPI TestClient  
- Covers:
  - Authentication  
  - API endpoints  
  - Basic flows  

---

## 🔧 Tech Stack

- FastAPI (Backend framework)  
- PostgreSQL (Relational DB)  
- Redis (Caching & rate limiting)  
- FAISS (Vector search)  
- Cloudinary (File storage)  
- OpenAI API (LLM)  
- Celery (Background jobs)  
- Docker (Containerization)  

---

## 📁 Project Structure
app/
├── api/
├── core/
├── models/
├── schemas/
├── services/
├── repositories/
├── utils/
├── workers/


---

## ⚠️ Edge Cases Handled

- Large documents → async processing  
- Invalid files → validation  
- Failed embeddings → retry  
- Duplicate uploads → can be extended  

---

## 📈 Future Improvements

- Distributed vector DB (e.g., Pinecone)  
- Streaming responses  
- Role-based access control  
- Monitoring & logging  
- Horizontal scaling  

---

## 🧠 Key Learnings

- Designing scalable backend systems  
- Working with multi-storage architectures  
- Implementing RAG pipelines  
- Managing async workflows  
- Applying clean architecture principles  

---

## 💡 Conclusion

This project demonstrates how to build a scalable, modular, and production-ready backend system for AI-powered document understanding.

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome!

---

## 📬 Contact

If you have ideas or feedback, feel free to reach out.
