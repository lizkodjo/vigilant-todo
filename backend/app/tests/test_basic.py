def test_always_pass():
    """Basic test to ensure pipeline runs."""
    assert True


def test_health_endpoint(client):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "vigilant-todo-api"


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_docs_available(client):
    """Test that API docs are available."""
    response = client.get("/docs")
    assert response.status_code == 200
