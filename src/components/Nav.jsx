import { Link, useLocation } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import './Nav.css'

export default function Nav() {
  const { pathname } = useLocation()
  const brand = useBrand()
  const isTsismis = pathname.startsWith('/tsismis')

  return (
    <nav className={`nav ${isTsismis ? 'nav--tsismis' : ''}`} aria-label="Site navigation">
      <Link to={isTsismis ? '/tsismis' : '/'} className="nav__brand">
        {brand.label}
      </Link>

      <ul className="nav__links">
        <li><Link to={isTsismis ? '/tsismis/menu' : '/menu'}>Menu</Link></li>
        <li><Link to="/story">Our Story</Link></li>
        {isTsismis ? (
          <li><Link to="/" className="nav__link--limt">Love in My Tummy</Link></li>
        ) : (
          <li><Link to="/tsismis" className="nav__link--tsismis">Tsismis ✦</Link></li>
        )}
        <li><Link to="/shop">LG Shop</Link></li>
      </ul>

      <Link to="/order" className={`btn nav__order ${isTsismis ? 'btn--ube' : 'btn--blush'}`}>
        Order Now
      </Link>
    </nav>
  )
}
