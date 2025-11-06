def test_health_check(client):
    """ヘルスチェックエンドポイントのテスト"""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'ok'

def test_get_students(client):
    """生徒一覧取得のテスト（空のリスト）"""
    response = client.get('/api/students')
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 0

def test_create_student(client):
    """生徒作成のテスト"""
    new_student = {
        'student_number': 'S001',
        'grade': 3,
        'name': 'テスト太郎',
        'first_choice_university': '東京大学',
        'first_choice_department': '工学部'
    }
    response = client.post('/api/students', json=new_student)
    assert response.status_code == 201
    assert response.json['name'] == 'テスト太郎'
    
    # 作成確認
    response = client.get('/api/students')
    assert len(response.json) == 1