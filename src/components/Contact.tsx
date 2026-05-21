import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from(contentRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="contact">
      <div className="section-container">
        <h2 ref={titleRef} className="section-title">
          <span className="section-number">04.</span> 联系我
        </h2>

        <div ref={contentRef} className="contact-content">
          <p className="contact-text">
            我目前正在寻找前端开发岗位，如果你对我的简历感兴趣，
            <br />
            欢迎随时联系我！
          </p>

          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <a href="mailto:chenyubin@email.com">chenyubin@email.com</a>
            </div>
            {/* <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>中国</span>
            </div> */}
            <div className="contact-item">
              <span className="contact-icon">🎓</span>
              <span>闽南科技学院 · 2027 届</span>
            </div>
          </div>

          <div className="contact-social">
            <a href="https://github.com/Chyb18" className="social-link" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="#" className="social-link" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://blog.csdn.net/chyb918" className="social-link" target="_blank" rel="noreferrer">
              CSDN
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
