import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'

function MouseFollower() {
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useRef(false)

  useEffect(() => {
    isMobile.current = window.matchMedia('(hover: none)').matches
    if (isMobile.current) return

    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const handleMouse = (e: MouseEvent) => {
        gsap.to(el, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.8,
          ease: 'power3.out',
        })
      }
      window.addEventListener('mousemove', handleMouse, { passive: true })
      return () => window.removeEventListener('mousemove', handleMouse)
    })
    return () => ctx.revert()
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null
  }

  return <div ref={ref} className="mouse-follower" />
}

function App() {
  return (
    <>
      <MouseFollower />
      <ScrollProgress />
      <Navbar />
      <main>
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
