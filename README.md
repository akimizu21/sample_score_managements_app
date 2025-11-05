# 成績管理システム (Student Management System)

学習塾向けの成績管理システムのプロトタイプ。React(Vite) + Flask + PostgreSQLで構築されています。

## 機能要件

### 必須機能 (✅ 実装済み)

1. **ログイン機能** - アプリ利用者を限定し、不正利用を防ぐ
2. **生徒成績詳細画面覧** - 各生徒の基本情報と模試成績、成績推移グラフを閲覧
3. **模試から検索** - 年度、模試名、入力でその模試の成績が閲覧できる
4. **個人名から検索** - 高校名、大学名、氏名などフリーワード検索可能
5. **生徒マスターデータインポート** - 生徒番号と氏名などを紐づけ、成績データに自動補完
6. **データインポート** - 模試成績(点数・偏差値・判定)を一括取り込み

### 追加機能 (今後実装予定)

- マルチ校舎対応 - 将来的に他校舎データとも連携・比較可能
- ロールモデル提示 - 過去の類似成績推移や合格者の学習パターンを提示
- 成績配布・報告のデジタル化 - 紙形式の成績表をデジタル化
- 成績予測 - 次回模試や志望校合格の可能性を推定
- ダッシュボード - 校舎全体の成績分布・伸び率を可視化
- 弱点自動検出 - 科目別・単元別の弱点をAIで抽出
- 自動コメント生成 - AIによるフィードバック文章の自動作成
- 学習プラン提案 - 目標志望校から逆算した学習プランを提示

## 技術スタック

- **フロントエンド**: React 18 + Vite
- **バックエンド**: Flask 3.0 + SQLAlchemy
- **データベース**: PostgreSQL
- **グラフ**: Recharts
- **スタイリング**: CSS

## セットアップ手順

### 1. PostgreSQLのセットアップ

```bash
# PostgreSQLをインストール (既にインストール済みの場合はスキップ)
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# データベースを作成
createdb student_management
```

### 2. バックエンドのセットアップ

```bash
cd backend

# 仮想環境を作成
python -m venv venv

# 仮想環境を有効化
# macOS/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt

# データベースURLを設定 (必要に応じて)
export DATABASE_URL="postgresql://localhost/student_management"

# アプリを起動
python app.py
```

バックエンドは http://localhost:5000 で起動します。

### 3. フロントエンドのセットアップ

```bash
cd frontend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

フロントエンドは http://localhost:5173 で起動します。

## 使い方

### 1. ログイン

初期画面でユーザー名とパスワードを入力してログインします（プロトタイプでは任意の値でログイン可能）。

### 2. 生徒の登録

- サイドバーの「生徒一覧」をクリック
- 「+ 新規生徒追加」ボタンをクリック
- 生徒情報を入力して追加

### 3. 模試成績のインポート

- サイドバーの「データインポート」をクリック
- CSVファイルを選択してインポート

CSVフォーマット例:
```csv
student_id,exam_id,points,deviation_value,judgment
1,1,450,65.5,B
2,1,520,72.3,A
```

### 4. 成績の閲覧

- 「生徒一覧」から生徒を選択
- 詳細画面で模試成績と推移グラフを確認

### 5. 模試から検索

- サイドバーの「模試から検索」をクリック
- 年度、模試名、志望大学で絞り込み検索

## API エンドポイント

### 生徒関連
- `GET /api/students` - 生徒一覧取得
- `POST /api/students` - 生徒追加
- `GET /api/students/:id` - 生徒詳細取得
- `PUT /api/students/:id` - 生徒情報更新
- `DELETE /api/students/:id` - 生徒削除

### 模試関連
- `GET /api/exams` - 模試一覧取得
- `POST /api/exams` - 模試追加

### 成績関連
- `GET /api/scores` - 成績一覧取得 (クエリパラメータでフィルタリング可能)
- `POST /api/scores` - 成績追加
- `POST /api/import/scores` - 成績一括インポート

### 検索
- `GET /api/search/students` - 生徒検索 (名前、大学名でフィルタリング)

## データベーススキーマ

### students テーブル
- id (PRIMARY KEY)
- student_number (UNIQUE)
- grade
- name
- first_choice_university
- first_choice_department
- created_at

### exams テーブル
- id (PRIMARY KEY)
- name
- year
- exam_date
- created_at

### scores テーブル
- id (PRIMARY KEY)
- student_id (FOREIGN KEY)
- exam_id (FOREIGN KEY)
- points
- deviation_value
- judgment
- created_at

## ディレクトリ構成

```
student-management-app/
├── backend/
│   ├── app.py              # Flaskアプリケーション
│   └── requirements.txt    # Python依存関係
├── frontend/
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   │   ├── Login.jsx
│   │   │   ├── StudentList.jsx
│   │   │   ├── StudentDetail.jsx
│   │   │   ├── ExamSearch.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── DataImport.jsx
│   │   ├── App.jsx         # メインアプリ
│   │   └── App.css         # グローバルスタイル
│   └── package.json        # Node.js依存関係
└── README.md
```

## 開発のヒント

### データベースのリセット

データベースをリセットする場合:

```bash
# データベースを削除して再作成
dropdb student_management
createdb student_management

# アプリを起動すると自動的にテーブルが作成されます
cd backend
python app.py
```

### サンプルデータの投入

Pythonスクリプトやcurlコマンドで簡単にサンプルデータを投入できます:

```bash
# 生徒を追加
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "student_number": "S001",
    "grade": 3,
    "name": "山田太郎",
    "first_choice_university": "東京大学",
    "first_choice_department": "理学部"
  }'

# 模試を追加
curl -X POST http://localhost:5000/api/exams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "全国模試",
    "year": 2024,
    "exam_date": "2024-06-15"
  }'
```

## トラブルシューティング

### CORSエラーが発生する場合

`backend/app.py` でCORSの設定を確認してください。Flask-CORSがインストールされていることを確認してください。

### データベース接続エラー

環境変数 `DATABASE_URL` が正しく設定されているか確認してください。

### ポート競合

- バックエンド: デフォルトは5000番ポート
- フロントエンド: デフォルトは5173番ポート

他のアプリケーションと競合する場合は、コード内のポート番号を変更してください。

## ライセンス

このプロジェクトはプロトタイプ/サンプルアプリケーションです。

## 今後の拡張

1. ユーザー認証の強化（JWT認証など）
2. データのバリデーション強化
3. エラーハンドリングの改善
4. テストコードの追加
5. Dockerコンテナ化
6. デプロイ対応（RenderやVercelなど）
7. AI機能の実装（成績予測、学習プラン提案など）