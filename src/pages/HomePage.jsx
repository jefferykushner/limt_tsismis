import { Link } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { brandContent } from '../brand/brandContent'
import { useBrandSwitch } from '../brand/BrandSwitch'
import Watercolour from '../components/art/Watercolour'
import { BrownieStack, MixingBowl, Strawberry, WarmBrownie, Sun, SpeechBubble } from '../components/art/LineArt'
import FeaturedProducts from '../components/FeaturedProducts'
import { LG, useHasPose } from '../components/LG'
import './HomePage.css'

const PROMISE_ICONS = { strawberry: Strawberry, bowl: MixingBowl, warm: WarmBrownie }

/*
  One home page for both brands. Layout is identical; words, colours, logo
  and LG come from the active brand. LIMT's hero arch holds the hero photo;
  Tsismis's holds LG whispering. (Phase 3 lets Carolyn change these.)
*/
export default function HomePage() {
  const brand = useBrand()
  const c = brandContent(brand.key)
  const paths = brandPaths(brand.key)
  const isTsismis = brand.key === 'tsismis'
  const heroPose = useHasPose('hero')

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero__grid">
          <div className="hero__text">
            {isTsismis && <p className="whisper hero__whisper">You didn’t hear this from me…</p>}
            <h1 id="hero-title" className="display hero__title">{c.hero.title}</h1>
            <p className="lede hero__body">{c.hero.body}</p>
            <div className="hero__actions">
              <Link to={paths.menu} className="button">{c.hero.primary}</Link>
              <Link to={paths.order} className="button button--quiet">{c.hero.secondary}</Link>
            </div>
          </div>

          <div className="hero__art">
            <Watercolour layout="hero" seed={isTsismis ? 7 : 3} />
            <div className={`hero__arch ${c.hero.image ? '' : 'hero__arch--figure'}`}>
              {c.hero.image ? (
                <img src={c.hero.image} alt={c.hero.imageAlt} className="hero__photo" fetchPriority="high" />
              ) : heroPose ? (
                <LG pose="hero" className="hero__figure" loading="eager" />
              ) : (
                <BrownieStack className="hero__drawing" />
              )}
            </div>
            {c.hero.image && <img src={c.avatar} alt="" className="hero__lg" width="132" height="132" />}
            {isTsismis && <Sun size={56} className="hero__sun" />}
          </div>
        </div>
      </section>

      {/* ── Promises ─────────────────────────────────────── */}
      <section className="promises" aria-label="How everything is made">
        <ul className="wrap promises__list">
          {c.promises.map((p) => {
            const Icon = PROMISE_ICONS[p.icon]
            return (
              <li key={p.title} className="promise">
                <Icon size={44} className="promise__icon" />
                <div>
                  <h2 className="promise__title">{p.title}</h2>
                  <p className="promise__body">{p.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <FeaturedProducts />

      {/* ── Story ────────────────────────────────────────── */}
      <section id="story" className="band band--panel story" aria-labelledby="story-title">
        <div className="wrap story__grid">
          <div className="story__art">
            <Watercolour layout="story" seed={isTsismis ? 11 : 5} />
            <LG pose="story" className="story__lg" />
          </div>
          <div className="story__text">
            <h2 id="story-title" className="heading">{c.story.title}</h2>
            {c.story.paragraphs.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
            <p className="story__sig">{c.story.signature}</p>
            <Link to={paths.about} className="text-link story__link">{c.story.link}</Link>
          </div>
        </div>
      </section>

      {isTsismis ? <GossipTags tags={c.tags} /> : <TsismisTeaser />}

      {/* ── Order ────────────────────────────────────────── */}
      <section className="band order-band" aria-labelledby="order-title">
        <Watercolour layout="band" seed={isTsismis ? 13 : 9} />
        <div className="wrap order-band__inner">
          <h2 id="order-title" className="heading">{c.order.title}</h2>
          <p className="lede">{c.order.body}</p>
          <Link to={paths.order} className="button">{c.order.button}</Link>
        </div>
      </section>
    </>
  )
}

/* LIMT only: an invitation to flip the site to Tsismis. */
function TsismisTeaser() {
  const switchBrand = useBrandSwitch()
  const t = brandContent('tsismis')
  return (
    <section className="teaser" aria-labelledby="teaser-title">
      <div className="wrap teaser__inner">
        <img src={t.avatar} alt="" className="teaser__lg" width="112" height="112" />
        <div className="teaser__text">
          <h2 id="teaser-title" className="teaser__title">Psst. There’s another side to us.</h2>
          <p>
            Tsismis is our Filipino-inspired kitchen: ube, calamansi, leche flan and a lot more attitude.
            Same kitchen, same LG.
          </p>
        </div>
        <button type="button" className="teaser__button" onClick={(e) => switchBrand(e.currentTarget)}>
          <SpeechBubble size={24} />
          Switch to Tsismis
        </button>
      </div>
    </section>
  )
}

/* Tsismis only: the gift-tag lines from the brand board, as hanging tags. */
function GossipTags({ tags }) {
  return (
    <section className="tags" aria-label="Things people are saying">
      <ul className="wrap tags__row">
        {tags.map((line) => (
          <li key={line} className="tag">
            <span className="tag__hole" aria-hidden="true" />
            <p className="tag__text">{line}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
