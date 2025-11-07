import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './StudentsList.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchUniversity, setSearchUniversity] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_number: '',
    grade: '',
    name: '',
    first_choice_university: '',
    first_choice_department: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchName) params.append('name', searchName);
      if (searchUniversity) params.append('university', searchUniversity);
      
      const response = await axios.get(`${API_URL}/api/search/students?${params}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error searching students:', error);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/students`, newStudent);
      setShowModal(false);
      setNewStudent({
        student_number: '',
        grade: '',
        name: '',
        first_choice_university: '',
        first_choice_department: ''
      });
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('生徒の追加に失敗しました');
    }
  };

  return (
    <div className="student-list">
      <h1>生徒マスターデータインポート</h1>
      
      <div className="search-section">
        <div className="search-filters">
          <input
            type="text"
            placeholder="個人名から検索"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="大学名から検索"
            value={searchUniversity}
            onChange={(e) => setSearchUniversity(e.target.value)}
          />
          <button onClick={handleSearch}>検索</button>
          <button onClick={fetchStudents}>リセット</button>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + 新規生徒追加
        </button>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>生徒番号</th>
            <th>学年</th>
            <th>氏名</th>
            <th>第一志望大学</th>
            <th>第一志望学部</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.student_number}</td>
              <td>{student.grade}年</td>
              <td>{student.name}</td>
              <td>{student.first_choice_university || '-'}</td>
              <td>{student.first_choice_department || '-'}</td>
              <td>
                <Link to={`/students/${student.id}`} className="view-btn">
                  詳細
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>新規生徒追加</h2>
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label>生徒番号 *</label>
                <input
                  type="text"
                  required
                  value={newStudent.student_number}
                  onChange={(e) => setNewStudent({...newStudent, student_number: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>学年 *</label>
                <select
                  required
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                >
                  <option value="">選択してください</option>
                  <option value="1">1年</option>
                  <option value="2">2年</option>
                  <option value="3">3年</option>
                </select>
              </div>
              <div className="form-group">
                <label>氏名 *</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>第一志望大学</label>
                <input
                  type="text"
                  value={newStudent.first_choice_university}
                  onChange={(e) => setNewStudent({...newStudent, first_choice_university: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>第一志望学部</label>
                <input
                  type="text"
                  value={newStudent.first_choice_department}
                  onChange={(e) => setNewStudent({...newStudent, first_choice_department: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  キャンセル
                </button>
                <button type="submit">追加</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;