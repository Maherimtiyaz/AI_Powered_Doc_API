from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)
import uuid

def test_register():
    response = client.post("/auth/register", json={
        "email": f"{uuid.uuid4()}@test.com",
        "password": "1234"
    })
    assert response.status_code == 200

def test_login():
    response = client.post("/auth/login", json={
        "email": "test@test.com",
        "password": "1234"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()