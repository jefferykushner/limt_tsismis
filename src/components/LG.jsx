import { useBrand } from '../brand/BrandContext'
import { LG_POSES } from '../brand/lgPoses'

/**
 * <LG pose="story" />
 *
 * Renders the brand-correct LG for a UI moment. If the active brand has no
 * pose for that moment, shows the brand's portrait instead, or nothing when
 * `fallback={false}`. Pass `decorative` to hide her from screen readers.
 */
export function LG({ pose, className = '', breakout = false, fallback = true, decorative = false, ...imgProps }) {
  const brand = useBrand()
  const poses = LG_POSES[brand.key] ?? {}
  const entry = poses[pose] ?? (fallback ? poses.fallback : null)
  if (!entry) return null

  const classes = ['lg-mascot', `lg-mascot--${pose}`, breakout && 'lg-mascot--breakout', className]
    .filter(Boolean)
    .join(' ')

  return (
    <img
      src={entry.src}
      alt={decorative ? '' : entry.alt}
      width={entry.w}
      height={entry.h}
      className={classes}
      loading="lazy"
      {...imgProps}
    />
  )
}

/** True when the active brand has its own pose for this moment. */
export function useHasPose(pose) {
  const brand = useBrand()
  return Boolean(LG_POSES[brand.key]?.[pose])
}
