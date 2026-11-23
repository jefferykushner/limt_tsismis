/*
  Minimalist single-weight line drawings. They inherit `currentColor`, so
  they pick up whatever text colour surrounds them. Purely decorative:
  hidden from screen readers.
*/

function Svg({ size = 48, viewBox = '0 0 48 48', className = '', children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={`line-art ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function Strawberry(props) {
  return (
    <Svg {...props}>
      <path d="M24 42c-9-5-13.5-14-12-22 1.3-6 7.5-7.6 12-4.6 4.5-3 10.7-1.4 12 4.6 1.5 8-3 17-12 22z" />
      <path d="M16.5 16.5 20 11.5l4 3.6 4-3.6 3.5 5" />
      <path d="M24 15V7.5" />
      <path d="M19 23.5v1.2M28.5 22.5v1.2M23.5 29v1.2M18.5 31v1.2M29.5 30v1.2M24 36v1.2" />
    </Svg>
  )
}

export function MixingBowl(props) {
  return (
    <Svg {...props}>
      <path d="M7 25h34c0 8.5-7.6 14.5-17 14.5S7 33.5 7 25z" />
      <path d="M18 39.5h12" />
      <path d="M29 25 39.5 8.5" />
      <path d="M27.5 24.5c-3.5-6.5 0-12.5 5.5-11 3.3 3.6.8 9.3-5.5 11z" />
      <path d="M29.5 23.5c-1-4.7 1.7-7.6 4.4-7" />
    </Svg>
  )
}

export function WarmBrownie(props) {
  return (
    <Svg {...props}>
      <rect x="9" y="25" width="30" height="13" rx="2" />
      <path d="M9 29.5c5-2 9 1.5 14.5-1 4.5-2 8.5 1.5 15.5-.5" />
      <path d="M17.5 20.5c-2.2-3 1.8-4.6 0-8.5M24 20.5c-2.2-3 1.8-4.6 0-8.5M30.5 20.5c-2.2-3 1.8-4.6 0-8.5" />
    </Svg>
  )
}

export function Cookie(props) {
  return (
    <Svg {...props}>
      <path d="M38.5 26.5A14.5 14.5 0 1 1 21.5 9.7a5 5 0 0 0 6.3 6.3 5 5 0 0 0 6.2 6.2 4.6 4.6 0 0 0 4.5 4.3z" />
      <path d="M17 20.5h.6M22.5 28h.6M16.5 32h.6M29 33h.6M25 21.5h.6" strokeWidth="2.6" />
    </Svg>
  )
}

export function Heart(props) {
  return (
    <Svg {...props}>
      <path d="M24 39S8 29.5 8 18.5C8 13.3 12 10 16.3 10c3.4 0 6.2 2 7.7 5 1.5-3 4.3-5 7.7-5C36 10 40 13.3 40 18.5 40 29.5 24 39 24 39z" />
    </Svg>
  )
}

/* The eight-rayed sun of the Philippine flag, as line art. */
export function Sun(props) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <Svg {...props}>
      <circle cx="24" cy="24" r="7" />
      {rays.map((deg) => (
        <g key={deg} transform={`rotate(${deg} 24 24)`}>
          <path d="M24 13.5V6" />
          <path d="M21.6 13.9 20 8.4M26.4 13.9 28 8.4" />
        </g>
      ))}
    </Svg>
  )
}

export function SpeechBubble(props) {
  return (
    <Svg {...props}>
      <path d="M10 12h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H22l-8 7v-7h-4a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z" />
      <path d="M16 23h.6M24 23h.6M32 23h.6" strokeWidth="2.6" />
    </Svg>
  )
}

/* One square brownie drawn in light perspective: crackly top, fudgy front. */
function BrowniePiece({ x, y, rot = 0, w = 92, h = 38, d = 12 }) {
  return (
    <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
      <path d={`M${x} ${y}l${d} ${-d}h${w}l${-d} ${d}z`} />
      <path d={`M${x} ${y}h${w}v${h}h${-w}z`} />
      <path d={`M${x + w} ${y}l${d} ${-d}v${h}l${-d} ${d}`} />
      <path d={`M${x + 8} ${y - 5}c10-3 14 3 24 0s14-4 22-1 12 3 18 0`} opacity="0.7" />
      <path d={`M${x + 12} ${y + 14}h1M${x + 34} ${y + 24}h1M${x + 58} ${y + 12}h1M${x + 76} ${y + 27}h1`} strokeWidth="2.4" opacity="0.45" />
    </g>
  )
}

/* A larger drawing for the hero, used until a product photo is uploaded:
   a little pile of fudgy brownies on a plate, the top one broken open. */
export function BrownieStack({ className = '' }) {
  return (
    <svg
      viewBox="0 0 320 250"
      className={`line-art ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* plate */}
      <path d="M34 214c0 12 56 21 126 21s126-9 126-21" />
      <path d="M34 214c0-8 56-15 126-15s126 7 126 15" opacity="0.5" />

      {/* bottom row */}
      <BrowniePiece x={58} y={166} />
      <BrowniePiece x={166} y={168} rot={2} />
      {/* middle */}
      <BrowniePiece x={104} y={116} rot={-4} />

      {/* top brownie, broken in two to show the fudgy middle */}
      <g transform="rotate(6 160 80)">
        <path d="M112 74l10-10h34l-5 10z" />
        <path d="M112 74h39l-4 8 5 7-4 8 4 7h-40z" />
        <path d="M120 69c8-2 12 2 20 0" opacity="0.7" />
      </g>
      <g transform="rotate(-8 200 70)">
        <path d="M176 66l10-10h40l-10 10z" />
        <path d="M176 66h40v38h-36l-4-7 5-8-4-7 4-8z" />
        <path d="M216 66l10-10v38l-10 10" />
        <path d="M184 61c8-2 12 2 20 0s8 2 12 0" opacity="0.7" />
      </g>
      {/* gooey strands across the break */}
      <path d="M156 84c6-2 11-2 17-6M157 98c6 0 11-2 17-5" opacity="0.65" />

      {/* flaky salt and crumbs */}
      <path d="M128 58l2-3M196 46l3-1M210 50l1 3M142 60l2 2" />
      <path d="M60 226l3-1M262 228l4 1M248 232l2 2M90 232l-2 2M150 208l2 1" opacity="0.8" />
    </svg>
  )
}
