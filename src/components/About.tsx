import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const statNumsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Text paragraphs stagger in
      const paragraphs = textRef.current?.querySelectorAll('p')
      if (paragraphs) {
        gsap.from(paragraphs, {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        })
      }

      // Stats cards stagger in
      const cards = statsRef.current?.children
      if (cards) {
        gsap.from(cards, {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'back.out(1.7)',
        })
      }

      // Counter animation for stat numbers
      const targets = [
        { el: statNumsRef.current[0], target: 14, suffix: '+' },
        { el: statNumsRef.current[1], target: 4, suffix: '' },
        { el: statNumsRef.current[2], target: 3, suffix: '' },
      ]

      targets.forEach(({ el, target, suffix }) => {
        if (!el) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${suffix}`
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const setStatRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) statNumsRef.current[index] = el
  }

  return (
    <section id="about" ref={sectionRef} className="about">
      <div className="section-grid" />
      <div className="deco-dots deco-dots-1" />
      <div className="deco-dots deco-dots-2" />
      <div className="section-container">
        <h2 ref={titleRef} className="section-title">
          <span className="section-number">01.</span> 关于我
        </h2>
        <div className="about-grid">
          <div ref={textRef} className="about-text">
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
              <span ref={(el) => setStatRef(el, 0)} className="stat-number">0</span>
              <span className="stat-label">项目经验</span>
            </div>
            <div className="stat-card">
              <span ref={(el) => setStatRef(el, 1)} className="stat-number">0</span>
              <span className="stat-label">技术栈掌握</span>
            </div>
            <div className="stat-card">
              <span ref={(el) => setStatRef(el, 2)} className="stat-number">0</span>
              <span className="stat-label">团队主导项目</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
