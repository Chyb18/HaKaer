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

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -80,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav ref={navRef} className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo" onClick={() => scrollTo('#hero')}>
          CYB<span className="logo-dot">.</span>
        </span>
        <ul className="navbar-links">
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
