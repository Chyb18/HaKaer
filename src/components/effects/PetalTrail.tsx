import { useEffect, useRef } from 'react'

interface Petal {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  rotV: number
  scale: number
  life: number
  maxLife: number
}

export default function PetalTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const petalsRef = useRef<Petal[]>([])
  const mouseRef = useRef({ x: -999, y: -999 })
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (x: number, y: number) => {
      for (let i = 0; i < 2; i++) {
        petalsRef.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.2,
          vy: Math.random() * 1.5 + 0.5,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.08,
          scale: Math.random() * 0.5 + 0.5,
          life: 0,
          maxLife: 50 + Math.random() * 40,
        })
      }
      if (petalsRef.current.length > 80) {
        petalsRef.current.splice(0, petalsRef.current.length - 80)
      }
    }

    const drawPetal = (p: Petal, alpha: number) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.scale(p.scale, p.scale)
      ctx.globalAlpha = alpha

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 14)
      g.addColorStop(0, 'rgba(255, 120, 140, 0.95)')
      g.addColorStop(0.5, 'rgba(220, 60, 90, 0.7)')
      g.addColorStop(1, 'rgba(180, 30, 60, 0)')

      ctx.beginPath()
      ctx.moveTo(0, -12)
      ctx.bezierCurveTo(10, -8, 12, 4, 0, 14)
      ctx.bezierCurveTo(-12, 4, -10, -8, 0, -12)
      ctx.fillStyle = g
      ctx.fill()

      ctx.restore()
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x, y } = mouseRef.current
      if (x > 0 && y > 0) spawn(x, y)

      petalsRef.current = petalsRef.current.filter((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotV
        p.vy += 0.02
        const alpha = 1 - p.life / p.maxLife
        if (alpha > 0) drawPetal(p, alpha * 0.85)
        return p.life < p.maxLife
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onLeave = () => {
      mouseRef.current = { x: -999, y: -999 }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="petal-trail" aria-hidden />
}
