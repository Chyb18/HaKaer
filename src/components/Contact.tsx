import { useEffect, useRef, useState } from 'react'
import { gsap, initGsap, revealUp } from '../lib/gsap'

const EMAIL = 'chenyubinasd@email.com'
const CSDN = 'https://blog.csdn.net/chyb918'
const GITHUB = 'https://github.com/Chyb18'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

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

      gsap.from('.contact-link-item, .contact-actions > *', {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        x: -24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        delay: 0.2,
        ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
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
    <section id="contact" ref={sectionRef} className="section contact">
      <div className="section-inner contact-inner">
        <div className="contact-intro">
          <p className="section-eyebrow">Contact</p>
          <h2 className="section-heading">联系我</h2>
        </div>

        <div ref={cardRef} className="contact-card ag-card">
          <div className="contact-badge">
            <span className="contact-badge-dot" />
            开放前端岗位机会
          </div>
          <p className="contact-lead">
            陈宇彬 · 闽南科技学院 2027 届 · 立志成为前端开发工程师
          </p>
          <div className="contact-actions">
            <a href={`mailto:${EMAIL}`} className="btn-ag btn-ag--primary">
              发送邮件
            </a>
            <button type="button" className="btn-ag btn-ag--ghost" onClick={copyEmail}>
              {copied ? '已复制' : '复制邮箱'}
            </button>
          </div>
          <div className="contact-links">
            <a href={CSDN} target="_blank" rel="noreferrer" className="contact-link-item">
              <span className="material-sym">article</span>
              <div>
                <span className="contact-link-label">CSDN 博客</span>
                <span className="contact-link-url">blog.csdn.net/chyb918</span>
              </div>
            </a>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="contact-link-item">
              <span className="material-sym">code</span>
              <div>
                <span className="contact-link-label">GitHub</span>
                <span className="contact-link-url">github.com/Chyb18</span>
              </div>
            </a>
            <div className="contact-link-item contact-link-item--static">
              <span className="material-sym">school</span>
              <div>
                <span className="contact-link-label">教育</span>
                <span className="contact-link-url">闽南科技学院 · 2027 届</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
