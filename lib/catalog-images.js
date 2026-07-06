/**
 * Royalty-free catalog images (Unsplash License — free for commercial use)
 * https://unsplash.com/license
 *
 * Every image is tagged on Unsplash as mosquito net, window screen, mesh, or insect screen.
 */

const u = (id, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const SITE_IMAGES = {
  /** Mesh screen / net installation */
  hero: u("photo-1581578731548-c64695cc6952", 1200),

  categories: {
    /** Modern windows with white insect screens */
    "window-openable": u("photo-1758998222336-d48b2390a686"),
    /** Close-up mosquito net / window screen mesh */
    "door-openable": u("photo-1761052056661-05a554df6ff4"),
    /** Light through window screen mesh grid */
    "pleated-system": u("photo-1767032915447-a09b88e07b0c"),
    /** White mosquito net on bed — removable net style */
    "velcro-system": u("photo-1533633310920-cc9bf1e7f9b0"),
    /** Folding doors & windows with mesh screens */
    "sliding-system": u("photo-1758998222336-d48b2390a686"),
    /** Roller blind on window — roll-up cassette style */
    "rollup-system": u("photo-1776261293170-66fd3b09273e"),
    /** Metal mesh net texture — honeycomb-style grid */
    "honey-comb": u("photo-1642219046655-caa5ff2b78a0"),
  },

  products: {
    "sleek-openable": u("photo-1758998222336-d48b2390a686"),
    "classic-openable": u("photo-1767032915447-a09b88e07b0c"),
    "magnetic-openable": u("photo-1761052056661-05a554df6ff4"),
    "classic-door-openable": u("photo-1761052056661-05a554df6ff4"),
    "smart-door-openable": u("photo-1758998222336-d48b2390a686"),
    /** Grill / security mesh pattern */
    "grill-door-openable": u("photo-1601583438330-a61d0df44f1f"),
    "elite-pleated-system": u("photo-1767032915447-a09b88e07b0c"),
    "dual-pleated-system": u("photo-1642219046655-caa5ff2b78a0"),
    "freedom-pleated-system": u("photo-1776261293170-66fd3b09273e"),
    "velcro-mosquito-nets": u("photo-1533633310920-cc9bf1e7f9b0"),
    "magnetic-mesh": u("photo-1620626011761-996317b8d101"),
    "magnetic-door-screen": u("photo-1533633310920-cc9bf1e7f9b0"),
  },
};

export function getCategoryImage(slug) {
  return SITE_IMAGES.categories[slug] || SITE_IMAGES.categories["window-openable"];
}

export function getProductImage(slug, categorySlug) {
  return (
    SITE_IMAGES.products[slug] ||
    getCategoryImage(categorySlug) ||
    SITE_IMAGES.hero
  );
}

/** SQL-safe image URL list for migrations */
export function productImageArray(slug, categorySlug) {
  return `ARRAY['${getProductImage(slug, categorySlug)}']`;
}

export function categoryImageUrl(slug) {
  return getCategoryImage(slug);
}
