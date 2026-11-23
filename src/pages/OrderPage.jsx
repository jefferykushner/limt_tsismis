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
      "A birthday, a thank-you, a Tuesday that needs rescuing. Tell us what you're craving and when, and we'll bake it fresh, just for you.",
    subject: 'Order request',
    steps: [
      ['Pick your favourites', 'From the menu, or tell us about the treat you can’t stop thinking about.'],
      ['Send us the details', 'What you’d like, how many, and when you need it.'],
      ['Get your quote', 'We’ll confirm everything and send a quote, usually within a day.'],
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
