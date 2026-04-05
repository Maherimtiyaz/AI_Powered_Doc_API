from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_query():
    response = client.post("/ai/query?q=hello")
    assert response.status_code == 200