import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import StudentList from './StudentsList'

describe('StudentList', () => {
  it('生徒一覧が表示される', () => {
    const mockStudents = [
      { id: 1, name: '田中太郎', student_number: 'S001', grade: 3 }
    ]
    
    render(<StudentList students={mockStudents} />)
    
    expect(screen.getByText('田中太郎')).toBeInTheDocument()
  })
})