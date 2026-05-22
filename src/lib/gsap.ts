import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let initialized = false

export function initGsap() {
  if (initialized) return
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
  })
  ScrollTrigger.config({ limitCallbacks: true })
  initialized = true
}

/** 区块标题 / 文案入场 */
export function revealUp(
  targets: gsap.TweenTarget,
  trigger: Element | null,
  opts?: Partial<gsap.TweenVars> & { stagger?: number; start?: string },
) {
  if (!trigger) return
  return gsap.from(targets, {
    y: 48,
    opacity: 0,
    duration: 0.85,
    stagger: opts?.stagger ?? 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger,
      start: opts?.start ?? 'top 78%',
      toggleActions: 'play none none reverse',
    },
    ...opts,
  })
}

/** 随滚动 scrub 的视差 */
export function scrubParallax(
  target: gsap.TweenTarget,
  trigger: Element | null,
  vars: gsap.TweenVars,
  start = 'top bottom',
  end = 'bottom top',
) {
  if (!trigger) return
  return gsap.to(target, {
    ease: 'none',
    scrollTrigger: { trigger, start, end, scrub: 0.6 },
    ...vars,
  })
}

export { gsap, ScrollTrigger }
