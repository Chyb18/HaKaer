import { useRef } from 'react'
import gsap from 'gsap'
import { initGsap } from '../../lib/gsap'
import { scrambleText } from '../../lib/scrambleText'

interface NavPreviewProps {
  src: string
  label: string
  href: string
  active?: boolean
}

export default function NavPreview({ src, label, href, active }: NavPreviewProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const show = () => {
    initGsap()
    const preview = previewRef.current
    const link = linkRef.current
    if (!preview || !link) return

    const rect = link.getBoundingClientRect()
    preview.style.left = `${rect.left + rect.width / 2}px`
    preview.style.top = `${rect.bottom + 14}px`
    preview.style.transform = 'translateX(-50%)'

    gsap.killTweensOf(preview)
    gsap.fromTo(
      preview,
      { opacity: 0, scale: 0.88, y: 12, display: 'block' },
      { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' },
    )
  }

  const hide = () => {
    const preview = previewRef.current
    if (!preview) return
    gsap.to(preview, {
      opacity: 0,
      scale: 0.92,
      y: 8,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => { gsap.set(preview, { display: 'none' }) },
    })
  }

  const handleMouseEnter = () => {
    show()
    if (linkRef.current) {
      scrambleText(linkRef.current, label, { duration: 0.55 })
    }
  }

  return (
    <li
      className="nav-preview-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={hide}
    >
      <a
        ref={linkRef}
        href={href}
        className={active ? 'active' : ''}
      >
        {label}
      </a>
      <div ref={previewRef} className="nav-preview-popup" style={{ display: 'none' }}>
        <img src={src} alt="" loading="lazy" />
        <span className="nav-preview-caption">{label}</span>
      </div>
    </li>
  )
}
