# 📄 AI-Powered Document API & Dashboard

![Document AI Banner](https://via.placeholder.com/1200x300/000000/FFFFFF?text=AI-Powered+Document+Understanding)

A production-grade, full-stack platform that empowers users to upload PDF documents and extract insights through a conversational AI interface. The system leverages a robust **Retrieval-Augmented Generation (RAG)** architecture for highly accurate, context-aware answers.

---

## ✨ System Highlights

- **Dynamic RAG Pipeline**: Combines `sentence-transformers` for embeddings with a high-performance `FAISS` vector database to instantly retrieve semantic document context.
- **Instant AI Integration**: Powered by OpenAI's `gpt-4o-mini` for fast and accurate responses based ONLY on the provided document context.
- **Sleek Modern Frontend**: A fully animated, glassmorphic React/Vite interface powered by **Framer Motion** and **Lucide Icons**.
- **Security First**: JWT-based authentication ensures your documents and queries remain private.
- **Scalable Infrastructure**: Built to deploy on **Render** with managed PostgreSQL and Cloudinary for file storage.

---

## 🏗️ Architecture Overview

### Backend (FastAPI)
- **High Performance**: Built with FastAPI for speed and async support.
- **Vector Search**: Local FAISS indexing for semantic retrieval.
- **Authentication**: JWT-secured endpoints for users and document management.

### Frontend (React + Vite)
- **Animated UI**: Smooth transitions and 3D effects using Framer Motion.
- **Responsive Design**: Works on mobile and desktop.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (Local or Render Managed)

### 1. Backend Setup

```bash
# Clone the repository and setup the virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

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

The backend includes a comprehensive suite of integration tests.

```bash
# Run the test suite
pytest tests/ -v
```

---

## 🔧 Technology Stack

**Backend:** FastAPI, PostgreSQL (SQLAlchemy), FAISS, OpenAI, PyPDF, Sentence-Transformers  
**Frontend:** React (Vite), Framer Motion, Axios, Lucide Icons  
**Infrastructure:** Cloudinary (File Storage), Render (Full-stack Hosting)

---

*Designed and engineered for scalability, modularity, and modern aesthetics.*