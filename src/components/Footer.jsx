import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">

          <div className="footer__about">
            <p className="footer__brand-name">Love in My Tummy</p>
            <p className="footer__brand-sub">&amp; Tsismis</p>
            <p className="footer__brand-desc">
              Handcrafted artisan bakes made to order in Toronto.
              Filipino-inspired flavours, made with love.
            </p>
            <p className="footer__sig">— LG</p>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Navigate</p>
            <ul className="footer__col-links">
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/tsismis">Tsismis</Link></li>
              <li><Link to="/shop">LG Shop</Link></li>
              <li><Link to="/story">Our Story</Link></li>
              <li><Link to="/order">Order Now</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Contact</p>
            <ul className="footer__col-links">
              <li><a href="mailto:hello@loveinmytummy.ca">hello@loveinmytummy.ca</a></li>
              <li><a href="https://instagram.com/loveinmytummy" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://facebook.com/loveinmytummy" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://loveinmytummy.ca">loveinmytummy.ca</a></li>
            </ul>
          </div>

        </div>

        <div className="footer__bottom">
          <p className="footer__legal">
            © {new Date().getFullYear()} Love in My Tummy. All rights reserved. Toronto, Ontario.
          </p>
          <div className="footer__social">
            <a href="https://instagram.com/loveinmytummy" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://facebook.com/loveinmytummy" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://tiktok.com/@loveinmytummy" target="_blank" rel="noreferrer">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
