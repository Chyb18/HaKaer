import { useEffect, useRef } from 'react'
import { gsap, initGsap, scrubParallax } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrambleText from './effects/ScrambleText'

const FLOAT_ICONS = ['code', 'deploy', 'spark', 'terminal', 'folder']

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initGsap()
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(line1Ref.current, {
        y: 100,
        opacity: 0,
        rotationX: -40,
        transformOrigin: '50% 100%',
        duration: 1.1,
      })
        .from('.hero-eyebrow, .hero-available', { y: 24, opacity: 0, duration: 0.7 }, '-=0.5')
        .from(descRef.current, { y: 36, opacity: 0, duration: 0.85 }, '-=0.45')
        .from(ctaRef.current?.children ?? [], {
          y: 28,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
        }, '-=0.4')

      gsap.to(orbRef.current, {
        scale: 1.1,
        opacity: 0.9,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.utils.toArray<HTMLElement>('.hero-float').forEach((el, i) => {
        gsap.to(el, {
          y: '+=18',
          x: '+=12',
          duration: 2.8 + i * 0.35,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })

      const section = sectionRef.current
      if (section) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress
            gsap.set(innerRef.current, {
              y: p * 120,
              opacity: 1 - p * 0.85,
              scale: 1 - p * 0.06,
            })
            gsap.set(orbRef.current, { y: p * 80, scale: 1 + p * 0.15 })
            gsap.set(gridRef.current, { y: p * 40 })
          },
        })
        scrubParallax('.hero-float', section, { y: -80 }, 'top bottom', 'bottom top')
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="hero">
      <div ref={gridRef} className="hero-grid" aria-hidden />
      <div ref={orbRef} className="hero-orb" aria-hidden />

      {FLOAT_ICONS.map((icon, i) => (
        <span
          key={icon}
          className={`hero-float hero-float--${i + 1} material-sym`}
          aria-hidden
        >
          {icon === 'code' && 'code'}
          {icon === 'deploy' && 'deployed_code'}
          {icon === 'spark' && 'spark'}
          {icon === 'terminal' && 'terminal'}
          {icon === 'folder' && 'folder'}
        </span>
      ))}

      <div ref={innerRef} className="hero-inner">
        <p className="hero-eyebrow">27 届 · 闽南科技学院 · 前端开发工程师</p>
        <h1 className="hero-title">
          <span ref={line1Ref} className="hero-title-line">陈宇彬</span>
          <span className="hero-title-line hero-title-accent hero-title-alias">
            <ScrambleText text="（哈卡尔）" duration={1.4} delay={0.45} />
          </span>
        </h1>
        <p ref={descRef} className="hero-desc">
          前端开发工程师，专注 Vue / React 生态，拥有 14+ 真实项目经验，
          涵盖政府级系统、跨境电商、AI 平台与小程序，志在构建优雅、高性能的 Web 应用。
        </p>
        <div ref={ctaRef} className="hero-cta">
          <a href="#projects" className="btn-ag btn-ag--primary">
            <span className="material-sym">play_arrow</span>
            查看项目
          </a>
          <a
            href="https://blog.csdn.net/chyb918"
            target="_blank"
            rel="noreferrer"
            className="btn-ag btn-ag--ghost"
          >
            访问 CSDN
          </a>
        </div>
        <p className="hero-available">
          <span className="hero-available-dot" />
          开放 2027 届前端岗位机会
        </p>
      </div>

      <a href="#about" className="hero-scroll" aria-label="向下滚动">
        <span className="material-sym">keyboard_arrow_down</span>
      </a>
    </section>
  )
}
