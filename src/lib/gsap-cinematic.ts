import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const EASE_CINEMATIC = 'power4.out'
export const EASE_SCROLL = 'none'

/** 剪切路径自下而上逐行揭示 */
export function clipRevealUp(
  targets: gsap.TweenTarget,
  opts?: {
    stagger?: number
    duration?: number
    delay?: number
    ease?: string
  },
) {
  const els = gsap.utils.toArray<HTMLElement>(targets)
  if (!els.length) return

  gsap.set(els, { clipPath: 'inset(100% 0 0 0)' })
  return gsap.to(els, {
    clipPath: 'inset(0% 0 0 0)',
    duration: opts?.duration ?? 1.15,
    stagger: opts?.stagger ?? 0.14,
    delay: opts?.delay ?? 0,
    ease: opts?.ease ?? EASE_CINEMATIC,
  })
}

/** Ken Burns：缓慢从放大回到正常 */
export function kenBurnsIn(
  target: gsap.TweenTarget,
  opts?: { fromScale?: number; duration?: number },
) {
  const scale = opts?.fromScale ?? 1.05
  gsap.set(target, { scale, transformOrigin: '50% 50%' })
  return gsap.to(target, {
    scale: 1,
    duration: opts?.duration ?? 2.8,
    ease: EASE_CINEMATIC,
  })
}

/** 首屏滚动：前景缩小变暗 + 背景视差 */
export function bindHeroScrollExit(
  section: HTMLElement,
  layers: {
    inner: HTMLElement | null
    bgMedia: HTMLElement | null
    vignette: HTMLElement | null
    floats?: gsap.TweenTarget
  },
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.85,
    },
  })

  if (layers.bgMedia) {
    tl.to(
      layers.bgMedia,
      { yPercent: 22, scale: 1.12, ease: EASE_SCROLL },
      0,
    )
  }

  if (layers.vignette) {
    tl.to(layers.vignette, { opacity: 0.92, ease: EASE_SCROLL }, 0)
  }

  if (layers.inner) {
    tl.to(
      layers.inner,
      { y: 140, scale: 0.88, opacity: 0.08, ease: EASE_SCROLL },
      0,
    )
  }

  if (layers.floats) {
    gsap.to(layers.floats, {
      yPercent: -35,
      opacity: 0,
      ease: EASE_SCROLL,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.85,
      },
    })
  }

  return tl
}

/** 区块内元素视差（scrub） */
export function scrubLayerParallax(
  target: gsap.TweenTarget,
  trigger: Element,
  yPercent: number,
  scrub = 0.7,
) {
  return gsap.fromTo(
    target,
    { yPercent: -yPercent * 0.35 },
    {
      yPercent,
      ease: EASE_SCROLL,
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
      },
    },
  )
}

/** 滚动进入：剪切 + 上移 */
export function scrollClipReveal(
  targets: gsap.TweenTarget,
  trigger: Element,
  opts?: { start?: string; stagger?: number },
) {
  const els = gsap.utils.toArray<HTMLElement>(targets)
  if (!els.length) return

  gsap.set(els, { clipPath: 'inset(0 0 100% 0)', y: 48, opacity: 0 })
  return gsap.to(els, {
    clipPath: 'inset(0% 0 0 0)',
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: opts?.stagger ?? 0.1,
    ease: EASE_CINEMATIC,
    scrollTrigger: {
      trigger,
      start: opts?.start ?? 'top 82%',
      toggleActions: 'play none none reverse',
    },
  })
}

export { gsap, ScrollTrigger }
