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

