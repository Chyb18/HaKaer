import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    label: '前端框架',
    skills: [
      { name: 'Vue3', level: 92 },
      { name: 'React', level: 85 },
      { name: 'TypeScript', level: 88 },
      { name: 'JavaScript', level: 90 },
    ],
  },
  {
    label: 'UI / 可视化',
    skills: [
      { name: 'ECharts', level: 90 },
      { name: 'D3.js / Sankey', level: 75 },
      { name: 'Element Plus', level: 92 },
      { name: 'GSAP', level: 80 },
    ],
  },
  {
    label: '工程化 / 其他',
    skills: [
      { name: 'Vite / Webpack', level: 85 },
      { name: 'Pinia / Vuex', level: 88 },
      { name: 'WebSocket', level: 82 },
      { name: 'Axios', level: 90 },
    ],
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const groupsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const bars = groupsRef.current?.querySelectorAll('.skill-bar-fill')
    if (!bars) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target as HTMLElement
            const level = bar.dataset.level
            gsap.to(bar, {
              width: `${level}%`,
              duration: 1.2,
              ease: 'power3.out',
            })
            observer.unobserve(bar)
          }
        })
      },
      { threshold: 0.3 }
    )
    bars.forEach((bar) => observer.observe(bar))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="skills">
      <div className="section-container">
        <h2 ref={titleRef} className="section-title">
          <span className="section-number">03.</span> 技能栈
        </h2>

        <div ref={groupsRef} className="skills-grid">
          {skillCategories.map((group) => (
            <div key={group.label} className="skill-group">
              <h3 className="skill-group-title">{group.label}</h3>
              {group.skills.map((skill) => (
                <div key={skill.name} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-bar-fill"
                      data-level={skill.level}
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
