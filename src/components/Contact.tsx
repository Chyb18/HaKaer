import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'chenyubin@email.com'

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/Chyb18',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'CSDN',
    href: 'https://blog.csdn.net/chyb918',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M6.5 4h11v2h-11V4zm0 4h11v2h-11V8zm0 4h7v2h-7v-2zm-2 8 2.5-6h2.8l-2.5 6H4.5zm5.2 0 3.2-8h2.6l3.2 8h-2.5l-.6-1.6h-3.4l-.6 1.6H9.7zm4.1-3.2.9-2.4.9 2.4h-1.8zM19 16l2.5-6H24l-2.5 6H19z" />
      </svg>
    ),
  },
]

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

function IconSchool() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3L2 9l10 6 10-6-10-6z" />
      <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 9v7" />
    </svg>
  )
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    requestAnimationFrame(refresh)
    const timer = setTimeout(refresh, 300)

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        y: 56, opacity: 0, scale: 0.94,
        duration: 0.9, ease: 'power4.out',
      })

      const items = cardRef.current?.querySelectorAll('.contact-animate')
      if (items?.length) {
        gsap.from(items, {
          scrollTrigger: { trigger: cardRef.current, start: 'top 88%' },
          y: 24, opacity: 0,
          duration: 0.65, stagger: 0.1,
          ease: 'power3.out',
          delay: 0.15,
        })
      }
    }, sectionRef)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="contact">
      <div className="section-grid" />
      <div className="deco-dots deco-dots-1" />
      <div className="section-container contact-container">
        <h2 className="section-title contact-animate">
          <span className="section-number">04.</span> 联系我
        </h2>

        <div ref={cardRef} className="contact-card">
          <div className="contact-card-glow" aria-hidden />

          <div className="contact-badge contact-animate">
            <span className="contact-badge-dot" />
            开放前端岗位机会
          </div>

          <p className="contact-text contact-animate">
            我目前正在寻找前端开发岗位。如果你对我的项目经验与技术栈感兴趣，欢迎通过以下方式联系我。
          </p>

          <div className="contact-actions contact-animate">
            <a href={`mailto:${EMAIL}`} className="btn-primary contact-btn-mail">
              发送邮件
            </a>
            <button type="button" className="btn-outline contact-btn-copy" onClick={copyEmail}>
              {copied ? '已复制' : '复制邮箱'}
            </button>
          </div>

          <div className="contact-info">
            <div className="contact-item contact-animate">
              <span className="contact-icon-wrap" aria-hidden><IconMail /></span>
              <div className="contact-item-body">
                <span className="contact-item-label">邮箱</span>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </div>
            <div className="contact-item contact-animate">
              <span className="contact-icon-wrap" aria-hidden><IconSchool /></span>
              <div className="contact-item-body">
                <span className="contact-item-label">教育</span>
                <span>闽南科技学院 · 2027 届</span>
              </div>
            </div>
          </div>

          <div className="contact-social contact-animate">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="social-link"
                target="_blank"
                rel="noreferrer"
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
