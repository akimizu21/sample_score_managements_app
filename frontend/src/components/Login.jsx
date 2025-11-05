import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 実際の認証処理はここに実装
    // プロトタイプのため、簡易的な処理
    if (username && password) {
      onLogin();
    } else {
      alert('ユーザー名とパスワードを入力してください');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>成績管理システム</h1>
        <h2>ログイン</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名を入力"
            />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
            />
          </div>
          <button type="submit" className="login-btn">ログイン</button>
        </form>
      </div>
    </div>
  );
}

export default Login;