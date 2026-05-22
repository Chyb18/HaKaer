import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, initGsap } from '../lib/gsap'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initGsap()
    const bar = barRef.current
    if (!bar) return

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <div className="scroll-progress" aria-hidden>
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  )
}
