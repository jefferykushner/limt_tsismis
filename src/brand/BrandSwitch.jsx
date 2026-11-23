import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { counterpartPath, rememberBrandChoice, useBrand } from './BrandContext'
import { brandContent } from './brandContent'
import './brand-switch.css'

/*
  The brand switch. Clicking it:
   1. spreads a circle of the target brand's colour out from the button,
   2. swaps to the same page in the other brand while the screen is covered
      (same scroll position, no jump to the top),
   3. fades the circle away to reveal the re-skinned page.
  With reduced motion, it is a quick cross-fade instead.
*/

const SwitchContext = createContext(() => {})

const COVER_MS = 420
const REVEAL_MS = 380

export function BrandSwitchProvider({ children }) {
  const brand = useBrand()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [wipe, setWipe] = useState(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const switchBrand = useCallback(
    (originEl) => {
      if (wipe) return
      const to = brand.key === 'tsismis' ? 'limt' : 'tsismis'
      const target = counterpartPath(pathname, brand.key)
      rememberBrandChoice(to)

      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      const rect = originEl?.getBoundingClientRect?.()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const y = rect ? rect.top + rect.height / 2 : 0

      setWipe({ to, x, y, phase: 'cover', reduce })
      timers.current.push(
        setTimeout(() => {
          navigate(target, { state: { brandSwitch: true }, preventScrollReset: true })
          setWipe((w) => w && { ...w, phase: 'reveal' })
        }, reduce ? 120 : COVER_MS),
        setTimeout(() => setWipe(null), (reduce ? 120 : COVER_MS) + REVEAL_MS)
      )
    },
    [brand.key, navigate, pathname, wipe]
  )

  return (
    <SwitchContext.Provider value={switchBrand}>
      {children}
      {wipe && (
        <div
          className={`brand-wipe brand-wipe--${wipe.to} is-${wipe.phase} ${wipe.reduce ? 'is-reduced' : ''}`}
          style={{ '--x': `${wipe.x}px`, '--y': `${wipe.y}px` }}
          aria-hidden="true"
        >
          <span className="brand-wipe__word">
            {wipe.to === 'tsismis' ? 'Psst…' : 'Welcome back'}
          </span>
        </div>
      )}
      <p className="visually-hidden" role="status" aria-live="polite">
        {wipe?.phase === 'reveal' ? `Switched to ${brandContent(wipe.to).name}` : ''}
      </p>
    </SwitchContext.Provider>
  )
}

export function useBrandSwitch() {
  return useContext(SwitchContext)
}

/** The pill in the nav: tiny LG of the brand you're switching TO, plus its name. */
export function BrandSwitchButton({ className = '' }) {
  const brand = useBrand()
  const switchBrand = useBrandSwitch()
  const here = brandContent(brand.key)
  const there = brandContent(brand.key === 'tsismis' ? 'limt' : 'tsismis')

  return (
    <button
      type="button"
      className={`brand-switch brand-switch--to-${brand.key === 'tsismis' ? 'limt' : 'tsismis'} ${className}`}
      onClick={(e) => switchBrand(e.currentTarget)}
      title={here.switchTitle}
    >
      <img src={there.avatar} alt="" className="brand-switch__lg" width="30" height="30" />
      <span className="brand-switch__label">{here.switchLabel}</span>
    </button>
  )
}
