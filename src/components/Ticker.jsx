import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { brandContent } from '../brand/brandContent'
import { Heart, SpeechBubble } from './art/LineArt'
import './Ticker.css'

/*
  The scrolling message ribbon under the nav, on both brands. Messages come
  from the site_messages table (one brand or both, with optional start and
  end dates for holidays and promos); the lines in brandContent are only a
  fallback if the database can't be reached. Pauses on hover or keyboard
  focus; with reduced motion it shows the messages without scrolling.
*/
export default function Ticker({ brandKey }) {
  const fallback = brandContent(brandKey).ticker.map((message) => ({ message }))
  const [items, setItems] = useState(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('site_messages')
      .select('id, message, link_url, brand_id, sort_order')
      .or(`brand_id.eq.${brandKey},brand_id.is.null`)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!cancelled) setItems(!error && data?.length ? data : fallback)
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandKey])

  const lines = items ?? fallback
  const Icon = brandKey === 'tsismis' ? SpeechBubble : Heart

  const run = (hidden) => (
    <ul className="ticker__run" aria-hidden={hidden || undefined}>
      {lines.map((item, i) => (
        <li key={`${item.id ?? i}`} className="ticker__item">
          <Icon size={18} />
          {item.link_url ? (
            item.link_url.startsWith('/') ? (
              <Link to={item.link_url} tabIndex={hidden ? -1 : undefined}>{item.message}</Link>
            ) : (
              <a href={item.link_url} tabIndex={hidden ? -1 : undefined}>{item.message}</a>
            )
          ) : (
            item.message
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={`ticker ticker--${brandKey}`}
      tabIndex={0}
      aria-label={brandKey === 'tsismis' ? 'Overheard at Tsismis' : 'News from the kitchen'}
    >
      <div className="ticker__track" style={{ '--ticker-duration': `${Math.max(30, lines.length * 10)}s` }}>
        {run(false)}
        {run(true)}
      </div>
    </div>
  )
}
