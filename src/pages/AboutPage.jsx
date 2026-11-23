import { Link } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { brandContent } from '../brand/brandContent'
import Watercolour from '../components/art/Watercolour'
import { Heart, MixingBowl, Strawberry, Sun } from '../components/art/LineArt'
import './AboutPage.css'

/*
  About: celebrates Carolyn as the founder. LG is deliberately absent here
  (she's the mascot; Carolyn is the person). The portrait frame shows
  watercolour and line art until a photo is set in brandContent.about.portrait.
*/
export default function AboutPage() {
  const brand = useBrand()
  const a = brandContent(brand.key).about
  const paths = brandPaths(brand.key)
  const isTsismis = brand.key === 'tsismis'
  const icons = isTsismis ? [Sun, Heart, Strawberry] : [Heart, Strawberry, MixingBowl]

  return (
    <article className="about">
      <header className="wrap about__intro">
        <div className="about__intro-text">
          <p className={isTsismis ? 'whisper' : 'about__kicker'}>{a.kicker}</p>
          <h1 className="display about__title">{a.title}</h1>
          <p className="lede about__lede">{a.lede}</p>
        </div>

        <div className="about__portrait">
          <Watercolour layout="story" seed={isTsismis ? 21 : 19} />
          <div className="about__frame">
            {a.portrait ? (
              <img src={a.portrait} alt={a.portraitAlt} className="about__photo" />
            ) : (
              <div className="about__art" aria-hidden="true">
                <MixingBowl size={120} />
                {isTsismis ? <Sun size={64} /> : <Heart size={56} />}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="wrap about__body">
        {a.sections.map((section, i) => {
          const Icon = icons[i % icons.length]
          return (
            <section key={section.heading} className="about__section">
              <Icon size={40} className="about__icon" />
              <div>
                <h2 className="heading about__heading">{section.heading}</h2>
                {section.body.map((para) => <p key={para.slice(0, 32)}>{para}</p>)}
              </div>
            </section>
          )
        })}
      </div>

      <footer className="band band--panel about__close">
        <Watercolour layout="band" seed={isTsismis ? 23 : 25} />
        <div className="wrap about__close-inner">
          <p className="about__closing">{a.closing}</p>
          <Link to={paths.menu} className="button">{a.cta}</Link>
        </div>
      </footer>
    </article>
  )
}
