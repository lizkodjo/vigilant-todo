from fastapi.testclient import TestClient


def test_create_task_success(client: TestClient):
    """Test successful task creation"""
    # First create a user and get token
    user_data = {
        "username": "taskuser",
        "email": "task@example.com",
        "password": "taskpass123",
    }
    client.post("/api/v1/users/register", data=user_data)

    login_data = {"username": "taskuser", "password": "taskpass123"}
    login_response = client.post("/api/v1/users/login", data=login_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    task_data = {
        "title": "Test Task",
        "description": "Test description",
        "completed": False,
    }

    response = client.post("/api/v1/tasks/", json=task_data, headers=headers)
    assert response.status_code == 200
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
    client.post("/api/v1/users/register", data=user_data)

    login_data = {"username": "emptyuser", "password": "emptypass123"}
    login_response = client.post("/api/v1/users/login", data=login_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/tasks/", headers=headers)
    assert response.status_code == 200
    assert response.json() == []


def test_get_tasks_with_data(client: TestClient):
    """Test getting tasks when tasks exist"""
    # Create user and get token
    user_data = {
        "username": "datauser",
        "email": "data@example.com",
        "password": "datapass123",
    }
    client.post("/api/v1/users/register", data=user_data)

    login_data = {"username": "datauser", "password": "datapass123"}
    login_response = client.post("/api/v1/users/login", data=login_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a task first
    task_data = {"title": "Test Task"}
    client.post("/api/v1/tasks/", json=task_data, headers=headers)

    response = client.get("/api/v1/tasks/", headers=headers)
    assert response.status_code == 200
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
    client.post("/api/v1/users/register", data=user_data)

    login_data = {"username": "updateuser", "password": "updatepass123"}
    login_response = client.post("/api/v1/users/login", data=login_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a task
    task_data = {"title": "Original Title"}
    create_response = client.post("/api/v1/tasks/", json=task_data, headers=headers)
    task_id = create_response.json()["id"]

    # Update the task
    update_data = {"title": "Updated Title", "completed": True}
    response = client.put(f"/api/v1/tasks/{task_id}", json=update_data, headers=headers)
    assert response.status_code == 200
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
    client.post("/api/v1/users/register", data=user_data)

    login_data = {"username": "deleteuser", "password": "deletepass123"}
    login_response = client.post("/api/v1/users/login", data=login_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a task
    task_data = {"title": "Task to delete"}
    create_response = client.post("/api/v1/tasks/", json=task_data, headers=headers)
    task_id = create_response.json()["id"]

    # Delete the task
    response = client.delete(f"/api/v1/tasks/{task_id}", headers=headers)
    assert response.status_code == 200

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
    client.post("/api/v1/users/register", data=user1_data)

    login1_data = {"username": "user1", "password": "user1pass123"}
    login1_response = client.post("/api/v1/users/login", data=login1_data)
    token1 = login1_response.json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    task_data = {"title": "User 1 Task"}
    client.post("/api/v1/tasks/", json=task_data, headers=headers1)

    # User 2 should not see User 1's tasks
    user2_data = {
        "username": "user2",
        "email": "user2@example.com",
        "password": "user2pass123",
    }
    client.post("/api/v1/users/register", data=user2_data)

    login2_data = {"username": "user2", "password": "user2pass123"}
    login2_response = client.post("/api/v1/users/login", data=login2_data)
    token2 = login2_response.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    response = client.get("/api/v1/tasks/", headers=headers2)
    assert response.status_code == 200
    assert len(response.json()) == 0
