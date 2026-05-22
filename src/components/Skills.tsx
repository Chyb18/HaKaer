import { useEffect, useRef } from 'react'
import { gsap, initGsap, revealUp } from '../lib/gsap'

const groups = [
  {
    title: '前端框架',
    skills: [
      { name: 'Vue3', level: 92 },
      { name: 'React', level: 85 },
      { name: 'TypeScript', level: 88 },
      { name: 'JavaScript', level: 90 },
    ],
  },
  {
    title: 'UI / 可视化',
    skills: [
      { name: 'ECharts', level: 90 },
      { name: 'D3 / Sankey', level: 75 },
      { name: 'Element Plus', level: 92 },
      { name: 'GSAP', level: 82 },
    ],
  },
  {
    title: '工程化 / 其他',
    skills: [
      { name: 'Vite / Webpack', level: 85 },
      { name: 'Pinia / Vuex', level: 88 },
      { name: 'WebSocket', level: 82 },
      { name: 'Uni-app', level: 80 },
    ],
  },
]

const tags = ['Vue3', 'React', 'TypeScript', 'ECharts', 'GSAP', 'WebSocket', 'Canvas']

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initGsap()
    const ctx = gsap.context(() => {
      revealUp('.skills-intro > *', sectionRef.current, { start: 'top 80%', stagger: 0.08 })

      gsap.from('.skill-tag', {
        scrollTrigger: { trigger: '.skill-tags', start: 'top 88%' },
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'back.out(2)',
      })

      gsap.from('.skill-card', {
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
        y: 64,
        opacity: 0,
        rotateY: 8,
        transformOrigin: '50% 50%',
        duration: 0.85,
        stagger: 0.14,
        ease: 'power4.out',
      })

      const bars = sectionRef.current?.querySelectorAll('.skill-bar-fill')
      if (bars?.length) {
        gsap.fromTo(
          bars,
          { width: '0%' },
          {
            width: (_, el) => `${(el as HTMLElement).dataset.level}%`,
            duration: 1.4,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
              end: 'top 35%',
              scrub: 0.9,
            },
          },
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="section skills">
      <div className="section-inner">
        <div className="skills-intro">
          <p className="section-eyebrow">Skills</p>
          <h2 className="section-heading">技术栈</h2>
          <div className="skill-tags">
            {tags.map((t) => (
              <span key={t} className="skill-tag">{t}</span>
            ))}
          </div>
        </div>
        <div ref={gridRef} className="skills-grid">
          {groups.map((g) => (
            <div key={g.title} className="skill-card ag-card">
              <h3 className="skill-card-title">{g.title}</h3>
              {g.skills.map((s) => (
                <div key={s.name} className="skill-row">
                  <div className="skill-row-head">
                    <span>{s.name}</span>
                    <span className="skill-pct">{s.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-bar-fill"
                      data-level={s.level}
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
