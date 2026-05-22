import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { label: '首页', href: '#hero' },
  { label: '关于', href: '#about' },
  { label: '项目', href: '#projects' },
  { label: '技能', href: '#skills' },
  { label: '联系', href: '#contact' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const linksRef = useRef<HTMLUListElement>(null)
  const [activeSection, setActiveSection] = useState('hero')

  // Entrance + scroll hide/show (floating pill)
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const ctx = gsap.context(() => {
      gsap.from(nav, { y: -80, opacity: 0, duration: 0.8, ease: 'power3.out' })

      let lastScroll = 0
      ScrollTrigger.create({
        onUpdate: (self) => {
          const st = self.scroll()
          if (st > lastScroll && st > 100) {
            gsap.to(nav, { y: -80, opacity: 0, duration: 0.35, ease: 'power2.out' })
          } else {
            gsap.to(nav, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' })
          }
          lastScroll = st
        },
      })
    })

    return () => ctx.revert()
  }, [])

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav ref={navRef} className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo" onClick={() => scrollTo('#hero')}>
          哈卡尔<span className="logo-dot">.</span>
        </span>
        <ul ref={linksRef} className="navbar-links">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '')
            return (
              <li key={link.href}>
                <button
                  className={activeSection === sectionId ? 'nav-link-active' : ''}
                  onClick={() => scrollTo(link.href)}
                >
                  {link.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
