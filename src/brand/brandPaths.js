/**
 * Public URLs for each brand. Tsismis pages live under /tsismis so the brand
 * stays active as visitors move around (BrandContext reads the URL prefix).
 */
export function brandPaths(brandKey) {
  const base = brandKey === 'tsismis' ? '/tsismis' : ''
  return {
    home: base || '/',
    menu: `${base}/menu`,
    order: `${base}/order`,
    story: `${base || '/'}#story`,
  }
}
