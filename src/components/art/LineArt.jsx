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

/* A larger drawing for the hero, used until a product photo is uploaded. */
export function BrownieStack({ className = '' }) {
  return (
    <svg
      viewBox="0 0 320 260"
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
      <ellipse cx="160" cy="212" rx="128" ry="26" />
      <path d="M58 214c18 10 60 16 102 16s84-6 102-16" opacity="0.6" />
      {/* bottom brownie */}
      <path d="M84 196v-34l70-14 82 16v34l-82 14z" />
      <path d="M84 162l70 16 82-14M154 178v32" />
      <path d="M92 166c14 5 24-2 36 4 12 6 18 0 26 4" opacity="0.7" />
      {/* middle brownie, turned */}
      <path d="M100 146v-30l64-18 70 18v30l-70 18z" />
      <path d="M100 116l64 18 70-18M164 134v30" />
      <path d="M170 112c10-4 18 2 28-1s14 2 22 0" opacity="0.7" />
      {/* top brownie, broken to show the fudgy middle */}
      <path d="M118 96V72l46-12 26 7-8 10 6 8-4 9 6 9-26 5z" />
      <path d="M118 72l46 12M164 84v28" />
      <path d="M196 70l32-8 30 9v22l-30 8-26-5" />
      <path d="M196 70l30 9 32-8M226 79v22" />
      <path d="M186 88c3 1 4 4 2 6M190 76c2 1 3 3 1 5" opacity="0.7" />
      {/* crumbs and salt */}
      <path d="M62 236l3-2M268 230l4 1M246 240l2 2M80 226l-2 3" />
      <path d="M142 64l2-2M176 58l2 1M154 56l1 2" opacity="0.8" />
    </svg>
  )
}
