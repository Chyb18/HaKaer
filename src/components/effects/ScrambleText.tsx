import { useEffect, useRef } from 'react'
import { initGsap } from '../../lib/gsap'
import { scrambleText } from '../../lib/scrambleText'

interface ScrambleTextProps {
  text: string
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
  duration?: number
  delay?: number
  playOnMount?: boolean
}

export default function ScrambleText({
  text,
  className = '',
  as: Tag = 'span',
  duration = 1.4,
  delay = 0,
  playOnMount = true,
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!playOnMount || !ref.current) return
    initGsap()
    const tween = scrambleText(ref.current, text, { duration, delay })
    return () => { tween.kill() }
  }, [text, duration, delay, playOnMount])

  return (
    <Tag ref={ref as never} className={className}>
      {playOnMount ? '' : text}
    </Tag>
  )
}
