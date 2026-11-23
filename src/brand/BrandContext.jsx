import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const BRANDS = {
  limt: { key: 'limt', label: 'Love in My Tummy', path: '/' },
  tsismis: { key: 'tsismis', label: 'Tsismis', path: '/tsismis' },
}

const CHOICE_KEY = 'limt:brandChoice'
const BrandContext = createContext(BRANDS.limt)

/** The same page in the other brand: /menu <-> /tsismis/menu, / <-> /tsismis */
export function counterpartPath(pathname, fromKey) {
  if (fromKey === 'tsismis') {
    return pathname.replace(/^\/tsismis(?=\/|$)/, '') || '/'
  }
  return pathname === '/' ? '/tsismis' : `/tsismis${pathname}`
}

/** Remember an explicit choice made with the brand switch. */
export function rememberBrandChoice(key) {
  try {
    window.localStorage.setItem(CHOICE_KEY, key)
  } catch {
    // storage unavailable (private browsing etc.): the switch still works, it just isn't remembered
  }
}

function readBrandChoice() {
  try {
    return window.localStorage.getItem(CHOICE_KEY)
  } catch {
    return null
  }
}

/**
 * Resolves the active brand from the URL (/tsismis prefix = Tsismis) and
 * sets data-brand on <html>. On the very first page load only, a visitor who
 * last chose Tsismis with the switch and lands on "/" is sent to /tsismis.
 * Links shared directly to either brand always open that brand.
 */
export function BrandProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const firstLoad = useRef(true)

  const brand = useMemo(
    () => (/^\/tsismis(\/|$)/.test(location.pathname) ? BRANDS.tsismis : BRANDS.limt),
    [location.pathname]
  )

  useEffect(() => {
    if (!firstLoad.current) return
    firstLoad.current = false
    if (location.pathname === '/' && !location.hash && readBrandChoice() === 'tsismis') {
      navigate('/tsismis', { replace: true })
    }
  }, [location.pathname, location.hash, navigate])

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brand.key)
  }, [brand.key])

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

export function useBrand() {
  return useContext(BrandContext)
}
