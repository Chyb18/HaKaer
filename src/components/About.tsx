import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.from(statsRef.current?.children ?? [], {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="about">
      <div className="section-container">
        <h2 className="section-title">
          <span className="section-number">01.</span> 关于我
        </h2>
        <div className="about-grid">
          <div ref={contentRef} className="about-text">
            <p>
              你好！我是 <strong>陈宇彬</strong>，一名 27 届毕业生，正在寻找前端开发岗位。
            </p>
            <p>
              我热衷于用技术创造优秀的用户体验，熟练掌握 <strong>Vue3</strong>、<strong>React</strong>、<strong>TypeScript</strong> 等现代前端技术栈。
              从政府级项目到跨境电商平台，从 AI 面试系统到 O2O 服务平台，我参与了多种类型的项目开发，
              积累了丰富的前端工程化与复杂业务处理经验。
            </p>
            <p>
              在团队中，我曾担任前端负责人与核心开发角色，善于协调沟通，注重代码质量与工程规范。
              我相信优秀的前端不仅是功能的实现，更是性能、体验与美学的平衡。
            </p>
          </div>
          <div ref={statsRef} className="about-stats">
            <div className="stat-card">
              <span className="stat-number">14+</span>
              <span className="stat-label">项目经验</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4</span>
              <span className="stat-label">技术栈掌握</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">3</span>
              <span className="stat-label">团队主导项目</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
