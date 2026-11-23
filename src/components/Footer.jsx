import { Link } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { brandContent } from '../brand/brandContent'
import { useBrandSwitch } from '../brand/BrandSwitch'
import { Heart, Sun } from './art/LineArt'
import './Footer.css'

const CONTACT_EMAIL = 'hello@loveinmytummy.ca'
const INSTAGRAM_URL = 'https://www.instagram.com/loveinmytummysweets/'

export default function Footer() {
  const brand = useBrand()
  const content = brandContent(brand.key)
  const other = brandContent(brand.key === 'tsismis' ? 'limt' : 'tsismis')
  const paths = brandPaths(brand.key)
  const switchBrand = useBrandSwitch()
  const Mark = brand.key === 'tsismis' ? Sun : Heart

  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <img src={content.logo.full} alt={content.name} className={`footer__logo footer__logo--${brand.key}`} />
          <p className="footer__blurb">{content.footer.blurb}</p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__title">Visit</h2>
          <ul>
            <li><Link to={paths.menu}>Menu</Link></li>
            <li><Link to={paths.story}>Our story</Link></li>
            <li><Link to={paths.order}>Order</Link></li>
            <li>
              <button type="button" className="footer__switch" onClick={(e) => switchBrand(e.currentTarget)}>
                {other.name}
              </button>
            </li>
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__title">Say hello</h2>
          <ul>
            <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
            <li>
              <a href="https://www.instagram.com/loveinmytummysweets/" target="_blank" rel="noreferrer">
                Instagram @loveinmytummysweets
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                Instagram <span className="footer__handle">@loveinmytummysweets</span>
              </a>
            </li>
            <li>Pickup and delivery in Toronto</li>
          </ul>
        </div>
      </div>

      <div className="wrap footer__base">
        <Mark size={22} className="footer__mark" />
        <p>© {new Date().getFullYear()} Love in My Tummy Artisan Sweets</p>
        <Link to="/login" className="footer__login">Client login</Link>
      </div>
    </footer>
  )
}
