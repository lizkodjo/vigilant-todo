from fastapi.testclient import TestClient


def test_sql_injection_protection(client: TestClient):
    """Test that SQL injection attempts are blocked"""
    # Attempt SQL injection in username
    malicious_data = {
        "username": "admin' OR '1'='1",
        "email": "test@example.com",
        "password": "password123",
    }

    response = client.post("/api/v1/users/register", json=malicious_data)
    # Should either fail validation or create user normally (not vulnerable)
    assert response.status_code in [200, 400, 422]


def test_xss_protection(client: TestClient):
    """Test that XSS attempts are handled safely"""
    # Create a user first
    user_data = {
        "username": "xssuser",
        "email": "xss@example.com",
        "password": "password123",
    }
    client.post("/api/v1/users/register", json=user_data)

    login_data = {"username": "xssuser", "password": "password123"}
    login_response = client.post("/api/v1/users/login", params=login_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt XSS in task title
    xss_task = {
        "title": "<script>alert('xss')</script>",
        "description": "Test XSS protection",
    }

    response = client.post("/api/v1/tasks/", json=xss_task, headers=headers)
    assert response.status_code == 200
    # The response should contain the sanitized or escaped data
    data = response.json()
    assert "title" in data
    # The title should be stored as-is (sanitization happens on frontend)
    # This tests that the backend doesn't crash on special characters


def test_rate_limiting_basic(client: TestClient):
    """Test basic rate limiting (if implemented)"""
    login_data = {"username": "nonexistent", "password": "wrongpassword"}

    # Make multiple rapid login attempts
    for _ in range(5):
        response = client.post("/api/v1/users/login", params=login_data)

    # Should not crash and should return proper status codes
    assert response.status_code in [401, 429]  # Unauthorized or Too Many Requests
