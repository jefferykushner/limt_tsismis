/*
  Everything that changes when the brand switches: logos, copy, jokes.
  Page components read from here and never hard-code brand wording, so the
  layout is built once and both voices stay in one place for editing.
*/
import limtWordmarkNav from '../assets/brand/limt-wordmark-nav.png'
import limtWordmarkFull from '../assets/brand/limt-wordmark-full.png'
import tsismisWordmarkNav from '../assets/brand/tsismis-wordmark-nav.png'
import tsismisWordmarkFull from '../assets/brand/tsismis-wordmark-full.png'
import lgLimt from '../assets/lg-limt.png'
import lgTsismis from '../assets/lg-tsismis.png'

export const BRAND_CONTENT = {
  limt: {
    name: 'Love in My Tummy',
    logo: { nav: limtWordmarkNav, full: limtWordmarkFull },
    avatar: lgLimt,

    switchLabel: 'Psst… Tsismis',
    switchTitle: 'Switch to Tsismis, our Filipino-inspired side',

    hero: {
      title: 'Real ingredients, baked by hand, just for you.',
      body:
        "Fudgy brownies, gourmet cookies and a few surprises, made in small batches by Carolyn. If it says strawberry, there's real strawberry in it.",
      primary: 'See the menu',
      secondary: 'Place an order',
      imageAlt: 'A stack of fudgy chocolate brownies',
    },

    promises: [
      {
        icon: 'strawberry',
        title: 'Real ingredients',
        body: 'Real fruit, real butter, real chocolate. Never a flavouring standing in for the real thing.',
      },
      {
        icon: 'bowl',
        title: 'Small batches',
        body: 'Everything is mixed and baked in small batches, so every piece gets attention.',
      },
      {
        icon: 'warm',
        title: 'Baked to order',
        body: 'Baked as close to pickup as possible. Sometimes minutes before it leaves the kitchen.',
      },
    ],

    featured: {
      title: "From Carolyn's kitchen",
      link: 'See the full menu',
      empty: 'The menu is being written. Check back soon.',
    },

    story: {
      title: 'Meet LG',
      paragraphs: [
        "LG is short for Little Girl, which is what Carolyn's dad called her growing up. She's the warmth in every batch and the reason each one has to be just right.",
        'Carolyn bakes because she loves it. She gets excited every time someone asks for their favourite, and she usually finds a way to make it a little more special. Nothing is ever too much of anything; every bake is in balance.',
      ],
      signature: 'Carolyn',
      imageAlt: 'LG, winking and hugging a striped blanket',
    },

    order: {
      title: 'Planning something sweet?',
      body: "Tell us what you'd like and when you need it. We'll send a quote, usually within a day.",
      button: 'Place an order',
    },

    footer: {
      blurb: 'Handmade, small-batch sweets, made to order with real ingredients.',
    },
  },

  tsismis: {
    name: 'Tsismis',
    logo: { nav: tsismisWordmarkNav, full: tsismisWordmarkFull },
    avatar: lgTsismis,

    switchLabel: 'Love in My Tummy',
    switchTitle: 'Switch back to Love in My Tummy',

    ticker: [
      'Psst… you didn’t hear this from me.',
      'A little bird told me you might be hungry.',
      'So good, it’s worth the whisper.',
      'Tell your friends. (After you finish.)',
      'We can’t keep a secret this sweet.',
      'Bonding over secrets, sweetened by us.',
    ],

    hero: {
      title: 'The bakery everyone’s whispering about.',
      body:
        "Ube, calamansi, leche flan and pandan, made the way Carolyn grew up eating them. Real ingredients, small batches, and a lot of talking about it afterwards.",
      primary: 'See the goods',
      secondary: 'Spill your order',
      imageAlt: 'Filipino-inspired treats',
    },

    promises: [
      {
        icon: 'strawberry',
        title: 'The real stuff',
        body: 'Real ube, real mango, real calamansi. We would never fake it. (Unlike some people we know.)',
      },
      {
        icon: 'bowl',
        title: 'Small batches',
        body: 'Small batches, big reactions. Everyone will ask where you got it.',
      },
      {
        icon: 'warm',
        title: 'Fresh off the line',
        body: 'Baked to order, so it’s still warm when the story gets out.',
      },
    ],

    featured: {
      title: 'Everyone’s talking about',
      link: 'See everything',
      empty: 'New gossip is on the way. Check back soon.',
    },

    story: {
      title: 'Tsismis means gossip',
      paragraphs: [
        'Tsismis is the cheeky little sister of Love in My Tummy: same kitchen, same Carolyn, same LG, a lot more attitude. It’s where her Filipino favourites get to be as loud as they want.',
        'If Love in My Tummy is a warm hug, Tsismis is the friend who leans in and tells you the good stuff first. Everything is still handmade, to order. We just talk about it differently.',
      ],
      signature: 'LG, allegedly',
      imageAlt: 'LG with a finger to her lips',
    },

    tags: [
      'A little bird told me you might be hungry.',
      'So good, it’s worth the whisper.',
      'Tell your friends. (After you finish.)',
      'We can’t keep a secret this sweet.',
    ],

    order: {
      title: 'Got something to spill?',
      body: "Merienda spreads, pasalubong boxes, or a tray of turon just for you. Tell us what you're planning and we'll send a quote.",
      button: 'Spill your order',
    },

    footer: {
      blurb: 'Filipino-inspired treats with a gossip problem. Handmade to order.',
    },
  },
}

export function brandContent(key) {
  return BRAND_CONTENT[key] ?? BRAND_CONTENT.limt
}
