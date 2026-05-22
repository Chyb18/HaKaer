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

/** 根据滚动方向在相邻吸附点之间选择目标卡片 */
function resolveSnapIndex(progress: number, direction: number, points: number[]) {
  if (points.length <= 1) return 0

  let index = 0
  for (let i = 0; i < points.length - 1; i++) {
    const mid = (points[i] + points[i + 1]) / 2
    if (progress >= mid) index = i + 1
  }

  if (direction > 0 && index < points.length - 1) {
    const zone = (points[index + 1] - points[index]) * 0.22
    if (progress > points[index] + zone) index += 1
  } else if (direction < 0 && index > 0) {
    const zone = (points[index] - points[index - 1]) * 0.22
    if (progress < points[index] - zone) index -= 1
  }

  return gsap.utils.clamp(0, points.length - 1, index)
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const deckScrollRef = useRef<ScrollTrigger | null>(null)
  const snapPointsRef = useRef<number[]>([])
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

  const scrollToCard = (index: number) => {
    const st = deckScrollRef.current
    const points = snapPointsRef.current
    if (!st || points[index] === undefined) return

    const targetY = st.start + points[index] * (st.end - st.start)
    const proxy = { y: window.scrollY }
    gsap.to(proxy, {
      y: targetY,
      duration: 0.55,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onUpdate: () => window.scrollTo(0, proxy.y),
    })
  }

  // Flipping card deck scroll animation (snap to center, bidirectional)
  useEffect(() => {
    const cards = deckRef.current?.children
    if (!cards || cards.length === 0) return

    setCurIndex(0)
    deckScrollRef.current = null
    snapPointsRef.current = []

    const ctx = gsap.context(() => {
      const cardEase = { transformOrigin: '50% 50%', force3D: true }
      const incoming = {
        ...cardEase,
        opacity: 0,
        rotationY: 58,
        scale: 0.76,
        x: 320,
        y: 28,
        z: -380,
        filter: 'blur(8px)',
      }
      const center = {
        ...cardEase,
        opacity: 1,
        rotationY: 0,
        scale: 1,
        x: 0,
        y: 0,
        z: 0,
        filter: 'blur(0px)',
      }
      const exit = {
        ...cardEase,
        opacity: 0,
        rotationY: -58,
        scale: 0.76,
        x: -320,
        y: -20,
        z: -380,
        filter: 'blur(8px)',
      }

      gsap.set(cards, { transformOrigin: '50% 50%', force3D: true })
      gsap.set(cards[0], { ...center, zIndex: 100 })
      for (let i = 1; i < cards.length; i++) {
        gsap.set(cards[i], { ...incoming, zIndex: 10 + i })
      }

      const snapProgress: number[] = []

      const tl = gsap.timeline({
        onUpdate: () => {
          const prog = tl.progress()
          if (!snapProgress.length) return
          setCurIndex(resolveSnapIndex(prog, 0, snapProgress))
        },
      })

      const segment = 1 / cards.length
      const flipIn = segment * 0.28
      const hold = segment * 0.44
      const flipOut = segment * 0.28
      const overlap = flipOut * 0.42

      for (let i = 0; i < cards.length; i++) {
        if (i > 0) {
          tl.fromTo(
            cards[i],
            incoming,
            { ...center, duration: flipIn, ease: 'power4.out' },
            `-=${overlap}`,
          )
          tl.set(cards[i], { zIndex: 100 + i }, '<')
        }

        tl.addLabel(`card-${i}`)
        tl.to({}, { duration: hold })

        if (i < cards.length - 1) {
          tl.to(cards[i], { ...exit, duration: flipOut, ease: 'power3.in' })
          tl.set(cards[i], { zIndex: 5 + i })
        }
      }

      const duration = tl.duration()
      for (let i = 0; i < cards.length; i++) {
        const t = tl.labels[`card-${i}`] as number
        snapProgress.push(duration > 0 ? t / duration : 0)
      }
      snapPointsRef.current = snapProgress

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * cards.length * 0.85}`,
        pin: true,
        scrub: 0.45,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        animation: tl,
        snap: cards.length > 1
          ? {
              snapTo: (progress, self) => {
                const idx = resolveSnapIndex(progress, self?.direction ?? 0, snapProgress)
                return snapProgress[idx]
              },
              duration: { min: 0.28, max: 0.55 },
              delay: 0.04,
              ease: 'power3.out',
              inertia: false,
            }
          : undefined,
      })
      deckScrollRef.current = st

      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, sectionRef)

    return () => {
      deckScrollRef.current = null
      snapPointsRef.current = []
      ctx.revert()
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
              className={`project-card${idx === curIndex ? ' is-active' : ''}`}
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
            <button
              key={i}
              type="button"
              aria-label={`跳转到第 ${i + 1} 张卡片`}
              className={`indicator-dot ${i === curIndex ? 'active' : ''}`}
              style={i === curIndex ? {
                backgroundColor: cardThemes[curIndex % cardThemes.length].p,
              } : undefined}
              onClick={() => scrollToCard(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
