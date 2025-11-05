import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import StudentList from './components/StudentsList';
import StudentDetail from './components/StudentDetail';
import ExamSearch from './components/ExamSearch';
import Dashboard from './components/Dashboard';
import DataImport from './components/DataImport';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <h1>成績管理システム</h1>
          <ul>
            <li><Link to="/">ダッシュボード</Link></li>
            <li><Link to="/students">生徒一覧</Link></li>
            <li><Link to="/exams">模試から検索</Link></li>
            <li><Link to="/import">データインポート</Link></li>
          </ul>
          <button onClick={() => setIsAuthenticated(false)} className="logout-btn">
            ログアウト
          </button>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/exams" element={<ExamSearch />} />
            <Route path="/import" element={<DataImport />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;