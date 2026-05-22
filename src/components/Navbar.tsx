import { useEffect, useRef, useState } from 'react'
import { gsap, initGsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { navItems } from '../data/nav'
import BlindsMenu from './effects/BlindsMenu'
import NavPreview from './effects/NavPreview'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    initGsap()
    const nav = navRef.current
    if (!nav) return

    gsap.from(nav, { y: -32, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 })

    let last = 0
    const hideSt = ScrollTrigger.create({
      onUpdate: (self) => {
        const y = self.scroll()
        if (menuOpen) return
        if (y > last && y > 100) {
          gsap.to(nav, { y: -80, opacity: 0, duration: 0.35, ease: 'power2.in' })
        } else {
          gsap.to(nav, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' })
        }
        last = y
      },
    })

    const bgSt = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = Math.min(self.progress * 8, 1)
        nav.style.background = `rgba(11, 11, 15, ${0.72 + p * 0.2})`
        nav.style.borderColor = `rgba(255, 255, 255, ${0.06 + p * 0.06})`
      },
    })

    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-42% 0px -48% 0px' },
    )
    sections.forEach((s) => observer.observe(s))

    return () => {
      hideSt.kill()
      bgSt.kill()
      observer.disconnect()
    }
  }, [menuOpen])

  const blindsLinks = [
    { label: '首页', href: '#hero', sub: 'Home' },
    ...navItems.map((n) => ({ label: n.label, href: n.href, sub: n.sub })),
  ]

  return (
    <>
      <nav ref={navRef} className="nav">
        <a href="#hero" className="nav-logo">
          <span className="nav-logo-mark">CYB</span>
          <span className="nav-logo-name">陈宇彬</span>
        </a>

        <ul className="nav-links nav-links--desktop">
          {navItems.map((item) => (
            <NavPreview
              key={item.href}
              label={item.label}
              href={item.href}
              src={item.preview}
              active={active === item.href.slice(1)}
            />
          ))}
        </ul>

        <div className="nav-actions">
          <a
            href="https://blog.csdn.net/chyb918"
            target="_blank"
            rel="noreferrer"
            className="nav-cta"
          >
            CSDN
          </a>
          <button
            type="button"
            className="nav-menu-btn"
            aria-label="打开菜单"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span className="material-sym">menu</span>
          </button>
        </div>
      </nav>

      <BlindsMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={blindsLinks}
      />
    </>
  )
}
