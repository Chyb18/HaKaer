import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

type Message = { role: 'user' | 'ai'; text: string }

const SYSTEM_PROMPT = `你是一个个人网站上的 AI 助手。这个网站的主人叫「陈宇彬」（英文名 Hakaer，哈卡尔），是一位 2027 届前端开发工程师。

关于陈宇彬的信息：
- 学历：闽南科技学院 2027 届毕业生
- 技术栈：Vue3 / React / TypeScript / JavaScript / ECharts / D3.js / GSAP / Vite / Webpack / Pinia / Vuex / WebSocket / Axios
- 项目经验：14+ 真实项目，涵盖政府级系统、跨境电商、AI 平台与小程序
- 特点：专注构建优雅、高性能的 Web 应用

请保持回答简洁友好，用中文回复。如果被问到你不确定的问题，如实说不知道即可。`

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction: SYSTEM_PROMPT })

export default function GeminiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      // focus input after animation
      const t = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    setLoading(true)

    try {
      const chat = model.startChat()
      const result = await chat.sendMessage(text)
      const reply = result.response.text()
      setMessages((prev) => [...prev, { role: 'ai', text: reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: '抱歉，请求出错了，请稍后重试。' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* floating button */}
      <button
        className={`gc-fab ${open ? 'gc-fab--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="AI 助手"
      >
        <span className="material-sym">{open ? 'close' : 'smart_toy'}</span>
      </button>

      {/* chat panel */}
      <div className={`gc-panel ${open ? 'gc-panel--open' : ''}`}>
        <div className="gc-header">
          <span className="material-sym">smart_toy</span>
          <span>AI 助手</span>
        </div>

        <div ref={listRef} className="gc-list">
          {messages.length === 0 && (
            <p className="gc-hint">你好！我是陈宇彬个人网站上的 AI 助手，有什么想问的吗？</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`gc-msg gc-msg--${m.role}`}>
              {m.role === 'ai' && <span className="material-sym gc-msg-icon">smart_toy</span>}
              <div className="gc-bubble">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="gc-msg gc-msg--ai">
              <span className="material-sym gc-msg-icon">smart_toy</span>
              <div className="gc-bubble gc-bubble--typing">
                <span className="gc-dot" /><span className="gc-dot" /><span className="gc-dot" />
              </div>
            </div>
          )}
        </div>

        <div className="gc-footer">
          <input
            ref={inputRef}
            className="gc-input"
            placeholder="输入问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button className="gc-send" onClick={send} disabled={loading || !input.trim()}>
            <span className="material-sym">send</span>
          </button>
        </div>
      </div>
    </>
  )
}
