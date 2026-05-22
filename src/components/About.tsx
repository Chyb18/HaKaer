import { useEffect, useRef } from 'react'
import { gsap, initGsap, revealUp } from '../lib/gsap'

const stats = [
  { value: 14, suffix: '+', label: '项目经验' },
  { value: 4, suffix: '', label: '技术专栏' },
  { value: 2, suffix: '年', label: '码龄' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const numRefs = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    initGsap()
    const ctx = gsap.context(() => {
      revealUp('.about-label, .about-text', sectionRef.current, { start: 'top 80%' })

      const lines = headingRef.current?.querySelectorAll('.about-heading-line')
      if (lines?.length) {
        gsap.from(lines, {
          y: 60,
          opacity: 0,
          rotateX: -12,
          transformOrigin: '50% 100%',
          duration: 0.9,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      gsap.from('.about-stat', {
        scrollTrigger: {
          trigger: '.about-stats',
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
        y: 56,
        opacity: 0,
        scale: 0.92,
        duration: 0.75,
        stagger: 0.12,
        ease: 'back.out(1.5)',
      })

      stats.forEach((s, i) => {
        const el = numRefs.current[i]
        if (!el) return
        const obj = { v: 0 }
        gsap.to(obj, {
          v: s.value,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 82%',
            end: 'top 50%',
            scrub: 0.8,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${s.suffix}`
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="section about">
      <div className="section-inner">
        <p className="about-label section-eyebrow">About</p>
        <h2 ref={headingRef} className="about-heading section-heading">
          <span className="about-heading-line">为复杂业务而生，</span>
          <span className="about-heading-line">为用户体验而精。</span>
        </h2>
        <p className="about-text section-body">
          闽南科技学院 2027 届毕业生，在 CSDN 分享前端学习笔记与实战总结。
          擅长 Vue3 全家桶、数据可视化、地图与实时通信，能在紧张周期内完成从需求拆解到上线交付的全流程前端工作。
        </p>
        <div className="about-stats">
          {stats.map((s, i) => (
            <div key={s.label} className="about-stat ag-card">
              <span
                ref={(el) => {
                  if (el) numRefs.current[i] = el
                }}
                className="about-stat-num"
              >
                0{s.suffix}
              </span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
