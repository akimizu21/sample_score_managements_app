import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('アプリが正常にレンダリングされる', () => {
    render(<App />)
    // App.jsxの内容に応じて適切なアサーションを追加
    expect(document.body).toBeTruthy()
  })
})