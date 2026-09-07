// Single source of truth for the theme line-up.
// `demo` → /demo/<slug> page (or an external live demo) · `buy` → product URL,
// or null while the sales channel is not live (cards then offer "Notify me").
export const themes = [
  {
    slug: 'soundcheck', name: 'Soundcheck', price: 'Theme Store', priceNote: 'coming soon',
    flagship: true, external: true,
    genre: 'Post-punk demo · any genre',
    blurb: 'The flagship. A video wordmark hero, a discography that deals itself out as you scroll, a cart that opens like a record sleeve, countdowns, track previews and a press kit — built for the Shopify Theme Store and shown here as GATEFOLD, a fictional Manchester band with a full catalogue.',
    demo: 'https://c1rh1i-fs.myshopify.com', buy: null,
  },
  {
    slug: 'standard', name: 'Standard', price: 'Free', free: true,
    genre: 'Editorial · any genre', tag: 'Free',
    blurb: 'A clean editorial starting point with everything you need to launch — merch, music, tour dates and the Spotify setup guide built in.',
    demo: '/demo/standard', buy: null,
  },
  {
    slug: 'vesper', name: 'Vesper', price: '$50',
    genre: 'Light · high-fashion',
    blurb: 'Light, gallery-like and high-fashion editorial. Refined motion and a museum-grade feel for the art-pop set.',
    demo: '/demo/vesper', buy: null,
  },
  {
    slug: 'riot', name: 'Riot', price: '$50',
    genre: 'Neon · streetwear',
    blurb: 'Acid-green neon on black. Loud, bold and built for artists with attitude — hyperpop, punk, electronic.',
    demo: '/demo/riot', buy: null,
  },
  {
    slug: 'static', name: 'Static', price: '$50',
    genre: 'Mono · grainy',
    blurb: 'Grainy, monospace and stripped-back. Underground minimalism with a stylised numbered merch grid.',
    demo: '/demo/static', buy: null,
  },
  {
    slug: 'wander', name: 'Wander', price: '$50',
    genre: 'Warm · folk',
    blurb: 'Warm, dreamy and lifestyle-led. A creamy, hand-crafted feel for folk and singer-songwriters.',
    demo: '/demo/wander', buy: null,
  },
  {
    slug: 'block', name: 'Block', price: '$50',
    genre: 'Mono · hip-hop',
    blurb: 'Black-and-white hip-hop minimal. Chunky type, big statements and an animated merch slider.',
    demo: '/demo/block', buy: null,
  },
  {
    slug: 'frame', name: 'Frame', price: '$50',
    genre: 'Video · splash',
    blurb: 'A full-screen video splash. Cinematic single-moment landing that clicks through to your pages.',
    demo: '/demo/frame', buy: null,
  },
];
