import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

const categoryLabels: Record<string, string> = {
  all: '全部',
  government: '政府级',
  ecommerce: '电商',
  saas: 'SaaS',
  ai: 'AI',
  o2o: 'O2O',
  mini: '小程序',
  competition: '比赛',
}

const cardThemes = [
  { p: '#6366f1', s: '#8b5cf6', c: 'rgba(99,102,241,0.04)' },
  { p: '#06b6d4', s: '#0891b2', c: 'rgba(6,182,212,0.04)' },
  { p: '#f59e0b', s: '#d97706', c: 'rgba(245,158,11,0.04)' },
  { p: '#10b981', s: '#059669', c: 'rgba(16,185,129,0.04)' },
  { p: '#f472b6', s: '#ec4899', c: 'rgba(244,114,182,0.04)' },
  { p: '#a78bfa', s: '#7c3aed', c: 'rgba(167,139,250,0.04)' },
  { p: '#fb923c', s: '#ea580c', c: 'rgba(251,146,60,0.04)' },
  { p: '#22d3ee', s: '#06b6d4', c: 'rgba(34,211,238,0.04)' },
  { p: '#34d399', s: '#10b981', c: 'rgba(52,211,153,0.04)' },
  { p: '#e879f9', s: '#d946ef', c: 'rgba(232,121,249,0.04)' },
  { p: '#f87171', s: '#ef4444', c: 'rgba(248,113,113,0.04)' },
  { p: '#818cf8', s: '#6366f1', c: 'rgba(129,140,248,0.04)' },
  { p: '#fbbf24', s: '#f59e0b', c: 'rgba(251,191,36,0.04)' },
  { p: '#2dd4bf', s: '#14b8a6', c: 'rgba(45,212,191,0.04)' },
]

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [curIndex, setCurIndex] = useState(0)

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  // Title + filter entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      })
      gsap.from(filterRef.current?.children ?? [], {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        y: 20, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Flipping card deck scroll animation
  useEffect(() => {
    const cards = deckRef.current?.children
    if (!cards || cards.length === 0) return

    const ctx = gsap.context(() => {
      // Initial state: first card visible, rest spread out to the right
      gsap.set(cards[0], { opacity: 1, rotationY: 0, scale: 1, x: 0, z: 0 })
      for (let i = 1; i < cards.length; i++) {
        gsap.set(cards[i], {
          opacity: 0, rotationY: 45, scale: 0.8, x: 200, z: -200,
        })
      }

      const tl = gsap.timeline({
        onUpdate: () => {
          const prog = tl.progress()
          const idx = Math.min(Math.floor(prog * cards.length), cards.length - 1)
          setCurIndex(idx)
        },
      })

      const step = 1 / cards.length

      for (let i = 0; i < cards.length; i++) {
        // Flip in: slide from right → center with 3D rotation
        if (i > 0) {
          tl.to(cards[i], {
            opacity: 1, rotationY: 0, scale: 1, x: 0, z: 0,
            duration: step * 0.55,
            ease: 'power3.out',
          })
        }

        // Flip out: rotate + slide left & fade
        if (i < cards.length - 1) {
          tl.to(cards[i], {
            opacity: 0, rotationY: -45, scale: 0.8, x: -200, z: -200,
            duration: step * 0.45,
            ease: 'power2.in',
          })
        }
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${cards.length * 90}%`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        animation: tl,
      })

      // Refresh ScrollTrigger after a frame to ensure correct calculations
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionRef.current) st.kill()
      })
    }
  }, [filtered.length, activeCategory])

  return (
    <section id="projects" ref={sectionRef} className="projects">
      {/* Title & Filter */}
      <div className="projects-header">
        <div className="section-container" style={{ paddingBottom: 0 }}>
          <h2 ref={titleRef} className="section-title">
            <span className="section-number">02.</span> 项目经验
          </h2>
          <div ref={filterRef} className="filter-bar">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                className={`filter-btn ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card deck */}
      <div ref={deckRef} className="projects-deck">
        {filtered.map((project, idx) => {
          const t = cardThemes[idx % cardThemes.length]
          return (
            <article
              key={project.id}
              className="project-card"
              style={{
                '--card-primary': t.p,
                '--card-secondary': t.s,
                '--card-bg': `linear-gradient(135deg, ${t.c}, rgba(255,255,255,0.015))`,
                '--card-glow-color': `${t.p}15`,
                '--card-tag-bg': `${t.p}12`,
                '--card-border': `${t.p}30`,
              } as React.CSSProperties}
            >
              <div className="card-glow" />
              <div className="card-corner" />
              <div className="card-fade" />
              <div className="card-inner">
                <div className="card-header">
                  <span className="card-num">
                    #{String(project.id).padStart(2, '0')}
                  </span>
                  <span className="card-category">
                    {categoryLabels[project.category]}
                  </span>
                </div>
                <h3 className="card-title">{project.name}</h3>
                <p className="card-time">{project.time}</p>
                <p className="card-desc">{project.description}</p>
                <ul className="card-highlights">
                  {project.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
                <div className="card-tech">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Card position indicator */}
      <div ref={indicatorRef} className="card-indicator">
        <span className="card-indicator-text">
          {curIndex + 1} / {filtered.length}
        </span>
        <div className="card-indicator-dots">
          {filtered.map((_, i) => (
            <span
              key={i}
              className={`indicator-dot ${i === curIndex ? 'active' : ''}`}
              style={i === curIndex ? {
                backgroundColor: cardThemes[curIndex % cardThemes.length].p,
              } : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
