from fastapi.testclient import TestClient


def test_create_task_success(client: TestClient, auth_headers):
    """Test successful task creation"""
    task_data = {
        "title": "Test Task",
        "description": "Test description",
        "completed": False,
    }
    response = client.post("/api/v1/tasks/", json=task_data, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert not data["completed"]
    assert "id" in data
    assert "owner_id" in data


def test_get_tasks_empty(client: TestClient, auth_headers):
    """Test getting tasks when none exist"""
    response = client.get("/api/v1/tasks/", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_get_tasks_with_data(client: TestClient, auth_headers):
    """Test getting tasks when tasks exist"""
    # Create a task first
    task_data = {"title": "Test Task"}
    client.post("/api/v1/tasks/", json=task_data, headers=auth_headers)

    response = client.get("/api/v1/tasks/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test Task"


def test_update_task_success(client: TestClient, auth_headers):
    """Test successful task update"""
    # Create a task
    task_data = {"title": "Original Title"}
    create_response = client.post(
        "/api/v1/tasks/", json=task_data, headers=auth_headers
    )
    task_id = create_response.json()["id"]

    # Update the task
    update_data = {"title": "Updated Title", "completed": True}
    response = client.put(
        f"/api/v1/tasks/{task_id}", json=update_data, headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["completed"]


def test_delete_task_success(client: TestClient, auth_headers):
    """Test successful task deletion"""
    # Create a task
    task_data = {"title": "Task to delete"}
    create_response = client.post(
        "/api/v1/tasks/", json=task_data, headers=auth_headers
    )
    task_id = create_response.json()["id"]

    # Delete the task
    response = client.delete(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 200

    # Verify task has been deleted
    get_restponse = client.get("/api/v1/tasks/", headers=auth_headers)
    assert len(get_restponse.json()) == 0


def test_task_ownership_isolation(
    client: TestClient, auth_headers, second_user_headers
):
    """Test that users can only see their own tasks"""
    # User 1 creates a task
    task_data = {"title": "User 1 Task"}
    client.post("/api/v1/tasks/", json=task_data, headers=auth_headers)

    # User 2 should not be able to view User 1's task
    response = client.get("/api/v1/tasks/", headers=second_user_headers)
    assert response.status_code == 200
    assert len(response.json()) == 0
