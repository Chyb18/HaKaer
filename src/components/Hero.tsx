import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, initGsap } from '../lib/gsap'
import {
  bindHeroScrollExit,
  clipRevealUp,
  EASE_CINEMATIC,
  kenBurnsIn,
} from '../lib/gsap-cinematic'
import ScrambleText from './effects/ScrambleText'

const HERO_BG =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&auto=format&fit=crop'

const FLOAT_ICONS = ['code', 'deployed_code', 'spark', 'terminal', 'folder']

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const bgMediaRef = useRef<HTMLDivElement>(null)
  const vignetteRef = useRef<HTMLDivElement>(null)
  const aliasRevealRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      initGsap()
      const section = sectionRef.current
      if (!section) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        gsap.set('.hero-title-reveal', { clipPath: 'none' })
        gsap.set(bgMediaRef.current, { scale: 1 })
        return
      }

      // Ken Burns 开场
      if (bgMediaRef.current) {
        kenBurnsIn(bgMediaRef.current, { fromScale: 1.05, duration: 2.85 })
      }

      const intro = gsap.timeline({ defaults: { ease: EASE_CINEMATIC } })

      const titleReveal = clipRevealUp('.hero-title-reveal', { stagger: 0.16, duration: 1.2 })
      if (titleReveal) intro.add(titleReveal, 0.12)

      intro
        .from(
          '.hero-eyebrow, .hero-available',
          { y: 28, opacity: 0, duration: 0.85, stagger: 0.08 },
          0.35,
        )
        .from('.hero-desc', { y: 40, opacity: 0, duration: 0.95 }, 0.55)
        .from(
          '.hero-cta > *',
          { y: 32, opacity: 0, duration: 0.7, stagger: 0.1 },
          0.72,
        )
        .from('.hero-scroll', { opacity: 0, y: 12, duration: 0.6 }, 1.05)

      // 滚动：背景视差 + 前景变暗缩小
      bindHeroScrollExit(section, {
        inner: innerRef.current,
        bgMedia: bgMediaRef.current,
        vignette: vignetteRef.current,
        floats: '.hero-float',
      })

      gsap.utils.toArray<HTMLElement>('.hero-float').forEach((el, i) => {
        gsap.to(el, {
          y: '+=16',
          x: '+=10',
          duration: 2.6 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section id="hero" ref={sectionRef} className="hero">
      <div className="hero-bg" aria-hidden>
        <div
          ref={bgMediaRef}
          className="hero-bg-media"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="hero-bg-gradient" />
        <div ref={vignetteRef} className="hero-vignette" />
      </div>

      <div className="hero-grid" aria-hidden />

      {FLOAT_ICONS.map((icon, i) => (
        <span
          key={icon}
          className={`hero-float hero-float--${i + 1} material-sym`}
          aria-hidden
        >
          {icon}
        </span>
      ))}

      <div ref={innerRef} className="hero-inner">
        <p className="hero-eyebrow">27 届 · 闽南科技学院 · 前端开发工程师</p>
        <h1 className="hero-title">
          <span className="hero-title-row">
            <span className="hero-title-reveal hero-title-line">陈宇彬</span>
          </span>
          <span className="hero-title-row">
            <span
              ref={aliasRevealRef}
              className="hero-title-reveal hero-title-line hero-title-accent hero-title-alias"
            >
              <ScrambleText text="（哈卡尔）" duration={1.35} delay={0.95} />
            </span>
          </span>
        </h1>
        <p className="hero-desc">
          前端开发工程师，专注 Vue / React 生态，拥有 14+ 真实项目经验，
          涵盖政府级系统、跨境电商、AI 平台与小程序，志在构建优雅、高性能的 Web 应用。
        </p>
        <div className="hero-cta">
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
