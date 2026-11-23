import { useBrand } from '../brand/BrandContext'
import { BrandSwitchProvider } from '../brand/BrandSwitch'
import ScrollToHash from './ScrollToHash'
import Nav from './Nav'
import Footer from './Footer'
import GossipTicker from './GossipTicker'
import '../styles/site.css'
import './art/art.css'

/* Shell for every public page: brand skin, nav, Tsismis ticker, footer. */
export default function PublicLayout({ children }) {
  const brand = useBrand()
  return (
    <BrandSwitchProvider>
      <div className="site" data-brand={brand.key}>
        <a href="#main" className="skip-link">Skip to content</a>
        <ScrollToHash />
        <Nav />
        <main id="main" className="site-main">
          {brand.key === 'tsismis' && <GossipTicker />}
          {children}
        </main>
        <Footer />
      </div>
    </BrandSwitchProvider>
  )
}
