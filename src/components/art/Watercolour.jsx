import { useId } from 'react'
import './art.css'

/*
  Soft watercolour blooms, drawn in SVG. Each bloom is an ellipse pushed
  out of shape by a noise filter and blurred at the edge, so it reads as
  pigment soaking into paper. Colours come from the brand's --wash-* tokens,
  so the same blooms re-tint themselves when the brand switches.

  `layout` picks a preset arrangement; blooms are positioned in a 100 x 100
  box that stretches to fill the parent (which must be position: relative).
*/
const LAYOUTS = {
  hero: [
    { cx: 70, cy: 38, rx: 30, ry: 26, c: 1, o: 0.42 },
    { cx: 86, cy: 62, rx: 20, ry: 18, c: 2, o: 0.5 },
    { cx: 56, cy: 70, rx: 18, ry: 14, c: 3, o: 0.55 },
    { cx: 14, cy: 14, rx: 14, ry: 10, c: 4, o: 0.35 },
  ],
  story: [
    { cx: 30, cy: 46, rx: 26, ry: 30, c: 2, o: 0.5 },
    { cx: 46, cy: 66, rx: 18, ry: 16, c: 1, o: 0.35 },
    { cx: 16, cy: 72, rx: 12, ry: 10, c: 3, o: 0.5 },
  ],
  band: [
    { cx: 8, cy: 30, rx: 16, ry: 22, c: 1, o: 0.3 },
    { cx: 94, cy: 72, rx: 18, ry: 24, c: 3, o: 0.4 },
    { cx: 84, cy: 18, rx: 8, ry: 10, c: 4, o: 0.35 },
  ],
  card: [
    { cx: 46, cy: 50, rx: 34, ry: 30, c: 2, o: 0.55 },
    { cx: 64, cy: 62, rx: 20, ry: 18, c: 1, o: 0.35 },
  ],
}

export default function Watercolour({ layout = 'hero', className = '', seed = 3 }) {
  const id = useId().replace(/:/g, '')
  const blooms = LAYOUTS[layout] ?? LAYOUTS.hero

  return (
    <svg
      className={`watercolour ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={`bleed-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feGaussianBlur in="warped" stdDeviation="0.9" />
        </filter>
      </defs>
      <g filter={`url(#bleed-${id})`}>
        {blooms.map((b, i) => (
          <g key={i} opacity={b.o}>
            {/* the wash itself, lighter towards the middle */}
            <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={`var(--wash-${b.c})`} opacity="0.7" />
            <ellipse cx={b.cx - b.rx * 0.3} cy={b.cy + b.ry * 0.2} rx={b.rx * 0.55} ry={b.ry * 0.5} fill={`var(--wash-${b.c})`} opacity="0.4" />
            {/* pigment pooling at the drying edge */}
            <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill="none" stroke={`var(--wash-${b.c})`} strokeWidth="1.1" opacity="1" />
          </g>
        ))}
      </g>
    </svg>
  )
}
