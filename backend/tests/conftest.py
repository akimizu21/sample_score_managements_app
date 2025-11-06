import pytest
import os
from app import app as flask_app, db as _db

@pytest.fixture(scope='session')
def app():
    """テスト用のFlaskアプリを作成"""
    flask_app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': os.getenv(
            'DATABASE_URL',
            'postgresql://testuser:testpass@localhost:5432/testdb'
        ),
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    })
    
    ctx = flask_app.app_context()
    ctx.push()
    
    yield flask_app
    
    ctx.pop()

@pytest.fixture(scope='function')
def db(app):
    """各テスト関数ごとにDBをセットアップ"""
    _db.create_all()
    
    yield _db
    
    _db.session.remove()
    _db.drop_all()

@pytest.fixture
def client(app, db):
    """テストクライアントを作成"""
    return app.test_client()