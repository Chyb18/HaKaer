import gsap from 'gsap'

export function getMasonryCols() {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 968) return 2
  return 3
}

export interface MasonryLayoutResult {
  totalHeight: number
}

/**
 * 瀑布流布局：使用 left/top 定位，避免与 GSAP transform 动画冲突
 */
export function layoutMasonry(
  grid: HTMLElement,
  items: HTMLElement[],
  opts?: { gap?: number; duration?: number; stagger?: number },
): MasonryLayoutResult {
  if (!items.length) {
    gsap.set(grid, { height: 0 })
    return { totalHeight: 0 }
  }

  const gap = opts?.gap ?? 20
  const duration = opts?.duration ?? 0.65
  const stagger = opts?.stagger ?? 0.04
  const cols = getMasonryCols()
  const gridWidth = grid.clientWidth

  if (gridWidth <= 0) {
    gsap.set(items, { opacity: 1 })
    return { totalHeight: 0 }
  }

  const colWidth = (gridWidth - gap * (cols - 1)) / cols
  const colHeights = new Array(cols).fill(0)
  const positions: { x: number; y: number; w: number; h: number }[] = []

  // 先统一宽度并清除 transform，再测量真实高度
  items.forEach((item) => {
    gsap.killTweensOf(item)
    gsap.set(item, {
      position: 'absolute',
      left: 0,
      top: 0,
      width: colWidth,
      x: 0,
      y: 0,
      scale: 1,
      clearProps: 'transform',
    })
  })

  // 强制回流，确保 offsetHeight 准确
  void grid.offsetHeight

  items.forEach((item) => {
    const h = Math.max(item.offsetHeight, 120)
    const col = colHeights.indexOf(Math.min(...colHeights))
    const x = col * (colWidth + gap)
    const y = colHeights[col]
    positions.push({ x, y, w: colWidth, h })
    colHeights[col] += h + gap
  })

  const totalH = Math.max(...colHeights, 0)

  if (duration <= 0) {
    items.forEach((item, i) => {
      gsap.set(item, {
        left: positions[i].x,
        top: positions[i].y,
        width: positions[i].w,
      })
    })
    gsap.set(grid, { height: totalH })
  } else {
    items.forEach((item, i) => {
      gsap.to(item, {
        left: positions[i].x,
        top: positions[i].y,
        width: positions[i].w,
        duration,
        ease: 'power3.out',
        delay: i * stagger,
        overwrite: 'auto',
      })
    })
    gsap.to(grid, {
      height: totalH,
      duration,
      ease: 'power3.out',
    })
  }

  return { totalHeight: totalH }
}
