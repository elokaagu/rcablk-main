/**
 * RCA BLK horizontal logotype variants (transparent PNG letterforms).
 */
export const BRAND_LOGOTYPES = {
  /** Warm yellow — Support coral field + yellow BLK stack */
  yellow: "/brand-logotypes/logotype-yellow.png",
  /** Pale blue — Resources corner wordmark */
  blue: "/brand-logotypes/logotype-blue.png",
  /** Coral red — Contact red-coral field */
  coral: "/brand-logotypes/logotype-coral.png",
  /** Sage mint — reserved for sage-on-sage contexts */
  sage: "/brand-logotypes/logotype-sage.png",
  /** Soft gold — cream legal / utility pages */
  gold: "/brand-logotypes/logotype-gold.png",
  /** Forest green — News yellow field (contrast without clashing hue) */
  forest: "/brand-logotypes/logotype-forest.png",
  /** Bright orange — Home hero gold field */
  orange: "/brand-logotypes/logotype-orange.png",
  /** Stepped black — About (white panel) and high-contrast needs */
  black: "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-Black.png",
  /** Stepped white — Contact coral field */
  white: "/1_RGB Logotype/Stepped Logotype/RCA BLK–Logotype-White.png",
  /** Square block lockup — mobile corner wordmark & About hero */
  squareBlack: "/1_RGB Logotype/Square Logotype/RCA BLK–Logotype-Black.png",
} as const;

export type BrandLogotypeKey = keyof typeof BRAND_LOGOTYPES;

/** Default corner logotype per public route slug */
export const PAGE_LOGOTYPE: Record<string, BrandLogotypeKey> = {
  support: "yellow",
  resources: "blue",
  contact: "white",
  events: "yellow",
  alumni: "forest",
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
