from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

# CORS設定 - 一旦すべて許可（後で修正）
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",  # 開発環境
            "https://student-management-frontend-owyk.onrender.com"  # 本番環境（実際のURLに変更）
        ]
    }
})

# Database configuration - 環境変数から取得できるように修正
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL',
    'postgresql://postgres:root@localhost:5432/student_management'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TESTING'] = os.getenv('FLASK_ENV') == 'testing'

db = SQLAlchemy(app)

# Models
class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    student_number = db.Column(db.String(50), unique=True, nullable=False)
    grade = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    first_choice_university = db.Column(db.String(200))
    first_choice_department = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    scores = db.relationship('Score', backref='student', lazy=True, cascade='all, delete-orphan')

class Exam(db.Model):
    __tablename__ = 'exams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    exam_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    scores = db.relationship('Score', backref='exam', lazy=True, cascade='all, delete-orphan')

class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.id'), nullable=False)
    points = db.Column(db.Integer)
    deviation_value = db.Column(db.Float)
    judgment = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ヘルスチェック用エンドポイントを追加（テスト用）
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

# Routes
@app.route('/api/students', methods=['GET', 'POST'])
def handle_students():
    if request.method == 'POST':
        data = request.json
        student = Student(
            student_number=data['student_number'],
            grade=data['grade'],
            name=data['name'],
            first_choice_university=data.get('first_choice_university'),
            first_choice_department=data.get('first_choice_department')
        )
        db.session.add(student)
        db.session.commit()
        return jsonify({
            'id': student.id,
            'student_number': student.student_number,
            'grade': student.grade,
            'name': student.name,
            'first_choice_university': student.first_choice_university,
            'first_choice_department': student.first_choice_department
        }), 201
    else:
        students = Student.query.all()
        return jsonify([{
            'id': s.id,
            'student_number': s.student_number,
            'grade': s.grade,
            'name': s.name,
            'first_choice_university': s.first_choice_university,
            'first_choice_department': s.first_choice_department
        } for s in students])

@app.route('/api/students/<int:student_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_student(student_id):
    student = Student.query.get_or_404(student_id)
    
    if request.method == 'GET':
        scores = Score.query.filter_by(student_id=student_id).join(Exam).all()
        return jsonify({
            'id': student.id,
            'student_number': student.student_number,
            'grade': student.grade,
            'name': student.name,
            'first_choice_university': student.first_choice_university,
            'first_choice_department': student.first_choice_department,
            'scores': [{
                'id': score.id,
                'exam_name': score.exam.name,
                'exam_year': score.exam.year,
                'points': score.points,
                'deviation_value': score.deviation_value,
                'judgment': score.judgment
            } for score in scores]
        })
    
    elif request.method == 'PUT':
        data = request.json
        student.student_number = data.get('student_number', student.student_number)
        student.grade = data.get('grade', student.grade)
        student.name = data.get('name', student.name)
        student.first_choice_university = data.get('first_choice_university', student.first_choice_university)
        student.first_choice_department = data.get('first_choice_department', student.first_choice_department)
        db.session.commit()
        return jsonify({'message': 'Student updated successfully'})
    
    elif request.method == 'DELETE':
        db.session.delete(student)
        db.session.commit()
        return jsonify({'message': 'Student deleted successfully'})

@app.route('/api/exams', methods=['GET', 'POST'])
def handle_exams():
    if request.method == 'POST':
        data = request.json
        exam = Exam(
            name=data['name'],
            year=data['year'],
            exam_date=datetime.strptime(data['exam_date'], '%Y-%m-%d').date() if data.get('exam_date') else None
        )
        db.session.add(exam)
        db.session.commit()
        return jsonify({
            'id': exam.id,
            'name': exam.name,
            'year': exam.year,
            'exam_date': exam.exam_date.isoformat() if exam.exam_date else None
        }), 201
    else:
        exams = Exam.query.all()
        return jsonify([{
            'id': e.id,
            'name': e.name,
            'year': e.year,
            'exam_date': e.exam_date.isoformat() if e.exam_date else None
        } for e in exams])

@app.route('/api/scores', methods=['GET', 'POST'])
def handle_scores():
    if request.method == 'POST':
        data = request.json
        score = Score(
            student_id=data['student_id'],
            exam_id=data['exam_id'],
            points=data.get('points'),
            deviation_value=data.get('deviation_value'),
            judgment=data.get('judgment')
        )
        db.session.add(score)
        db.session.commit()
        return jsonify({
            'id': score.id,
            'student_id': score.student_id,
            'exam_id': score.exam_id,
            'points': score.points,
            'deviation_value': score.deviation_value,
            'judgment': score.judgment
        }), 201
    else:
        year = request.args.get('year', type=int)
        exam_name = request.args.get('exam_name')
        
        query = Score.query.join(Exam).join(Student)
        
        if year:
            query = query.filter(Exam.year == year)
        if exam_name:
            query = query.filter(Exam.name.contains(exam_name))
        
        scores = query.all()
        return jsonify([{
            'id': s.id,
            'student_name': s.student.name,
            'student_number': s.student.student_number,
            'exam_name': s.exam.name,
            'exam_year': s.exam.year,
            'points': s.points,
            'deviation_value': s.deviation_value,
            'judgment': s.judgment
        } for s in scores])

@app.route('/api/search/students', methods=['GET'])
def search_students():
    high_school = request.args.get('high_school')
    university = request.args.get('university')
    name = request.args.get('name')
    
    query = Student.query
    
    if high_school:
        # 高校名での検索 (拡張可能)
        pass
    
    if university:
        query = query.filter(Student.first_choice_university.contains(university))
    
    if name:
        query = query.filter(Student.name.contains(name))
    
    students = query.all()
    return jsonify([{
        'id': s.id,
        'student_number': s.student_number,
        'grade': s.grade,
        'name': s.name,
        'first_choice_university': s.first_choice_university,
        'first_choice_department': s.first_choice_department
    } for s in students])

@app.route('/api/import/scores', methods=['POST'])
def import_scores():
    # CSVインポート機能のプレースホルダー
    data = request.json
    imported_count = 0
    
    for record in data.get('scores', []):
        score = Score(
            student_id=record['student_id'],
            exam_id=record['exam_id'],
            points=record.get('points'),
            deviation_value=record.get('deviation_value'),
            judgment=record.get('judgment')
        )
        db.session.add(score)
        imported_count += 1
    
    db.session.commit()
    return jsonify({'message': f'{imported_count} scores imported successfully'})

# Initialize database - テスト環境では自動作成しない
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)