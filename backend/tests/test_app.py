def test_health_check(client):
    """ヘルスチェックエンドポイントのテスト"""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'ok'

def test_get_students(client):
    """生徒一覧取得のテスト"""
    response = client.get('/api/students')
    assert response.status_code == 200
    assert isinstance(response.json, list)