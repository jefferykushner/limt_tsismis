import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { brandContent } from '../brand/brandContent'
import { BrandSwitchButton } from '../brand/BrandSwitch'
import './Nav.css'

export default function Nav() {
  const brand = useBrand()
  const content = brandContent(brand.key)
  const paths = brandPaths(brand.key)
  const { pathname, hash } = useLocation()
  const [open, setOpen] = useState(false)

  // Close the mobile menu whenever the page changes.
  useEffect(() => setOpen(false), [pathname, hash])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = (
    <>
      <li><NavLink to={paths.menu}>Menu</NavLink></li>
      <li><NavLink to={paths.about}>Our story</NavLink></li>
      <li><NavLink to={paths.order}>Order</NavLink></li>
    </>
  )

  return (
    <header className={`nav ${open ? 'is-open' : ''}`}>
      <div className="nav__bar">
        <Link to={paths.home} className="nav__logo" aria-label={`${content.name}, home`}>
          <img src={content.logo.nav} alt="" className={`nav__logo-img nav__logo-img--${brand.key}`} />
        </Link>

        <nav aria-label="Main">
          <ul className="nav__links">{links}</ul>
        </nav>

        <div className="nav__actions">
          <BrandSwitchButton className="nav__switch" />
          <Link to={paths.order} className="button nav__order">Order now</Link>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="nav__toggle-bars" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="nav-sheet" className="nav__sheet" hidden={!open}>
        <ul className="nav__sheet-links">{links}</ul>
        <BrandSwitchButton className="nav__sheet-switch" />
      </div>
    </header>
  )
}
