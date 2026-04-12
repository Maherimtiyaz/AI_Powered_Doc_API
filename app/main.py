from fastapi import FastAPI
from app.api import document_auth
from app.api.auth_routes import router as auth_router
from app.api.document_auth import router as document_router
from app.api.ai_routes import router as ai_router
from app.core.database import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Doc AI System")

# Register routes
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(document_router, prefix="/docs", tags=["Documents"])
app.include_router(ai_router, prefix="/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "API is running"}