import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const BRANDS = {
  limt: { key: 'limt', label: 'Love in My Tummy', path: '/limt' },
  tsismis: { key: 'tsismis', label: 'Tsismis', path: '/tsismis' },
};

const BrandContext = createContext(BRANDS.limt);

/**
 * Resolves the active brand from the URL path and:
 *  - sets data-brand on <html> so theme CSS (limt.theme.css / tsismis.theme.css) applies
 *  - remembers the choice in localStorage so "/" can redirect a returning visitor
 *    straight to their last brand instead of a neutral picker every time
 *
 * Wrap this INSIDE your Router (it needs useLocation), and OUTSIDE the routes
 * that render brand-specific pages.
 */
export function BrandProvider({ children }) {
  const location = useLocation();

  const brand = useMemo(() => {
    if (location.pathname.startsWith(BRANDS.tsismis.path)) return BRANDS.tsismis;
    return BRANDS.limt;
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brand.key);
    try {
      window.localStorage.setItem('bakedgoods:lastBrand', brand.key);
    } catch {
      // localStorage unavailable (private browsing, etc.) — non-fatal, just skip remembering
    }
  }, [brand.key]);

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}

/** Read the last-visited brand for the "/" landing redirect. Defaults to null (show picker). */
export function getLastVisitedBrand() {
  try {
    const stored = window.localStorage.getItem('bakedgoods:lastBrand');
    return stored && BRANDS[stored] ? BRANDS[stored] : null;
  } catch {
    return null;
  }
}
