import { brandContent } from '../brand/brandContent'
import { SpeechBubble } from './art/LineArt'
import './GossipTicker.css'

/*
  Tsismis only: a slow ribbon of gossip lines under the nav. Pauses on
  hover or keyboard focus; with reduced motion it shows the first line still.
*/
export default function GossipTicker() {
  const lines = brandContent('tsismis').ticker

  const run = (hidden) => (
    <ul className="ticker__run" aria-hidden={hidden || undefined}>
      {lines.map((line) => (
        <li key={line} className="ticker__item">
          <SpeechBubble size={18} />
          {line}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="ticker" tabIndex={0} aria-label="Overheard at Tsismis">
      <div className="ticker__track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  )
}
