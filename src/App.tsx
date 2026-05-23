import { useEffect } from 'react'
import { ScrollTrigger, initGsap, gsap } from './lib/gsap'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import PetalTrail from './components/effects/PetalTrail'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    initGsap()
    const refresh = () => ScrollTrigger.refresh()
    requestAnimationFrame(refresh)
    const t = setTimeout(refresh, 600)
    window.addEventListener('load', refresh)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
    }
  }, [])

  // 聚光灯鼠标坐标追踪，通过 CSS 变量高性能更新
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.ag-card')
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const htmlCard = card as HTMLElement
        htmlCard.style.setProperty('--mouse-x', `${x}px`)
        htmlCard.style.setProperty('--mouse-y', `${y}px`)
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // 环境光晕流体漂浮动效
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const t1 = gsap.to('.ambient-glow--1', {
      x: '+=60',
      y: '+=80',
      duration: 16,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    const t2 = gsap.to('.ambient-glow--2', {
      x: '-=70',
      y: '+=50',
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    const t3 = gsap.to('.ambient-glow--3', {
      x: '+=50',
      y: '-=60',
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    return () => {
      t1.kill()
      t2.kill()
      t3.kill()
    }
  }, [])

  return (
    <>
      <PetalTrail />
      <ScrollProgress />
      <Navbar />
      
      {/* 奢华科技感背景流体光晕 */}
      <div className="ambient-glows-container" style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="ambient-glow ambient-glow--1" />
        <div className="ambient-glow ambient-glow--2" />
        <div className="ambient-glow ambient-glow--3" />
      </div>

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App

