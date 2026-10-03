import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLayoutEffect } from 'react'
import { animations as A } from './config'

gsap.registerPlugin(ScrollTrigger)

const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel))

/**
 * All page animations live here. Each block checks its switch in config.ts.
 * Everything is skipped when the visitor prefers reduced motion.
 */
export function useAnimations() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cleanups: (() => void)[] = []
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

      // ── Smooth scroll ──────────────────────────────────────────────
      if (A.smoothScroll) {
        const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.1 })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        cleanups.push(() => {
          gsap.ticker.remove(tick)
          lenis.destroy()
        })
      }

      // ── Hero intro ─────────────────────────────────────────────────
      if (A.heroIntro) {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-hero-card]', { opacity: 0, y: 40, scale: 0.97, duration: 0.8, stagger: 0.1 })
          .from('[data-hero-label]', { opacity: 0, y: 10, duration: 0.5 }, '-=0.6')
          .from('[data-hero-title] [data-rise]', { yPercent: 110, duration: 0.8, stagger: 0.06 }, '-=0.4')
          .from('[data-hero-text]', { opacity: 0, y: 16, duration: 0.6 }, '-=0.5')
          .from('[data-hero-cta]', { opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out(2)' }, '-=0.3')
          .from('[data-hero-pill]', { opacity: 0, y: 10, duration: 0.4, stagger: 0.08 }, '-=0.25')
      }

      // ── Photo card tilt (content tilts, card stays put) ────────────
      if (A.photoTilt && finePointer) {
        for (const area of q('[data-tilt-area]')) {
          const inner = area.querySelector<HTMLElement>('[data-tilt-inner]')
          if (!inner) continue
          gsap.set(inner, { transformPerspective: 800 })
          const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.6, ease: 'power3' })
          const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.6, ease: 'power3' })
          const tx = gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3' })
          const ty = gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3' })
          const move = (e: PointerEvent) => {
            const r = area.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width - 0.5
            const py = (e.clientY - r.top) / r.height - 0.5
            ry(px * 18)
            rx(-py * 18)
            tx(px * 24)
            ty(py * 24)
          }
          const leave = () => [rx, ry, tx, ty].forEach((fn) => fn(0))
          area.addEventListener('pointermove', move)
          area.addEventListener('pointerleave', leave)
          cleanups.push(() => {
            area.removeEventListener('pointermove', move)
            area.removeEventListener('pointerleave', leave)
          })
        }
      }

      // ── LED dot dividers ───────────────────────────────────────────
      if (A.ledDots) {
        let alive = true
        const lit: HTMLElement[] = []
        const twinkle = () => {
          if (!alive) return
          if (lit.length) {
            const dot = lit[Math.floor(Math.random() * lit.length)]
            gsap.to(dot, { opacity: 0.25, duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' })
          }
          gsap.delayedCall(gsap.utils.random(0.25, 0.8), twinkle)
        }
        for (const row of q('[data-dots]')) {
          const dots = q('[data-dot]', row)
          gsap.set(dots, { opacity: 0.15 })
          gsap.to(dots, {
            opacity: 1,
            duration: 0.25,
            stagger: 0.035,
            ease: 'power1.out',
            scrollTrigger: { trigger: row, start: 'top 92%', once: true },
            onComplete: () => lit.push(...dots),
          })
        }
        twinkle()
        cleanups.push(() => (alive = false))
      }

      // ── Section titles rise letter by letter ───────────────────────
      if (A.titleReveal) {
        for (const title of q('[data-title-reveal]')) {
          gsap.from(q('[data-char]', title), {
            yPercent: 110,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.04,
            scrollTrigger: { trigger: title, start: 'top 88%', once: true },
          })
        }
      }

      // ── Project cards ──────────────────────────────────────────────
      if (A.projectCards) {
        const cards = q('[data-project-card]')
        gsap.set(cards, { opacity: 0, y: 60 })
        ScrollTrigger.batch(cards, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }),
        })
      }

      // ── Skill cards + tags ─────────────────────────────────────────
      if (A.skillTags) {
        for (const card of q('[data-skill-card]')) {
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: 'top 85%', once: true } })
            .from(card, { opacity: 0, y: 50, duration: 0.8, ease: 'power3.out' })
            .from(
              q('[data-skill-tag]', card),
              { opacity: 0, scale: 0.6, y: 8, duration: 0.35, ease: 'back.out(2.5)', stagger: 0.04 },
              '-=0.35',
            )
        }
      }

      // ── Magnetic contact links ─────────────────────────────────────
      if (A.magneticIcons && finePointer) {
        for (const el of q('[data-magnetic]')) {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
          const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            xTo((e.clientX - (r.left + r.width / 2)) * 0.35)
            yTo((e.clientY - (r.top + r.height / 2)) * 0.5)
          }
          const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: true })
          el.addEventListener('pointermove', move)
          el.addEventListener('pointerleave', leave)
          cleanups.push(() => {
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
          })
        }
      }

      // Fonts change text sizes → recalc trigger positions once loaded
      document.fonts?.ready.then(() => ScrollTrigger.refresh())

      return () => cleanups.forEach((fn) => fn())
    })

    return () => mm.revert()
  }, [])
}
