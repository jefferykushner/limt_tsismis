/*
  Per-brand LG pose registry.

  ⚠️ Asset status: the images reviewed so far are photographer contact
  sheets (multiple poses per file). Before these paths resolve to anything,
  each pose needs to be individually cropped/exported as its own image
  (transparent or clean-cut background as appropriate to where it's used)
  and dropped into /public/assets/lg/{brand}/. Filenames below are the
  agreed naming convention — export to match them and everything else
  just works.

  Semantic keys (left side) are intentionally about the MOMENT in the UI,
  not the pose itself — page code asks for "hero" or "empty", never for
  "the wall-crack laughing one". That indirection is what lets each brand
  answer the same request with a different pose.
*/

export const LG_POSES = {
  limt: {
    hero: {
      src: '/assets/lg/limt/hero-wall-break.png',
      alt: 'LG breaking through a cracked wall, laughing and reaching out',
    },
    greeting: {
      src: '/assets/lg/limt/peekaboo-cabinet.png',
      alt: 'LG peeking around a cabinet',
    },
    menuTease: {
      src: '/assets/lg/limt/cookie-jar-reach.png',
      alt: 'LG reaching into a jar of cookies',
    },
    howItWorks: {
      src: '/assets/lg/limt/stirring-bowl.png',
      alt: 'LG stirring a bowl of batter at a small table',
    },
    orderConfirmed: {
      src: '/assets/lg/limt/cake-strawberries.png',
      alt: 'LG proudly presenting a strawberry-topped cake',
    },
    thankYou: {
      src: '/assets/lg/limt/blowing-kiss.png',
      alt: 'LG blowing a kiss',
    },
    empty: {
      src: '/assets/lg/limt/flour-laugh.png',
      alt: 'LG covered in flour, laughing with hands up',
    },
    sidebarTip: {
      src: '/assets/lg/limt/whisk-bunny-hug.png',
      alt: 'LG hugging a stuffed bunny while holding a whisk',
    },
    aboutIntro: {
      src: '/assets/lg/limt/basket-peekaboo.png',
      alt: 'LG peeking out of a woven basket',
    },
    seasonal: {
      src: '/assets/lg/limt/holding-flowers.png',
      alt: 'LG holding a small bouquet',
    },
    featuredItem: {
      src: '/assets/lg/limt/cupcake-offer.png',
      alt: 'LG offering a frosted cupcake toward the viewer',
    },
    fallback: {
      src: '/assets/lg/limt/peekaboo-cabinet.png',
      alt: 'LG, the Love in My Tummy mascot',
    },
  },

  tsismis: {
    hero: {
      src: '/assets/lg/tsismis/psst-secret-notes.png',
      alt: 'LG whispering beside notes reading "Psst... Did you hear? Big Secret!"',
    },
    greeting: {
      src: '/assets/lg/tsismis/door-peek.png',
      alt: 'LG peeking around a door',
    },
    sidebarTip: {
      src: '/assets/lg/tsismis/whisper-teddy.png',
      alt: 'LG whispering a secret into a teddy bear\u2019s ear',
    },
    empty: {
      src: '/assets/lg/tsismis/who-me-chalkboard.png',
      alt: 'LG holding a chalkboard reading "Who, me?"',
    },
    aboutIntro: {
      src: '/assets/lg/tsismis/top-secret-bag.png',
      alt: 'LG peeking out of a paper bag labeled "Top Secret"',
    },
    featuredItem: {
      src: '/assets/lg/tsismis/cupcake-shush.png',
      alt: 'LG with a cupcake, finger to her lips',
    },
    productSpotlight: {
      src: '/assets/lg/tsismis/ube-kalamay-offer.png',
      alt: 'LG offering a plate of ube kalamay toward the viewer',
      // Occasional/secondary placement only — this pose reads closer to
      // LIMT's open-laugh register than Tsismis's gossip register.
      // Don't promote to hero/nav without a gossip-coded alternative.
    },
    fallback: {
      src: '/assets/lg/tsismis/door-peek.png',
      alt: 'LG, the Tsismis mascot',
    },
  },
};
