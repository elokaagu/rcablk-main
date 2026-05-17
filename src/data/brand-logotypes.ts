/**
 * RCA BLK horizontal logotype variants (transparent PNG letterforms).
 */
export const BRAND_LOGOTYPES = {
  /** Warm yellow — Support coral field + yellow BLK stack */
  yellow: "/brand-logotypes/logotype-yellow.png",
  /** Pale blue — Resources corner wordmark + Alumni field */
  blue: "/brand-logotypes/logotype-blue.png",
  /** Coral red — Contact red-coral field */
  coral: "/brand-logotypes/logotype-coral.png",
  /** Sage mint — Events listing green */
  sage: "/brand-logotypes/logotype-sage.png",
  /** Soft gold — cream legal / utility pages */
  gold: "/brand-logotypes/logotype-gold.png",
  /** Forest green — News yellow field (contrast without clashing hue) */
  forest: "/brand-logotypes/logotype-forest.png",
  /** Bright orange — Home hero gold field */
  orange: "/brand-logotypes/logotype-orange.png",
  /** Stepped black — About (white panel) and high-contrast needs */
  black: "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png",
} as const;

export type BrandLogotypeKey = keyof typeof BRAND_LOGOTYPES;

/** Default corner logotype per public route slug */
export const PAGE_LOGOTYPE: Record<string, BrandLogotypeKey> = {
  support: "yellow",
  resources: "blue",
  contact: "coral",
  events: "sage",
  alumni: "blue",
  news: "forest",
  search: "gold",
  "privacy-policy": "gold",
  "cookie-policy": "gold",
  terms: "gold",
  accessibility: "gold",
};

export function getPageLogotypeSrc(slug: string): string {
  const key = PAGE_LOGOTYPE[slug] ?? "black";
  return BRAND_LOGOTYPES[key];
}
