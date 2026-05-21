import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from(titleRef.current, { y: 80, opacity: 0, duration: 1 })
      .from(subtitleRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.4')
      .from(descRef.current, { y: 30, opacity: 0, duration: 0.8 }, '-=0.4')
      .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
  }, [])

  // Parallax fade on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.95,
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

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(100, 180, 255, ${0.08 * (1 - dist / 150)})`
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
          陈宇彬
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          <span className="typed-text">Frontend Developer</span>
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
