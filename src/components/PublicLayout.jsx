import { useBrand } from '../brand/BrandContext'
import { BrandSwitchProvider } from '../brand/BrandSwitch'
import ScrollToHash from './ScrollToHash'
import Nav from './Nav'
import Footer from './Footer'
import Ticker from './Ticker'
import '../styles/site.css'
import './art/art.css'

/* Shell for every public page: brand skin, nav, message ticker, footer. */
export default function PublicLayout({ children }) {
  const brand = useBrand()
  return (
    <BrandSwitchProvider>
      <div className="site" data-brand={brand.key}>
        <a href="#main" className="skip-link">Skip to content</a>
        <ScrollToHash />
        <Nav />
        <main id="main" className="site-main">
          <Ticker brandKey={brand.key} />
          {children}
        </main>
        <Footer />
      </div>
    </BrandSwitchProvider>
  )
}
