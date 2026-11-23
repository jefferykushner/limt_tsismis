import { Link } from 'react-router-dom'
import { useBrand } from '../brand/BrandContext'
import { brandPaths } from '../brand/brandPaths'
import { LG } from '../components/LG'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const brand = useBrand()
  const paths = brandPaths(brand.key)
  const isTsismis = brand.key === 'tsismis'

  return (
    <main className="not-found">
      <LG pose="empty" className="not-found__lg" />
      <h1 className="not-found__heading">
        {isTsismis ? <>Hmm. Nobody's talking about <em>this</em> page.</> : <>This page isn't on the <em>menu.</em></>}
      </h1>
      <p className="not-found__body">
        {isTsismis
          ? "Either it never existed, or someone's keeping it a secret."
          : 'It may have moved, or the link may be mistyped.'}
      </p>
      <div className="not-found__actions">
        <Link to={paths.home} className={`btn ${isTsismis ? 'btn--ube' : 'btn--blush'}`}>Go Home</Link>
        <Link to={paths.menu} className="btn btn--outline">See the Menu</Link>
      </div>
    </main>
  )
}
