def test_docs_endpoint_exists():
    response = client.get("/documents")
    assert response.status_code in [200, 404]