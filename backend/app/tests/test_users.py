from fastapi.testclient import TestClient


def test_user_registration_success(client: TestClient):
    """Test successful user registration"""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
    }

    # Use json for registration since our endpoint expects JSON
    response = client.post("/api/v1/users/register", json=user_data)
    assert (
        response.status_code == 200
    ), f"Expected 200, got {response.status_code}. Response: {response.text}"
    data = response.json()
    assert data["username"] == user_data["username"]
    assert data["email"] == user_data["email"]
    assert "id" in data
    assert "hashed_password" not in data


def test_user_registration_duplicate_username(client: TestClient):
    """Test registration with duplicate username"""
    user_data = {
        "username": "duplicateuser",
        "email": "test1@example.com",
        "password": "testpass123",
    }

    # First registration
    client.post("/api/v1/users/register", json=user_data)

    # Second registration with same username
    response = client.post("/api/v1/users/register", json=user_data)
    assert (
        response.status_code == 400
    ), f"Expected 400, got {response.status_code}. Response: {response.text}"
    assert "already registered" in response.json()["detail"]


def test_user_login_success(client: TestClient):
    """Test successful user login"""
    # First register a user
    user_data = {
        "username": "loginuser",
        "email": "login@example.com",
        "password": "loginpass123",
    }
    client.post("/api/v1/users/register", json=user_data)

    # Then login - our endpoint expects form data for login
    login_data = {"username": "loginuser", "password": "loginpass123"}
    response = client.post("/api/v1/users/login", data=login_data)
    assert (
        response.status_code == 200
    ), f"Expected 200, got {response.status_code}. Response: {response.text}"
    data = response.json()
    assert "access_token" in data, f"Response: {data}"
    assert data["token_type"] == "bearer"


def test_user_login_invalid_credentials(client: TestClient):
    """Test login with invalid credentials"""
    login_data = {"username": "nonexistent", "password": "wrongpass"}
    response = client.post("/api/v1/users/login", data=login_data)
    assert (
        response.status_code == 401
    ), f"Expected 401, got {response.status_code}. Response: {response.text}"
    assert "Incorrect username or password" in response.json()["detail"]


def test_protected_endpoint_without_token(client: TestClient):
    """Test accessing protected endpoint without token"""
    response = client.get("/api/v1/users/me")
    assert response.status_code == 403


def test_protected_endpoint_with_valid_token(client: TestClient):
    """Test accessing protected endpoint with valid token"""
    # First create a user and get a real token
    user_data = {
        "username": "protecteduser",
        "email": "protected@example.com",
        "password": "testpass123",
    }
    client.post("/api/v1/users/register", json=user_data)

    login_data = {"username": "protecteduser", "password": "testpass123"}
    login_response = client.post("/api/v1/users/login", data=login_data)
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    token_data = login_response.json()
    assert "access_token" in token_data, f"Token missing: {token_data}"

    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/users/me", headers=headers)
    assert (
        response.status_code == 200
    ), f"Expected 200, got {response.status_code}. Response: {response.text}"
    data = response.json()
    assert "username" in data
    assert "email" in data


def test_password_hashing():
    """Test password hashing and verification"""
    from app.core.security import get_password_hash, verify_password

    password = "testpassword123"
    hashed = get_password_hash(password)

    assert verify_password(password, hashed)
    assert not verify_password("wrongpassword", hashed)
