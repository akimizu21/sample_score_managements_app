#!/usr/bin/env python3
"""
サンプルデータ投入スクリプト

このスクリプトは開発とテスト用のサンプルデータをデータベースに投入します。
"""

import requests
import json

API_URL = "http://localhost:5000/api"

def create_students():
    """生徒のサンプルデータを作成"""
    students = [
        {
            "student_number": "S001",
            "grade": 3,
            "name": "山田太郎",
            "first_choice_university": "東京大学",
            "first_choice_department": "理学部"
        },
        {
            "student_number": "S002",
            "grade": 3,
            "name": "佐藤花子",
            "first_choice_university": "早稲田大学",
            "first_choice_department": "政治経済学部"
        },
        {
            "student_number": "S003",
            "grade": 2,
            "name": "鈴木一郎",
            "first_choice_university": "慶應義塾大学",
            "first_choice_department": "経済学部"
        },
        {
            "student_number": "S004",
            "grade": 2,
            "name": "田中美咲",
            "first_choice_university": "京都大学",
            "first_choice_department": "工学部"
        },
        {
            "student_number": "S005",
            "grade": 1,
            "name": "伊藤健太",
            "first_choice_university": "一橋大学",
            "first_choice_department": "商学部"
        }
    ]
    
    print("生徒データを投入中...")
    created_students = []
    for student in students:
        try:
            response = requests.post(f"{API_URL}/students", json=student)
            if response.status_code == 201:
                created_student = response.json()
                created_students.append(created_student)
                print(f"✓ {student['name']} を追加しました (ID: {created_student['id']})")
            else:
                print(f"✗ {student['name']} の追加に失敗しました")
        except Exception as e:
            print(f"✗ エラー: {e}")
    
    return created_students

def create_exams():
    """模試のサンプルデータを作成"""
    exams = [
        {
            "name": "第1回全国模試",
            "year": 2024,
            "exam_date": "2024-04-15"
        },
        {
            "name": "第2回全国模試",
            "year": 2024,
            "exam_date": "2024-06-15"
        },
        {
            "name": "夏期模試",
            "year": 2024,
            "exam_date": "2024-08-20"
        },
        {
            "name": "第3回全国模試",
            "year": 2024,
            "exam_date": "2024-10-15"
        }
    ]
    
    print("\n模試データを投入中...")
    created_exams = []
    for exam in exams:
        try:
            response = requests.post(f"{API_URL}/exams", json=exam)
            if response.status_code == 201:
                created_exam = response.json()
                created_exams.append(created_exam)
                print(f"✓ {exam['name']} を追加しました (ID: {created_exam['id']})")
            else:
                print(f"✗ {exam['name']} の追加に失敗しました")
        except Exception as e:
            print(f"✗ エラー: {e}")
    
    return created_exams

def create_scores(students, exams):
    """成績のサンプルデータを作成"""
    import random
    
    print("\n成績データを投入中...")
    judgments = ['A', 'B', 'C', 'D', 'E']
    
    count = 0
    for student in students:
        for exam in exams:
            # ランダムな成績を生成
            points = random.randint(300, 600)
            deviation_value = round(40 + (points - 300) / 300 * 30, 1)
            
            # 偏差値に基づいて判定を決定
            if deviation_value >= 65:
                judgment = 'A'
            elif deviation_value >= 60:
                judgment = 'B'
            elif deviation_value >= 55:
                judgment = 'C'
            elif deviation_value >= 50:
                judgment = 'D'
            else:
                judgment = 'E'
            
            score = {
                "student_id": student['id'],
                "exam_id": exam['id'],
                "points": points,
                "deviation_value": deviation_value,
                "judgment": judgment
            }
            
            try:
                response = requests.post(f"{API_URL}/scores", json=score)
                if response.status_code == 201:
                    count += 1
                    print(f"✓ {student['name']} - {exam['name']}: {points}点 (偏差値{deviation_value}, 判定{judgment})")
                else:
                    print(f"✗ 成績の追加に失敗しました")
            except Exception as e:
                print(f"✗ エラー: {e}")
    
    print(f"\n合計 {count} 件の成績データを投入しました")

def main():
    print("=" * 60)
    print("サンプルデータ投入スクリプト")
    print("=" * 60)
    print()
    
    try:
        # APIサーバーが起動しているか確認
        response = requests.get(f"{API_URL}/students")
        print("✓ APIサーバーに接続しました\n")
    except requests.exceptions.ConnectionError:
        print("✗ APIサーバーに接続できません")
        print("バックエンドサーバーが起動しているか確認してください (python app.py)")
        return
    
    students = create_students()
    exams = create_exams()
    
    if students and exams:
        create_scores(students, exams)
    
    print("\n" + "=" * 60)
    print("サンプルデータの投入が完了しました!")
    print("=" * 60)
    print("\nブラウザで http://localhost:5173 にアクセスしてアプリを確認してください")

if __name__ == "__main__":
    main()