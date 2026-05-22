import gsap from 'gsap'

const CHARSET =
  '!<>-_\\/[]{}—=+*^?#@$%&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789陈宇彬哈卡尔'

export interface ScrambleOptions {
  duration?: number
  delay?: number
  charset?: string
}

/** 乱码逐渐恢复为目标文本 */
export function scrambleText(
  el: HTMLElement,
  target: string,
  opts: ScrambleOptions = {},
): gsap.core.Tween {
  const duration = opts.duration ?? 1.4
  const delay = opts.delay ?? 0
  const charset = opts.charset ?? CHARSET
  const length = target.length
  const state = { progress: 0 }

  return gsap.to(state, {
    progress: 1,
    duration,
    delay,
    ease: 'power2.inOut',
    onUpdate: () => {
      const revealed = Math.floor(state.progress * length)
      let out = ''
      for (let i = 0; i < length; i++) {
        if (i < revealed) {
          out += target[i]
        } else if (target[i] === ' ') {
          out += ' '
        } else {
          out += charset[Math.floor(Math.random() * charset.length)]
        }
      }
      el.textContent = out
    },
    onComplete: () => {
      el.textContent = target
    },
  })
}
