import { Link } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import './Nav.css'

export default function Nav() {
  const brand = useBrand()
  const isTsismis = brand.key === 'tsismis'
  const paths = brandPaths(brand.key)

  return (
    <nav className={`nav ${isTsismis ? 'nav--tsismis' : ''}`} aria-label="Site navigation">
      <Link to={paths.home} className="nav__brand">
        {brand.label}
      </Link>

      <ul className="nav__links">
        <li><Link to={paths.menu}>Menu</Link></li>
        <li><Link to={paths.story}>Our Story</Link></li>
        {isTsismis ? (
          <li><Link to="/" className="nav__link--limt">Love in My Tummy</Link></li>
        ) : (
          <li><Link to="/tsismis" className="nav__link--tsismis">Tsismis ✦</Link></li>
        )}
      </ul>

      <Link to={paths.order} className={`btn nav__order ${isTsismis ? 'btn--ube' : 'btn--blush'}`}>
        Order Now
      </Link>
    </nav>
  )
}
