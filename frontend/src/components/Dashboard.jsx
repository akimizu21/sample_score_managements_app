import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    recentScores: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, examsRes, scoresRes] = await Promise.all([
        axios.get(`${API_URL}/api/students`),     // /api を追加
        axios.get(`${API_URL}/api/exams`),        // /api を追加
        axios.get(`${API_URL}/api/scores`)        // /api を追加
      ]);

      setStats({
        totalStudents: studentsRes.data.length,
        totalExams: examsRes.data.length,
        recentScores: scoresRes.data.slice(0, 10)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>ダッシュボード</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>登録生徒数</h3>
          <p className="stat-number">{stats.totalStudents}</p>
          <span>人</span>
        </div>
        
        <div className="stat-card">
          <h3>登録模試数</h3>
          <p className="stat-number">{stats.totalExams}</p>
          <span>件</span>
        </div>
        
        <div className="stat-card">
          <h3>成績データ数</h3>
          <p className="stat-number">{stats.recentScores.length}</p>
          <span>件</span>
        </div>
      </div>

      <div className="recent-section">
        <h2>最近の成績データ</h2>
        {stats.recentScores.length > 0 ? (
          <table className="recent-table">
            <thead>
              <tr>
                <th>生徒名</th>
                <th>模試名</th>
                <th>年度</th>
                <th>点数</th>
                <th>偏差値</th>
                <th>判定</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentScores.map((score, index) => (
                <tr key={index}>
                  <td>{score.student_name}</td>
                  <td>{score.exam_name}</td>
                  <td>{score.exam_year}年</td>
                  <td>{score.points}点</td>
                  <td>{score.deviation_value}</td>
                  <td className={`judgment-${score.judgment}`}>
                    {score.judgment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">データがありません</p>
        )}
      </div>

      <div className="quick-actions">
        <h2>クイックアクション</h2>
        <div className="action-buttons">
          <button onClick={() => window.location.href = '/students'}>
            生徒一覧を見る
          </button>
          <button onClick={() => window.location.href = '/exams'}>
            模試から検索
          </button>
          <button onClick={() => window.location.href = '/import'}>
            データをインポート
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;