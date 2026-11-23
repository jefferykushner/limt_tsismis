import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Makes in-page links like "/#story" work with client-side routing:
 * scrolls to the element named in the hash after navigation, and to the
 * top of the page on a normal page change. Retries briefly because some
 * sections render only after their data loads.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = decodeURIComponent(hash.slice(1))
    let tries = 0
    let timer
    const attempt = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (tries++ < 20) {
        timer = setTimeout(attempt, 100)
      }
    }
    attempt()
    return () => clearTimeout(timer)
  }, [pathname, hash])

  return null
}
