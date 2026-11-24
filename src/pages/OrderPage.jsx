import { Link } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { LG } from '../components/LG'
import Watercolour from '../components/art/Watercolour'
import './OrderPage.css'

const CONTACT_EMAIL = 'hello@loveinmytummy.ca'

const COPY = {
  limt: {
    heading: "Let's make something lovely.",
    intro:
      'Everything is baked to order in small batches, with real ingredients. Tell us what you have in mind and we will send you a quote.',
    subject: 'Order request',
    steps: [
      ['Browse the menu', 'Pick your favourites, or tell us about something custom.'],
      ['Send us the details', 'What you would like, how many, and your pickup or delivery date.'],
      ['Get your quote', 'We confirm the details and send a quote, usually within 24 hours.'],
    ],
  },
  tsismis: {
    heading: 'Tell us everything.',
    intro:
      "Ube, pandan, calamansi, a whole pasalubong spread. Tell us what you're planning and we'll send a quote. We won't tell anyone. (We might.)",
    subject: 'Tsismis order request',
    steps: [
      ['Browse the goods', 'Filipino favourites first, everything else right behind.'],
      ['Send us the tea', 'What you want, how many, and when you need it.'],
      ['Get your quote', 'We reply with a quote, usually within 24 hours.'],
    ],
  },
}

export default function OrderPage() {
  const brand = useBrand()
  const copy = COPY[brand.key] ?? COPY.limt
  const paths = brandPaths(brand.key)
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(copy.subject)}`

  return (
    <div className={`order-page order-page--${brand.key}`}>
      <div className="wrap order-page__inner">
        <div className="order-page__text">
          <h1 className="display order-page__heading">{copy.heading}</h1>
          <p className="lede order-page__intro">{copy.intro}</p>

          <ol className="order-page__steps">
            {copy.steps.map(([title, desc], i) => (
              <li key={title} className="order-page__step">
                <span className="order-page__num" aria-hidden="true">{i + 1}</span>
                <div>
                  <h2 className="order-page__step-title">{title}</h2>
                  <p className="order-page__step-desc">{desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="order-page__actions">
            <a href={mailto} className="button">Email your order</a>
            <Link to={paths.menu} className="button button--quiet">See the menu</Link>
          </div>
          <p className="order-page__note">
            Or write to us directly at <a href={mailto}>{CONTACT_EMAIL}</a>.
          </p>
        </div>

        <div className="order-page__visual" aria-hidden="true">
          <Watercolour layout="story" seed={brand.key === 'tsismis' ? 17 : 15} />
          <LG pose="order" decorative className="order-page__lg" />
        </div>
      </div>
    </div>
  )
}
