import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { initGsap } from '../../lib/gsap'
import { scrambleText } from '../../lib/scrambleText'

export interface BlindsMenuLink {
  label: string
  href: string
  sub?: string
}

interface BlindsMenuProps {
  open: boolean
  onClose: () => void
  links: BlindsMenuLink[]
}

const BLIND_COUNT = 12

export default function BlindsMenu({ open, onClose, links }: BlindsMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const blindsRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<HTMLAnchorElement[]>([])

  useEffect(() => {
    initGsap()
    const overlay = overlayRef.current
    const blinds = blindsRef.current?.children
    const content = contentRef.current
    if (!overlay || !blinds?.length || !content) return

    if (open) {
      document.body.style.overflow = 'hidden'
      gsap.set(overlay, { display: 'flex', pointerEvents: 'auto' })
      gsap.set(content, { opacity: 0 })

      const tl = gsap.timeline({ onComplete: () => {
        linkRefs.current.forEach((el, i) => {
          if (el) scrambleText(el.querySelector('.blinds-link-text') as HTMLElement, links[i]?.label ?? '', { duration: 0.9, delay: i * 0.06 })
        })
      }})

      tl.fromTo(
        blinds,
        { scaleY: 0, transformOrigin: '50% 0%' },
        {
          scaleY: 1,
          duration: 0.55,
          stagger: { each: 0.035, from: 'start' },
          ease: 'power3.inOut',
        },
      ).to(content, { opacity: 1, duration: 0.35 }, '-=0.25')

      return () => { document.body.style.overflow = '' }
    }

    const closeTl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: 'none', pointerEvents: 'none' })
        document.body.style.overflow = ''
      },
    })

    closeTl.to(content, { opacity: 0, duration: 0.2 }).to(
      blinds,
      {
        scaleY: 0,
        transformOrigin: '50% 100%',
        duration: 0.4,
        stagger: { each: 0.03, from: 'end' },
        ease: 'power3.in',
      },
      '-=0.05',
    )

    return () => closeTl.kill()
  }, [open, links])

  return (
    <div
      ref={overlayRef}
      className="blinds-overlay"
      style={{ display: 'none' }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div ref={blindsRef} className="blinds-strips" aria-hidden>
        {Array.from({ length: BLIND_COUNT }, (_, i) => (
          <div key={i} className="blinds-strip" />
        ))}
      </div>

      <button type="button" className="blinds-close" onClick={onClose} aria-label="关闭菜单">
        <span className="material-sym">close</span>
      </button>

      <div ref={contentRef} className="blinds-content">
        <p className="blinds-eyebrow">Navigation</p>
        <nav className="blinds-nav">
          {links.map((link, i) => (
            <a
              key={link.href}
              ref={(el) => { if (el) linkRefs.current[i] = el }}
              href={link.href}
              className="blinds-nav-link"
              onClick={onClose}
            >
              <span className="blinds-link-text" />
              {link.sub && <span className="blinds-link-sub">{link.sub}</span>}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
