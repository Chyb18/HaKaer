import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const COLORS = [
  '99, 102, 241',
  '139, 92, 246',
  '6, 182, 212',
  '129, 140, 248',
  '52, 211, 153',
]

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; alpha: number
  color: string
  origSize: number
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  // ---- Entrance animation with text split ----
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Title characters stagger
    const chars = titleRef.current?.children
    if (chars?.length) {
      tl.from(chars, {
        y: 100, opacity: 0, rotateX: -40,
        duration: 1, stagger: 0.1,
        ease: 'power4.out',
      })
    }

    tl.from(subtitleRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.3')
      .from(descRef.current, { y: 30, opacity: 0, duration: 0.8 }, '-=0.4')
      .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
  }, [])

  // ---- Parallax fade on scroll ----
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: 100, opacity: 0, scale: 0.92,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // ---- Mouse tracking ----
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  // ---- Enhanced particle system ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: Particle[] = []
    const PARTICLE_COUNT = 130
    const CONNECTION_DIST = 160

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const size = Math.random() * 3.5 + 0.5
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size,
        origSize: size,
        alpha: Math.random() * 0.5 + 0.15,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }

    const animate = () => {
      const w = canvas.width
      const h = canvas.height
      const mx = mouseRef.current.x * w
      const my = mouseRef.current.y * h

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse interaction — gentle attraction
        const dx = mx - p.x
        const dy = my - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          const force = (1 - dist / 200) * 0.15
          p.vx += dx * force * 0.01
          p.vy += dy * force * 0.01
        }

        // Damping
        p.vx *= 0.995
        p.vy *= 0.995

        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`
        ctx.fill()

        // Glow for larger particles
        if (p.size > 2.5) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.12})`
          ctx.fill()
        }
      }

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = dx * dx + dy * dy
          if (dist < CONNECTION_DIST * CONNECTION_DIST) {
            const alpha = 0.06 * (1 - Math.sqrt(dist) / CONNECTION_DIST)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section id="hero" ref={containerRef} className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-overlay" />
      <div className="hero-overlay-grid" />
      <div ref={contentRef} className="hero-content">
        <div className="hero-badge">
          27 届毕业生 · 前端开发
        </div>
        <h1 ref={titleRef} className="hero-title">
          {'陈宇彬'.split('').map((char, i) => (
            <span key={i} className="hero-title-char">{char}</span>
          ))}
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          Frontend Developer
        </p>
        <p ref={descRef} className="hero-desc">
          热爱构建优雅、高性能的 Web 应用。拥有 14+ 个项目经验，
          <br />
          涵盖政府级系统、跨境电商、AI 平台等多个领域。
        </p>
        <div ref={ctaRef} className="hero-cta">
          <button className="btn-primary" onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}>
            查看项目
          </button>
          <button className="btn-outline" onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
            联系我
          </button>
        </div>
      </div>
      <div className="scroll-indicator">
        <span className="scroll-text">Scroll</span>
        <div className="scroll-mouse">
          <div className="scroll-dot" />
        </div>
      </div>
    </section>
  )
}
