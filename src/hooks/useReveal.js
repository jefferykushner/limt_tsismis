import { useEffect, useRef } from 'react'

/**
 * useReveal — attaches IntersectionObserver to a ref,
 * adding class "visible" when the element enters the viewport.
 *
 * Usage:
 *   const ref = useReveal()
 *   <div ref={ref} className="reveal"> ... </div>
 */
export function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px', ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

/**
 * useRevealAll — attaches observers to ALL .reveal children
 * within a container ref. Useful for grids / lists.
 *
 * Usage:
 *   const containerRef = useRevealAll()
 *   <div ref={containerRef}> <div className="reveal">...</div> </div>
 */
export function useRevealAll(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const els = container.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px', ...options }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return ref
}
