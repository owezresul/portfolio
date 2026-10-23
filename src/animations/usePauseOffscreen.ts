import { useEffect } from 'react'

/** Marks project cards that are on screen, so off-screen ones can pause
 *  their idle animations (see [data-in-view] in index.css). */
export function usePauseOffscreen() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('[data-project-card]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) (e.target as HTMLElement).dataset.inView = ''
          else delete (e.target as HTMLElement).dataset.inView
        }
      },
      { rootMargin: '100px 0px' },
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])
}
