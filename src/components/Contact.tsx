import { useEffect, useRef, useState } from 'react'
import { gsap, initGsap, revealUp } from '../lib/gsap'

interface LogLine {
  text: string
  type: 'prompt' | 'info' | 'success' | 'output'
}

const EMAIL = 'chenyubinasd@email.com'
const CSDN = 'https://blog.csdn.net/chyb918'
const GITHUB = 'https://github.com/Chyb18'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // 终端日志状态
  const [logs, setLogs] = useState<LogLine[]>([
    { text: 'System Core v2.7.0 initialized successfully.', type: 'output' },
    { text: 'yubin@hakare:~$ status --recruiting', type: 'prompt' },
    { text: 'STATUS: Ready for frontend opportunities | 开放 2027 届前端开发工程师机会', type: 'success' },
    { text: 'yubin@hakare:~$ help', type: 'prompt' },
    { text: 'Click any link or button to execute direct commands below.', type: 'output' },
  ])

  useEffect(() => {
    initGsap()
    const ctx = gsap.context(() => {
      revealUp('.contact-intro > *', sectionRef.current, { start: 'top 82%' })

      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
        y: 64,
        opacity: 0,
        scale: 0.94,
        rotateX: 6,
        transformOrigin: '50% 80%',
        duration: 1,
        ease: 'power4.out',
      })

      gsap.from('.contact-actions > *, .terminal-box', {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.15,
        ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // 执行终端模拟命令
  const runCommand = (cmd: string, action: () => void, successMsg: string) => {
    setLogs((prev) => [...prev, { text: `yubin@hakare:~$ ${cmd}`, type: 'prompt' }])
    
    setTimeout(() => {
      setLogs((prev) => [...prev, { text: `[PROCESSING] Executing ${cmd}...`, type: 'info' }])
    }, 150)

    setTimeout(() => {
      action()
      setLogs((prev) => [...prev, { text: `[SUCCESS] ${successMsg}`, type: 'success' }])
    }, 500)
  }

  const handleCopyEmail = () => {
    runCommand('copy --email', async () => {
      try {
        await navigator.clipboard.writeText(EMAIL)
      } catch {
        window.location.href = `mailto:${EMAIL}`
      }
    }, 'Email copied to clipboard successfully! (chenyubinasd@email.com)')
  }

  const handleOpenCSDN = () => {
    runCommand('open --csdn', () => {
      window.open(CSDN, '_blank', 'noreferrer')
    }, 'Established connection to CSDN blog. Redirected!')
  }

  const handleOpenGitHub = () => {
    runCommand('open --github', () => {
      window.open(GITHUB, '_blank', 'noreferrer')
    }, 'Secure shell opened to GitHub. Redirected!')
  }

  return (
    <section id="contact" ref={sectionRef} className="section contact">
      <div className="section-inner contact-inner">
        <div className="contact-intro">
          <p className="section-eyebrow">Contact</p>
          <h2 className="section-heading">极客联络盒</h2>
          <p className="section-body" style={{ margin: '0 auto 32px' }}>
            点击下方按钮或直接在终端进行模拟交互 — 开启高效率沟通
          </p>
        </div>

        <div ref={cardRef} className="contact-card ag-card" style={{ maxWidth: '780px', padding: '40px 32px' }}>
          <div className="contact-badge">
            <span className="contact-badge-dot" />
            开放 2027 届前端岗位机会
          </div>
          <p className="contact-lead" style={{ fontSize: '1.1rem', fontWeight: 500 }}>
            陈宇彬 · 闽南科技学院 2027 届 · 致力构建优雅的 Web 前端系统
          </p>

          <div className="contact-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="btn-ag btn-ag--primary" onClick={handleCopyEmail}>
              <span className="material-sym">content_copy</span>
              复制邮箱
            </button>
            <button type="button" className="btn-ag btn-ag--ghost" onClick={handleOpenCSDN}>
              <span className="material-sym">article</span>
              CSDN 博客
            </button>
            <button type="button" className="btn-ag btn-ag--ghost" onClick={handleOpenGitHub}>
              <span className="material-sym">code</span>
              GitHub 库
            </button>
          </div>

          {/* 极客终端交互面板 */}
          <div className="terminal-box">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot" />
                <span className="terminal-dot" />
                <span className="terminal-dot" />
              </div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>yubin@hakare: ~/portfolio-terminal</span>
              <span className="material-sym" style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>terminal</span>
            </div>
            <div className="terminal-body">
              {logs.map((l, li) => {
                if (l.type === 'prompt') {
                  return (
                    <div key={li} className="terminal-line">
                      <span className="terminal-prompt">{l.text.split(' ')[0]}</span>{' '}
                      <span style={{ color: 'var(--text)' }}>{l.text.split(' ').slice(1).join(' ')}</span>
                    </div>
                  )
                }
                if (l.type === 'success') {
                  return (
                    <div key={li} className="terminal-line terminal-success">
                      {l.text}
                    </div>
                  )
                }
                if (l.type === 'info') {
                  return (
                    <div key={li} className="terminal-line" style={{ color: 'var(--accent-2)' }}>
                      {l.text}
                    </div>
                  )
                }
                return (
                  <div key={li} className="terminal-line terminal-output">
                    {l.text}
                  </div>
                )
              })}
              <div className="terminal-line">
                <span className="terminal-prompt">yubin@hakare:~$</span>
                <span className="terminal-cursor" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
