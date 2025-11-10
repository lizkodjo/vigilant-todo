# app/tests/conftest.py
import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add the project root to Python path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)
