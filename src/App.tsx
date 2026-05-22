import { useEffect } from 'react'
import { ScrollTrigger, initGsap } from './lib/gsap'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import PetalTrail from './components/effects/PetalTrail'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import GeminiChat from './components/GeminiChat'

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

  return (
    <>
      <GeminiChat />
      <PetalTrail />
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
