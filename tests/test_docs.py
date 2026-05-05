from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

def test_upload_doc(client: TestClient):
    # Register and login to get token
    client.post("/auth/register", params={"email": "doc@example.com", "password": "password"})
    login_response = client.post("/auth/login", params={"email": "doc@example.com", "password": "password"})
    token = login_response.json()["access_token"]

    # Mock the process_document function to avoid actual Celery/Cloudinary/FAISS calls
    with patch("app.api.document_auth.process_document") as mock_process:
        mock_process.return_value = {
            "file_id": "mock_file_id",
            "filename": "test.pdf",
            "cloudinary_url": "http://mock.url",
            "chunks": 5,
            "message": "Document processed successfully"
        }

        # Create a dummy PDF file content
        file_content = b"%PDF-1.4 mock content"

        response = client.post(
            "/docs/upload",
            params={"token": token},
            files={"file": ("test.pdf", file_content, "application/pdf")}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["file_id"] == "mock_file_id"
        assert data["filename"] == "test.pdf"
