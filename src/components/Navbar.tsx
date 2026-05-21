import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from(nav, { y: -80, opacity: 0, duration: 0.8, ease: 'power3.out' })

      // Hide/show on scroll direction
      let lastScroll = 0
      ScrollTrigger.create({
        onUpdate: (self) => {
          const st = self.scroll()
          if (st > lastScroll && st > 100) {
            gsap.to(nav, { y: -80, opacity: 0, duration: 0.3, ease: 'power2.out' })
          } else {
            gsap.to(nav, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
          }
          lastScroll = st
        },
      })

      // Background opacity based on scroll
      ScrollTrigger.create({
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          const opacity = Math.min(self.progress * 1.5, 1)
          gsap.set(nav, { background: `rgba(10, 10, 26, ${0.5 + opacity * 0.4})` })
        },
      })
    })

    return () => ctx.revert()
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
          {navLinks.map((link) => (
            <li key={link.href}>
              <button onClick={() => scrollTo(link.href)}>{link.label}</button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
