import { useEffect, useRef } from 'react'
import { gsap, initGsap, revealUp } from '../lib/gsap'

export default function Footer() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    initGsap()
    const ctx = gsap.context(() => {
      revealUp(ref.current?.children ?? [], ref.current, { start: 'top 95%', y: 20 })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={ref} className="footer">
      <p>© {new Date().getFullYear()} 陈宇彬 · Frontend Developer</p>
      <a href="https://blog.csdn.net/chyb918" target="_blank" rel="noreferrer">
        CSDN
      </a>
    </footer>
  )
}
