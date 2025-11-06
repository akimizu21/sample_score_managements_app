import pytest
from app import app as flask_app
import os

@pytest.fixture
def app():
    """テスト用のFlaskアプリケーションを作成"""
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": os.getenv(
            "DATABASE_URL",
            "postgresql://testuser:testpass@localhost:5432/testdb"
        ),
    })
    
    yield flask_app

@pytest.fixture
def client(app):
    """テストクライアントを作成"""
    return app.test_client()

@pytest.fixture
def runner(app):
    """CLIランナーを作成"""
    return app.test_cli_runner()