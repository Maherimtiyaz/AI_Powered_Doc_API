from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password

def test_register(client: TestClient, db_session: Session):
    response = client.post(
        "/auth/register",
        params={"email": "test@example.com", "password": "testpassword123"}
    )
    assert response.status_code == 200
    assert response.json() == {"msg": "user created"}

    user = db_session.query(User).filter(User.email == "test@example.com").first()
    assert user is not None
    assert verify_password("testpassword123", user.password)

def test_login(client: TestClient, db_session: Session):
    # Register first
    client.post(
        "/auth/register",
        params={"email": "login@example.com", "password": "password123"}
    )

    # Login
    response = client.post(
        "/auth/login",
        params={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_login_invalid(client: TestClient):
    response = client.post(
        "/auth/login",
        params={"email": "wrong@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 200
    assert response.json() == {"error": "invalid credentials"}
