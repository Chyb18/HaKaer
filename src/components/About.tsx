import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, initGsap } from '../lib/gsap'
import { scrubLayerParallax } from '../lib/gsap-cinematic'

const stats = [
  { value: 14, suffix: '+', label: '项目经验' },
  { value: 4, suffix: '', label: '技术专栏' },
  { value: 2, suffix: '年', label: '码龄' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const numRefs = useRef<HTMLSpanElement[]>([])
  const [time, setTime] = useState('')

  // 泉州福建本地时钟
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Shanghai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      setTime(new Intl.DateTimeFormat('zh-CN', options).format(new Date()))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useGSAP(
    () => {
      initGsap()
      const section = sectionRef.current
      if (!section) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      // Bento 模块整体入场
      gsap.from('.bento-cell', {
        scrollTrigger: {
          trigger: '.bento-grid',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        y: 48,
        opacity: 0,
        scale: 0.96,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
      })

      if (visualRef.current) {
        scrubLayerParallax(visualRef.current, section, 8, 0.65)
      }

      // 数字滚动效果
      stats.forEach((s, i) => {
        const el = numRefs.current[i]
        if (!el) return
        const obj = { v: 0 }
        gsap.to(obj, {
          v: s.value,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.bento-grid',
            start: 'top 84%',
            end: 'top 50%',
            scrub: 0.8,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${s.suffix}`
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section id="about" ref={sectionRef} className="section about">
      <div ref={visualRef} className="about-glow" aria-hidden />
      <div className="section-inner about-inner">
        <p className="section-eyebrow">About Me</p>
        <h2 className="section-heading">关于我</h2>
        
        {/* Bento 栅格群 */}
        <div className="bento-grid">
          
          {/* Bento Cell 1: 核心故事介绍 */}
          <div className="bento-cell bento-cell--large ag-card">
            <span className="section-eyebrow" style={{ color: 'var(--accent-2)' }}>Profile</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '16px 0 12px', letterSpacing: '-0.02em' }}>
              为复杂业务而生，为用户体验而精
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.8 }}>
              陈宇彬（哈卡尔），闽南科技学院 2027 届毕业生。在 CSDN 分享前端技术总结，擅长 Vue3 全家桶、三维可视化、实时通信与定制组件开发。能在紧张周期内完成从需求拆解到上线交付的前端全生命周期开发。
            </p>
          </div>

          {/* Bento Cell 2: 泉州福建本地时钟 */}
          <div className="bento-cell bento-cell--small ag-card">
            <div className="bento-clock">
              <div className="bento-clock-header">
                <span className="section-eyebrow" style={{ color: 'var(--accent-3)' }}>Location</span>
                <div className="bento-clock-status">
                  <span className="bento-clock-dot" />
                  <span>在线</span>
                </div>
              </div>
              <div>
                <p className="bento-clock-time">{time}</p>
                <p className="bento-clock-location">📍 福建 · 泉州 | 当地时区</p>
              </div>
            </div>
          </div>

          {/* Bento Cells 3, 4, 5: 滚动数字核心指标 */}
          {stats.map((s, i) => (
            <div key={s.label} className="bento-cell bento-cell--small ag-card">
              <div className="bento-stat">
                <span
                  ref={(el) => {
                    if (el) numRefs.current[i] = el
                  }}
                  className="bento-stat-num"
                >
                  0{s.suffix}
                </span>
                <span className="bento-stat-label">{s.label}</span>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
