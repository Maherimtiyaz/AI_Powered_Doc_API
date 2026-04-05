from fastapi import FastAPI
from app.api import auth_routes, document_routes, ai_routes
from app.core.database import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Doc AI System")

# Register routes
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(document_routes.router, prefix="/docs", tags=["Documents"])
app.include_router(ai_routes.router, prefix="/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "API is running"}