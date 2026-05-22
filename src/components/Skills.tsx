import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const coreTags = ['Vue3', 'React', 'TypeScript', 'ECharts', 'GSAP', 'Vite']

const skillCategories = [
  {
    label: '前端框架',
    icon: '⚡',
    accent: '#6366f1',
    skills: [
      { name: 'Vue3', level: 92 },
      { name: 'React', level: 85 },
      { name: 'TypeScript', level: 88 },
      { name: 'JavaScript', level: 90 },
    ],
  },
  {
    label: 'UI / 可视化',
    icon: '◈',
    accent: '#06b6d4',
    skills: [
      { name: 'ECharts', level: 90 },
      { name: 'D3.js / Sankey', level: 75 },
      { name: 'Element Plus', level: 92 },
      { name: 'GSAP', level: 80 },
    ],
  },
  {
    label: '工程化 / 其他',
    icon: '⚙',
    accent: '#8b5cf6',
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
  const tagsRef = useRef<HTMLDivElement>(null)
  const groupsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    requestAnimationFrame(refresh)
    const timer = setTimeout(refresh, 300)

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        y: 36, opacity: 0, scale: 0.96,
        duration: 0.75, ease: 'power4.out',
      })

      const tags = tagsRef.current?.children
      if (tags?.length) {
        gsap.from(tags, {
          scrollTrigger: { trigger: tagsRef.current, start: 'top 88%' },
          y: 16, opacity: 0, scale: 0.9,
          duration: 0.5, stagger: 0.06, ease: 'back.out(1.6)',
        })
      }

      const groups = groupsRef.current?.children
      if (!groups?.length) return

      gsap.from(groups, {
        scrollTrigger: { trigger: groupsRef.current, start: 'top 85%' },
        y: 48, opacity: 0, rotateX: 8,
        duration: 0.85, stagger: 0.12,
        ease: 'power4.out',
      })

      const allBars = groupsRef.current?.querySelectorAll('.skill-bar-fill')
      if (!allBars?.length) return
      allBars.forEach((bar) => {
        const el = bar as HTMLElement
        const level = el.dataset.level || '0'
        const numEl = el.closest('.skill-item')?.querySelector('.skill-level')
        const obj = { val: 0 }

        gsap.fromTo(el,
          { width: '0%' },
          {
            width: `${level}%`,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        if (numEl) {
          gsap.to(obj, {
            val: parseInt(level, 10),
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: () => {
              numEl.textContent = `${Math.round(obj.val)}%`
            },
          })
        }
      })
    }, sectionRef)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="skills">
      <div className="section-grid" />
      <div className="deco-dots deco-dots-2" />
      <div className="section-container">
        <h2 ref={titleRef} className="section-title">
          <span className="section-number">03.</span> 技能栈
        </h2>

        <div ref={tagsRef} className="skills-tags">
          {coreTags.map((tag) => (
            <span key={tag} className="skill-tag-pill">{tag}</span>
          ))}
        </div>

        <div ref={groupsRef} className="skills-grid">
          {skillCategories.map((group) => (
            <div
              key={group.label}
              className="skill-group"
              style={{ '--group-accent': group.accent } as React.CSSProperties}
            >
              <h3 className="skill-group-title">
                <span className="skill-group-icon" aria-hidden>{group.icon}</span>
                {group.label}
              </h3>
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
