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

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

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

  // Animate project cards when they enter viewport
  useEffect(() => {
    const cards = gridRef.current?.children
    if (!cards || cards.length === 0) return

    const ctx = gsap.context(() => {
      // Set initial hidden state
      gsap.set(cards, { y: 60, opacity: 0 })

      // Animate in when scrolled to
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          once: true,
        },
      })
    })

    return () => {
      // Clean up all GSAP animations and inline styles on unmount
      ctx.revert()
      // Kill ScrollTriggers tied to this grid
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === gridRef.current) st.kill()
      })
    }
  }, [activeCategory])

  return (
    <section id="projects" ref={sectionRef} className="projects">
      <div className="section-container">
        <h2 ref={titleRef} className="section-title">
          <span className="section-number">02.</span> 项目经验
        </h2>

        <div className="filter-bar">
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

        <div ref={gridRef} className="projects-grid">
          {filtered.map((project) => (
            <article key={project.id} className="project-card">
              <div className="card-header">
                <span className="card-num">#{String(project.id).padStart(2, '0')}</span>
                <span className="card-category">{categoryLabels[project.category]}</span>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
