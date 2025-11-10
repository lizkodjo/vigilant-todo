import os
import sys
from fastapi.testclient import TestClient
import pytest
from app.main import app

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture
def client():
    return TestClient(app)
