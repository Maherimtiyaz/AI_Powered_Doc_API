import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth_routes import router as auth_router
from app.api.document_auth import router as document_router
from app.api.ai_routes import router as ai_router
from app.core.database import Base, engine
from app.utils.vector_store_model import DocumentChunk  # import so table is registered


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Doc AI System")

# Build CORS origins — include Render frontend URL if set
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
FRONTEND_URL = os.getenv("FRONTEND_URL", "")
if FRONTEND_URL:
    origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-powered-doc-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(document_router, prefix="/docs", tags=["Documents"])
app.include_router(ai_router, prefix="/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "API is running"}

