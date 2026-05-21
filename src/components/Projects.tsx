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
  const filterRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  // Title + filter entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from(filterRef.current?.children ?? [], {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Flipping card deck scroll animation
  useEffect(() => {
    const cards = deckRef.current?.children
    if (!cards || cards.length === 0) return

    const ctx = gsap.context(() => {
      // Initial: first card visible, rest hidden with 3D flip
      gsap.set(cards[0], { opacity: 1, rotationY: 0, scale: 1, z: 0 })
      for (let i = 1; i < cards.length; i++) {
        gsap.set(cards[i], {
          opacity: 0,
          rotationY: 25,
          scale: 0.85,
          z: -100,
        })
      }

      // Build scrub timeline
      const tl = gsap.timeline()
      const step = 1 / cards.length

      for (let i = 0; i < cards.length; i++) {
        // Flip in the current card
        if (i > 0) {
          tl.to(cards[i], {
            opacity: 1,
            rotationY: 0,
            scale: 1,
            z: 0,
            duration: step * 0.6,
            ease: 'power3.out',
          })
        }

        // Flip out the current card (except last)
        if (i < cards.length - 1) {
          tl.to(cards[i], {
            opacity: 0,
            rotationY: -25,
            scale: 0.85,
            z: -100,
            duration: step * 0.4,
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
      {/* Title & Filter (always visible) */}
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

      {/* Flipping card deck */}
      <div ref={deckRef} className="projects-deck">
        {filtered.map((project) => (
          <article key={project.id} className="project-card">
            <div className="card-glow" />
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
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
