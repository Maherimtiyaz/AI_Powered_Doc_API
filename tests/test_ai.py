from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

def test_ask_query(client: TestClient):
    with patch("app.api.ai_routes.answer_query") as mock_answer:
        mock_answer.return_value = {
            "answer": "This is a mock answer based on the document.",
            "chunks_used": 2,
            "source": "generated"
        }

        response = client.post(
            "/ai/ask",
            json={"query": "What is this document about?", "file_id": "mock_file_id"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["answer"] == "This is a mock answer based on the document."
        assert data["chunks_used"] == 2

def test_process_celery(client: TestClient):
    with patch("app.api.ai_routes.process_document_task.delay") as mock_delay:
        mock_task = MagicMock()
        mock_task.id = "mock_task_id"
        mock_delay.return_value = mock_task

        response = client.post(
            "/ai/process",
            params={"file_url": "http://mock.url/file.pdf"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["task_id"] == "mock_task_id"
        assert data["status"] == "processing"
