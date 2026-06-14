import { Link, useLocation } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
  const { pathname } = useLocation()
  const isTsismis = pathname.startsWith('/tsismis')

  return (
    <nav className={`nav ${isTsismis ? 'nav--tsismis' : ''}`} aria-label="Site navigation">
      <Link to="/" className="nav__brand">
        Love in My Tummy
      </Link>

      <ul className="nav__links">
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/story">Our Story</Link></li>
        <li><Link to="/tsismis" className="nav__link--tsismis">Tsismis ✦</Link></li>
        <li><Link to="/shop">LG Shop</Link></li>
      </ul>

      <Link to="/order" className="btn btn--blush nav__order">
        Order Now
      </Link>
    </nav>
  )
}
