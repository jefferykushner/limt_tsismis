import { Link } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { LG } from '../components/LG'
import './OrderPage.css'

const CONTACT_EMAIL = 'hello@loveinmytummy.ca'

const COPY = {
  limt: {
    eyebrow: 'Place an Order',
    heading: <>Let's make something <em>lovely.</em></>,
    intro:
      'Everything is baked to order in small batches, with real ingredients. Tell us what you have in mind and we will send you a quote.',
    subject: 'Order request',
    button: 'btn--blush',
    steps: [
      ['Browse the menu', 'Pick your favourites, or tell us about something custom.'],
      ['Send us the details', 'What you would like, how many, and your pickup or delivery date.'],
      ['Get your quote', 'We confirm the details and send a quote, usually within 24 hours.'],
    ],
  },
  tsismis: {
    eyebrow: 'Spill Your Order',
    heading: <>Tell us <em>everything.</em></>,
    intro:
      "Ube, pandan, calamansi, a whole pasalubong spread. Tell us what you're planning and we'll send a quote. We won't tell anyone. (We might.)",
    subject: 'Tsismis order request',
    button: 'btn--ube',
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
    <main className={`order-page order-page--${brand.key}`}>
      <div className="container order-page__inner">
        <div className="order-page__text">
          <p className="order-page__eyebrow">{copy.eyebrow}</p>
          <h1 className="order-page__heading">{copy.heading}</h1>
          <p className="order-page__intro">{copy.intro}</p>

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
            <a href={mailto} className={`btn ${copy.button}`}>Email Your Order</a>
            <Link to={paths.menu} className="btn btn--outline">See the Menu</Link>
          </div>
          <p className="order-page__note">
            Or write to us directly at <a href={mailto}>{CONTACT_EMAIL}</a>.
          </p>
        </div>

        <div className="order-page__visual" aria-hidden="true">
          <LG pose="orderConfirmed" className="order-page__lg" />
        </div>
      </div>
    </main>
  )
}
