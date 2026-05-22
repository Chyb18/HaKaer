import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0, scale: 0.95,
        duration: 0.8, ease: 'power4.out',
      })

      gsap.from(textRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      })

      gsap.from(infoRef.current?.children ?? [], {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        x: -30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      })

      gsap.from(socialRef.current?.children ?? [], {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        y: 30, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="contact">
      <div className="section-grid" />
      <div className="deco-dots deco-dots-1" />
      <div className="section-container">
        <h2 ref={titleRef} className="section-title">
          <span className="section-number">04.</span> 联系我
        </h2>

        <div className="contact-content">
          <p ref={textRef} className="contact-text">
            我目前正在寻找前端开发岗位，如果你对我的简历感兴趣，
            <br />
            欢迎随时联系我！
          </p>

          <div ref={infoRef} className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <a href="mailto:chenyubin@email.com">chenyubin@email.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🎓</span>
              <span>闽南科技学院 · 2027 届</span>
            </div>
          </div>

          <div ref={socialRef} className="contact-social">
            <a href="https://github.com/Chyb18" className="social-link" target="_blank" rel="noreferrer">
              <span>GitHub</span>
            </a>
            <a href="#" className="social-link" target="_blank" rel="noreferrer">
              <span>LinkedIn</span>
            </a>
            <a href="https://blog.csdn.net/chyb918" className="social-link" target="_blank" rel="noreferrer">
              <span>CSDN</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
