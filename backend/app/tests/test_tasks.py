from fastapi.testclient import TestClient


def test_create_task_success(client: TestClient):
    """Test successful task creation"""
    # First create a user and get token
    user_data = {
        "username": "taskuser",
        "email": "task@example.com",
        "password": "taskpass123",
    }
    client.post("/api/v1/users/register", json=user_data)

    login_data = {"username": "taskuser", "password": "taskpass123"}
    login_response = client.post("/api/v1/users/login", params=login_data)
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    token_data = login_response.json()
    assert "access_token" in token_data, f"Token missing: {token_data}"

    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    task_data = {
        "title": "Test Task",
        "description": "Test description",
        "completed": False,
    }

    response = client.post("/api/v1/tasks/", json=task_data, headers=headers)
    assert (
        response.status_code == 200
    ), f"Expected 200, got {response.status_code}. Response: {response.text}"
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert not data["completed"]
    assert "id" in data
    assert "owner_id" in data


def test_get_tasks_empty(client: TestClient):
    """Test getting tasks when none exist"""
    # Create user and get token
    user_data = {
        "username": "emptyuser",
        "email": "empty@example.com",
        "password": "emptypass123",
    }
    client.post("/api/v1/users/register", json=user_data)

    login_data = {"username": "emptyuser", "password": "emptypass123"}
    login_response = client.post("/api/v1/users/login", params=login_data)
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    token_data = login_response.json()
    assert "access_token" in token_data, f"Token missing: {token_data}"

    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/tasks/", headers=headers)
    assert (
        response.status_code == 200
    ), f"Expected 200, got {response.status_code}. Response: {response.text}"
    assert response.json() == []


def test_get_tasks_with_data(client: TestClient):
    """Test getting tasks when tasks exist"""
    # Create user and get token
    user_data = {
        "username": "datauser",
        "email": "data@example.com",
        "password": "datapass123",
    }
    client.post("/api/v1/users/register", json=user_data)

    login_data = {"username": "datauser", "password": "datapass123"}
    login_response = client.post("/api/v1/users/login", params=login_data)
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    token_data = login_response.json()
    assert "access_token" in token_data, f"Token missing: {token_data}"

    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a task first
    task_data = {"title": "Test Task"}
    client.post("/api/v1/tasks/", json=task_data, headers=headers)

    response = client.get("/api/v1/tasks/", headers=headers)
    assert (
        response.status_code == 200
    ), f"Expected 200, got {response.status_code}. Response: {response.text}"
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test Task"


def test_update_task_success(client: TestClient):
    """Test successful task update"""
    # Create user and get token
    user_data = {
        "username": "updateuser",
        "email": "update@example.com",
        "password": "updatepass123",
    }
    client.post("/api/v1/users/register", json=user_data)

    login_data = {"username": "updateuser", "password": "updatepass123"}
    login_response = client.post("/api/v1/users/login", params=login_data)
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    token_data = login_response.json()
    assert "access_token" in token_data, f"Token missing: {token_data}"

    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a task
    task_data = {"title": "Original Title"}
    create_response = client.post("/api/v1/tasks/", json=task_data, headers=headers)
    assert (
        create_response.status_code == 200
    ), f"Create task failed: {create_response.text}"
    task_id = create_response.json()["id"]

    # Update the task
    update_data = {"title": "Updated Title", "completed": True}
    response = client.put(f"/api/v1/tasks/{task_id}", json=update_data, headers=headers)
    assert (
        response.status_code == 200
    ), f"Expected 200, got {response.status_code}. Response: {response.text}"
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["completed"]


def test_delete_task_success(client: TestClient):
    """Test successful task deletion"""
    # Create user and get token
    user_data = {
        "username": "deleteuser",
        "email": "delete@example.com",
        "password": "deletepass123",
    }
    client.post("/api/v1/users/register", json=user_data)

    login_data = {"username": "deleteuser", "password": "deletepass123"}
    login_response = client.post("/api/v1/users/login", params=login_data)
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    token_data = login_response.json()
    assert "access_token" in token_data, f"Token missing: {token_data}"

    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a task
    task_data = {"title": "Task to delete"}
    create_response = client.post("/api/v1/tasks/", json=task_data, headers=headers)
    assert (
        create_response.status_code == 200
    ), f"Create task failed: {create_response.text}"
    task_id = create_response.json()["id"]

    # Delete the task
    response = client.delete(f"/api/v1/tasks/{task_id}", headers=headers)
    assert (
        response.status_code == 200
    ), f"Expected 200, got {response.status_code}. Response: {response.text}"

    # Verify task is gone
    get_response = client.get("/api/v1/tasks/", headers=headers)
    assert len(get_response.json()) == 0


def test_task_ownership_isolation(client: TestClient):
    """Test that users can only see their own tasks"""
    # User 1 creates a task
    user1_data = {
        "username": "user1",
        "email": "user1@example.com",
        "password": "user1pass123",
    }
    client.post("/api/v1/users/register", json=user1_data)

    login1_data = {"username": "user1", "password": "user1pass123"}
    login1_response = client.post("/api/v1/users/login", params=login1_data)
    assert (
        login1_response.status_code == 200
    ), f"User1 login failed: {login1_response.text}"
    token1_data = login1_response.json()
    assert "access_token" in token1_data, f"User1 token missing: {token1_data}"

    token1 = token1_data["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    task_data = {"title": "User 1 Task"}
    client.post("/api/v1/tasks/", json=task_data, headers=headers1)

    # User 2 should not see User 1's tasks
    user2_data = {
        "username": "user2",
        "email": "user2@example.com",
        "password": "user2pass123",
    }
    client.post("/api/v1/users/register", json=user2_data)

    login2_data = {"username": "user2", "password": "user2pass123"}
    login2_response = client.post("/api/v1/users/login", params=login2_data)
    assert (
        login2_response.status_code == 200
    ), f"User2 login failed: {login2_response.text}"
    token2_data = login2_response.json()
    assert "access_token" in token2_data, f"User2 token missing: {token2_data}"

    token2 = token2_data["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    response = client.get("/api/v1/tasks/", headers=headers2)
    assert (
        response.status_code == 200
    ), f"Expected 200, got {response.status_code}. Response: {response.text}"
    assert len(response.json()) == 0
