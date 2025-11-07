import { useState, useEffect } from 'react';
import axios from 'axios';
import './ExamSearch.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ExamSearch() {
  const [year, setYear] = useState('');
  const [examName, setExamName] = useState('');
  const [university, setUniversity] = useState('');
  const [scores, setScores] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/exams`);
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (year) params.append('year', year);
      if (examName) params.append('exam_name', examName);
      
      const response = await axios.get(`${API_URL}/api/scores?${params}`);
      let results = response.data;
      
      // 大学名でフィルタリング
      if (university) {
        results = results.filter(score => 
          score.student_name && score.student_name.includes(university)
        );
      }
      
      setScores(results);
    } catch (error) {
      console.error('Error searching scores:', error);
    }
  };

  return (
    <div className="exam-search">
      <h1>模試から検索</h1>
      
      <div className="search-section">
        <div className="search-filters">
          <div className="filter-group">
            <label>年度</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">すべて</option>
              <option value="2025">2025年</option>
              <option value="2024">2024年</option>
              <option value="2023">2023年</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>模試名</label>
            <input
              type="text"
              placeholder="模試名を入力"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label>志望大学</label>
            <input
              type="text"
              placeholder="大学名を入力"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>
          
          <button onClick={handleSearch}>検索</button>
        </div>
      </div>

      <div className="results-section">
        <h2>検索結果 ({scores.length}件)</h2>
        
        {scores.length > 0 ? (
          <table className="results-table">
            <thead>
              <tr>
                <th>生徒番号</th>
                <th>氏名</th>
                <th>年度</th>
                <th>模試名</th>
                <th>点数</th>
                <th>偏差値</th>
                <th>判定</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td>{score.student_number}</td>
                  <td>{score.student_name}</td>
                  <td>{score.exam_year}年</td>
                  <td>{score.exam_name}</td>
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
          <p className="no-results">検索条件に一致する結果がありません</p>
        )}
      </div>
    </div>
  );
}

export default ExamSearch;