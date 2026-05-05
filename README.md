# 📄 AI-Powered Document API & Dashboard

![Document AI Banner](https://via.placeholder.com/1200x300/000000/FFFFFF?text=AI-Powered+Document+Understanding)

A production-grade, full-stack platform that empowers users to upload PDF documents and extract insights through a conversational AI interface. The system leverages a robust **Retrieval-Augmented Generation (RAG)** architecture for highly accurate, context-aware answers.

---

## ✨ System Highlights

- **Dynamic RAG Pipeline**: Combines `sentence-transformers` for embeddings with a high-performance `FAISS` vector database to instantly retrieve semantic document context.
- **Asynchronous AI Processing**: Heavy document parsing and embedding tasks are offloaded to **Celery** workers and queued via **Redis**, ensuring API latency remains minimal.
- **Sleek Modern Frontend**: A fully animated, glassmorphic, black-and-white React/Vite interface powered by **Framer Motion**.
- **Bulletproof Reliability**: Features a **100% passing automated test suite** covering Authentication, Uploads, and AI interactions.
- **Scalable Storage**: Employs **PostgreSQL** for strict relational data alongside **Cloudinary** for scalable, off-server file storage.

---

## 🏗️ Architecture Overview

The platform is strictly separated into a headless API backend and a decoupled React SPA.

### Backend (FastAPI Layer)
Follows a **Clean Architecture Pattern**:
- **API Routers**: Handles HTTP requests, parameter validation, and JWT verification.
- **Service Layer**: Orchestrates business logic, FAISS indexing, and AI prompting.
- **Repository Layer**: Abstracts raw SQLAlchemy queries.

### Frontend (React + Vite)
- **State & Routing**: Utilizes React hooks and `react-router-dom` to manage user sessions and chat history.
- **Styling**: Built on pure Vanilla CSS utilizing CSS Variables for global theme enforcement, completely eliminating utility-class clutter.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL, Redis Server

### 1. Backend Setup

```bash
# Clone the repository and setup the virtual environment
python -m venv venv
source venv/bin/activate  # Or `.\venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Start the Celery Worker (In a separate terminal)
celery -A app.workers.worker worker --loglevel=info

# Start the FastAPI Server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

---

## 🧪 Testing

The backend is fully tested using `pytest`. The test suite automatically spins up a mocked SQLite database and isolates third-party API calls (e.g., Cloudinary, OpenAI) to ensure deterministic execution.

```bash
# Run the test suite
pytest tests/ -v
```

**Test Coverage Includes:**
- User Registration & JWT Issuance
- Invalid Credential Rejection
- Document Uploads & Metadata Persistence
- Vector Query Execution & Response Formatting

---

## 🔧 Technology Stack

**Backend:** FastAPI, PostgreSQL (SQLAlchemy), Redis, Celery, FAISS, PyPDF, Sentence-Transformers  
**Frontend:** React (Vite), Framer Motion, Axios, Lucide Icons  
**Infrastructure:** Cloudinary (File Storage), JWT (Stateless Auth)

---

*Designed and engineered for scalability, modularity, and modern aesthetics.*