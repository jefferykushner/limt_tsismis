import { useBrand } from '../brand/BrandContext';
import { LG_POSES } from '../brand/lgPoses';

/**
 * <LG pose="hero" />
 *
 * Renders the brand-correct LG image for a given UI moment. Page code never
 * names a specific photo — it names the emotional beat ("hero", "empty",
 * "sidebarTip") and gets back whichever pose that brand uses for it.
 *
 * If a brand hasn't defined a given pose yet, falls back to that brand's
 * `fallback` entry rather than rendering nothing, so pages don't break while
 * the pose library is still being filled in.
 */
export function LG({ pose, className = '', breakout = false, ...imgProps }) {
  const brand = useBrand();
  const brandPoses = LG_POSES[brand.key] ?? {};
  const entry = brandPoses[pose] ?? brandPoses.fallback;

  if (!entry) {
    if (import.meta.env?.DEV) {
      console.warn(`<LG>: no pose "${pose}" and no fallback registered for brand "${brand.key}"`);
    }
    return null;
  }

  if (import.meta.env?.DEV && !brandPoses[pose]) {
    console.warn(`<LG>: pose "${pose}" not defined for brand "${brand.key}", using fallback`);
  }

  const classes = ['lg-mascot', `lg-mascot--${pose}`, breakout && 'lg-mascot--breakout', className]
    .filter(Boolean)
    .join(' ');

  return <img src={entry.src} alt={entry.alt} className={classes} {...imgProps} />;
}
