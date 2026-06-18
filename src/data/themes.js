// Single source of truth for the theme line-up.
// `demo` → /demo/<slug> page · `buy` → Gumroad/Payhip product URL (placeholder for now)
export const themes = [
  {
    slug: 'standard', name: 'Standard', price: 'Free', free: true,
    genre: 'Editorial · any genre', tag: 'Free',
    blurb: 'A clean editorial starting point with everything you need to launch — merch, music, tour dates and the Spotify setup guide built in.',
    swatch: 'linear-gradient(135deg,#2b2733,#46415a)', nameColor: '#fff',
    demo: '/demo/standard', buy: '#',
  },
  {
    slug: 'vesper', name: 'Vesper', price: '$50',
    genre: 'Light · high-fashion',
    blurb: 'Light, gallery-like and high-fashion editorial. Refined motion and a museum-grade feel for the art-pop set.',
    swatch: 'linear-gradient(135deg,#f7f3ec,#ddd5c8)', nameColor: '#26222e',
    demo: '/demo/vesper', buy: '#',
  },
  {
    slug: 'riot', name: 'Riot', price: '$50',
    genre: 'Neon · streetwear',
    blurb: 'Acid-green neon on black. Loud, bold and built for artists with attitude — hyperpop, punk, electronic.',
    swatch: 'linear-gradient(135deg,#0e0e0e,#1c1c1c)', nameColor: '#c6ff3a',
    demo: '/demo/riot', buy: '#',
  },
  {
    slug: 'static', name: 'Static', price: '$50',
    genre: 'Mono · grainy',
    blurb: 'Grainy, monospace and stripped-back. Underground minimalism with a stylised numbered merch grid.',
    swatch: 'linear-gradient(135deg,#d8d2c5,#7d7768)', nameColor: '#fff',
    demo: '/demo/static', buy: '#',
  },
  {
    slug: 'wander', name: 'Wander', price: '$50',
    genre: 'Warm · folk',
    blurb: 'Warm, dreamy and lifestyle-led. A creamy, hand-crafted feel for folk and singer-songwriters.',
    swatch: 'linear-gradient(135deg,#f6efe2,#c0613a)', nameColor: '#fff',
    demo: '/demo/wander', buy: '#',
  },
  {
    slug: 'block', name: 'Block', price: '$50',
    genre: 'Mono · hip-hop',
    blurb: 'Black-and-white hip-hop minimal. Chunky type, big statements and an animated merch slider.',
    swatch: 'linear-gradient(135deg,#111,#3a3a3a)', nameColor: '#fff',
    demo: '/demo/block', buy: '#',
  },
  {
    slug: 'frame', name: 'Frame', price: '$50',
    genre: 'Video · splash',
    blurb: 'A full-screen video splash. Cinematic single-moment landing that clicks through to your pages.',
    swatch: 'linear-gradient(135deg,#0a0a12,#2a2a40)', nameColor: '#fff',
    demo: '/demo/frame', buy: '#',
  },
];
