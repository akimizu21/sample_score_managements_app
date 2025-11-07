import { useState } from 'react';
import axios from 'axios';
import './DataImport.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function DataImport() {
  const [importType, setImportType] = useState('scores');
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleImport = async () => {
    if (!file) {
      setMessage('ファイルを選択してください');
      return;
    }

    setImporting(true);
    setMessage('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        const data = [];

        // CSVをパース (簡易実装)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const values = line.split(',');
            if (importType === 'scores' && values.length >= 5) {
              data.push({
                student_id: parseInt(values[0]),
                exam_id: parseInt(values[1]),
                points: parseInt(values[2]),
                deviation_value: parseFloat(values[3]),
                judgment: values[4]
              });
            }
          }
        }

        // APIにデータを送信
        const response = await axios.post(`${API_URL}/api/import/scores`, {
          scores: data
        });

        setMessage(`${data.length}件のデータをインポートしました`);
        setFile(null);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing data:', error);
      setMessage('インポートに失敗しました');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="data-import">
      <h1>データインポート</h1>
      
      <div className="import-section">
        <div className="import-type">
          <label>インポート種類</label>
          <select value={importType} onChange={(e) => setImportType(e.target.value)}>
            <option value="scores">模試成績</option>
            <option value="students">生徒マスター</option>
          </select>
        </div>

        <div className="file-upload">
          <label>CSVファイル選択</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={importing}
          />
          {file && <p className="file-name">選択ファイル: {file.name}</p>}
        </div>

        <button
          className="import-btn"
          onClick={handleImport}
          disabled={importing || !file}
        >
          {importing ? 'インポート中...' : 'インポート実行'}
        </button>

        {message && (
          <div className={`message ${message.includes('失敗') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="format-guide">
        <h2>CSVフォーマット</h2>
        
        <div className="format-section">
          <h3>模試成績インポート</h3>
          <pre>
student_id,exam_id,points,deviation_value,judgment
1,1,450,65.5,B
2,1,520,72.3,A
          </pre>
          <p>※ 1行目はヘッダー行として無視されます</p>
        </div>

        <div className="format-section">
          <h3>生徒マスターインポート</h3>
          <pre>
student_number,grade,name,first_choice_university,first_choice_department
S001,3,山田太郎,東京大学,理学部
S002,2,佐藤花子,早稲田大学,政治経済学部
          </pre>
        </div>
      </div>
    </div>
  );
}

export default DataImport;