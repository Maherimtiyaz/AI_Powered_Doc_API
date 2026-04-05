from fastapi import FastAPI
from app.api import auth_routes, document_routes, ai_routes

app = FastAPI()

app.include_router(auth_routes.router, prefix="/auth")
app.include_router(document_routes.router, prefix="/docs")
app.include_router(ai_routes.router, prefix="/ai")