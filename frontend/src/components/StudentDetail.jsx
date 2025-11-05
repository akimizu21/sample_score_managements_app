import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './StudentDetail.css';

const API_URL = 'http://localhost:5000/api';

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStudentDetail();
  }, [id]);

  const fetchStudentDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/students/${id}`);
      setStudent(response.data);
      
      // グラフ用データの整形
      const data = response.data.scores.map((score, index) => ({
        name: score.exam_name,
        点数: score.points,
        偏差値: score.deviation_value
      }));
      setChartData(data);
    } catch (error) {
      console.error('Error fetching student detail:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('この生徒を削除してもよろしいですか?')) {
      try {
        await axios.delete(`${API_URL}/students/${id}`);
        alert('生徒を削除しました');
        navigate('/students');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('削除に失敗しました');
      }
    }
  };

  if (!student) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="student-detail">
      <div className="header">
        <h1>生徒成績詳細画面</h1>
        <button onClick={() => navigate('/students')}>戻る</button>
      </div>

      <div className="student-info">
        <h2>基本情報</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>生徒番号:</label>
            <span>{student.student_number}</span>
          </div>
          <div className="info-item">
            <label>学年:</label>
            <span>{student.grade}年</span>
          </div>
          <div className="info-item">
            <label>氏名:</label>
            <span>{student.name}</span>
          </div>
          <div className="info-item">
            <label>第一志望大学:</label>
            <span>{student.first_choice_university || '-'}</span>
          </div>
          <div className="info-item">
            <label>第一志望学部:</label>
            <span>{student.first_choice_department || '-'}</span>
          </div>
        </div>
        <button className="delete-btn" onClick={handleDelete}>
          生徒を削除
        </button>
      </div>

      <div className="scores-section">
        <h2>模試成績</h2>
        <table className="scores-table">
          <thead>
            <tr>
              <th>年度</th>
              <th>模試名</th>
              <th>点数</th>
              <th>偏差値</th>
              <th>判定</th>
            </tr>
          </thead>
          <tbody>
            {student.scores.map((score) => (
              <tr key={score.id}>
                <td>{score.exam_year}年</td>
                <td>{score.exam_name}</td>
                <td>{score.points}点</td>
                <td>{score.deviation_value}</td>
                <td className={`judgment-${score.judgment}`}>{score.judgment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {chartData.length > 0 && (
        <div className="chart-section">
          <h2>成績推移グラフ</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="点数" stroke="#8884d8" />
              <Line type="monotone" dataKey="偏差値" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default StudentDetail;