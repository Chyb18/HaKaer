import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initGsap, revealUp } from '../lib/gsap'
import { layoutMasonry } from '../lib/masonryLayout'
import { projects, categoryLabels } from '../data/projects'

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const layoutGenRef = useRef(0)
  const prevCategoryRef = useRef('all')
  const [category, setCategory] = useState('all')

  const filtered =
    category === 'all' ? projects : projects.filter((p) => p.category === category)

  const filteredIds = filtered.map((p) => p.id).join(',')

  const getItems = useCallback(() => {
    const grid = gridRef.current
    if (!grid) return []
    return Array.from(grid.querySelectorAll('.project-masonry-item')) as HTMLElement[]
  }, [])

  const runLayout = useCallback(
    (animate = true, attempt = 0): boolean => {
      const grid = gridRef.current
      const items = getItems()
      if (!grid || !items.length) return false

      if (grid.clientWidth <= 0 && attempt < 8) {
        requestAnimationFrame(() => runLayout(animate, attempt + 1))
        return false
      }

      layoutGenRef.current += 1
      const result = layoutMasonry(grid, items, {
        gap: 20,
        duration: animate ? 0.5 : 0,
        stagger: animate ? 0.02 : 0,
      })

      if (result.totalHeight > 0) {
        gsap.set(items, { opacity: 1 })
        requestAnimationFrame(() => ScrollTrigger.refresh())
        return true
      }

      if (attempt < 8) {
        requestAnimationFrame(() => runLayout(animate, attempt + 1))
      }
      return false
    },
    [getItems],
  )

  useEffect(() => {
    initGsap()
    const ctx = gsap.context(() => {
      revealUp(headerRef.current?.children ?? [], headerRef.current, {
        start: 'top 85%',
        stagger: 0.07,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // 首次挂载 + 分类切换：先布局再（可选）淡入
  useLayoutEffect(() => {
    const items = getItems()
    if (!items.length) return

    const categoryChanged = prevCategoryRef.current !== category
    prevCategoryRef.current = category

    gsap.set(items, { opacity: 1 })
    runLayout(false)

    const raf1 = requestAnimationFrame(() => runLayout(false))
    const raf2 = requestAnimationFrame(() => {
      requestAnimationFrame(() => runLayout(false))
    })

    let tween: gsap.core.Tween | undefined
    if (categoryChanged) {
      gsap.set(items, { opacity: 0.85 })
      tween = gsap.to(items, {
        opacity: 1,
        duration: 0.35,
        stagger: 0.025,
        ease: 'power2.out',
        onComplete: () => runLayout(true),
      })
    }

    const delayed = window.setTimeout(() => runLayout(false), 150)

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      clearTimeout(delayed)
      tween?.kill()
    }
  }, [category, filteredIds, getItems, runLayout])

  // 容器尺寸变化 & 进入视口时补布局
  useEffect(() => {
    const grid = gridRef.current
    const section = sectionRef.current
    if (!grid) return

    const ro = new ResizeObserver(() => runLayout(false))
    ro.observe(grid)

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          runLayout(false)
          requestAnimationFrame(() => runLayout(false))
        }
      },
      { threshold: 0.05 },
    )
    if (section) io.observe(section)

    const onLoad = () => runLayout(false)
    window.addEventListener('load', onLoad)

    return () => {
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('load', onLoad)
    }
  }, [runLayout])

  return (
    <section id="projects" ref={sectionRef} className="section projects">
      <div ref={headerRef} className="projects-header section-inner">
        <p className="section-eyebrow">Projects</p>
        <h2 className="section-heading">项目经验</h2>
        <p className="section-body projects-sub">
          瀑布流布局展示项目卡片 — 切换分类时自动重排
        </p>
        <div className="filter-pills">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`filter-pill ${category === key ? 'active' : ''}`}
              onClick={() => setCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="projects-masonry-hint">
          <span className="material-sym">grid_view</span>
          共 {filtered.length} 个项目
        </p>
      </div>

      <div className="section-inner projects-masonry-wrap">
        <div ref={gridRef} className="projects-masonry">
          {filtered.map((p) => (
            <article key={p.id} className="project-masonry-item ag-card">
              <div className="project-masonry-body">
                <div className="project-card-top">
                  <span className="project-id">#{String(p.id).padStart(2, '0')}</span>
                  <div className="project-badges">
                    <span className="project-cat">{categoryLabels[p.category]}</span>
                    {p.role && <span className="project-role">{p.role}</span>}
                    {p.status === 'in-progress' && (
                      <span className="project-status project-status--wip">
                        <span className="status-dot" />进行中
                      </span>
                    )}
                  </div>
                </div>
                <p className="project-time">{p.time}</p>
                <h3 className="project-name">{p.name}</h3>
                <p className="project-desc">{p.description}</p>
                <ul className="project-highlights">
                  {p.highlights.map((h, hi) => (
                    <li key={hi}>
                      <span className="material-sym">check_circle</span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="project-tech">
                  {p.techStack.map((t) => (
                    <span key={t} className="tech-chip">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
