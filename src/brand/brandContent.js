/*
  Everything that changes when the brand switches: logos, copy, jokes.
  Page components read from here and never hard-code brand wording, so the
  layout is built once and both voices stay in one place for editing.

  Voice: the site speaks as "we" (the team). Carolyn is celebrated by name on
  the About page as the founder. LG is the brand mascot, nothing more literal.
*/
import limtWordmarkNav from '../assets/brand/limt-wordmark-nav.png'
import limtWordmarkFull from '../assets/brand/limt-wordmark-full.png'
import tsismisWordmarkNav from '../assets/brand/tsismis-wordmark-nav.png'
import tsismisWordmarkFull from '../assets/brand/tsismis-wordmark-full.png'
import lgLimt from '../assets/lg/limt/lg-limt-portrait.webp'
import lgTsismis from '../assets/lg/tsismis/lg-tsismis-portrait.webp'
import limtHeroBrownies from '../assets/hero/limt-hero-brownies.webp'

export const BRAND_CONTENT = {
  limt: {
    name: 'Love in My Tummy',
    logo: { nav: limtWordmarkNav, full: limtWordmarkFull },
    avatar: lgLimt,

    switchLabel: 'Psst… Tsismis',
    switchTitle: 'Switch to Tsismis, our Filipino-inspired side',

    // Only used if the ticker messages can't be loaded from the database.
    ticker: [
      'Fudgy, crackly, still a little warm. Brownies are our love language.',
      'Real strawberries. Real butter. Real happy.',
      'Small batches, big feelings.',
      'Life is short. Eat the corner piece.',
    ],

    hero: {
      title: 'Sweet things worth remembering.',
      body:
        "That brownie with the crackly top. The cookie still soft in the middle. The treat you're still thinking about tomorrow. We bake by hand, in small batches, with real ingredients. If it says strawberry, a strawberry was involved.",
      primary: 'See the menu',
      secondary: 'Place an order',
      image: limtHeroBrownies,
      imageAlt: 'A stack of five fudgy chocolate brownies with flaky salt, the top one broken open',
    },

    promises: [
      {
        icon: 'strawberry',
        title: 'Real ingredients',
        body: 'Real butter, real chocolate, real fruit. Never a flavouring standing in for the real thing.',
      },
      {
        icon: 'bowl',
        title: 'Small batches',
        body: 'We bake a little at a time, so every tray gets our full attention (and a quality-control nibble).',
      },
      {
        icon: 'warm',
        title: 'Baked to order',
        body: 'Your order goes in the oven as close to pickup as we can manage. Sometimes it’s still warm.',
      },
    ],

    featured: {
      title: 'Fresh out of the oven',
      link: 'See the whole menu',
      empty: 'The menu is warming up. Check back soon.',
    },

    // Home page: LG, the mascot
    story: {
      title: 'Meet LG',
      paragraphs: [
        'LG is our resident taste-tester, quality inspector and chief crumb collector. She has never met a brownie she didn’t approve of.',
        'You’ll spot her on our boxes, our tags, and very possibly beside the last cookie on the plate. If LG is on it, it passed inspection.',
      ],
      signature: 'LG, chief taste-tester',
      link: 'Meet the people behind the treats',
    },

    order: {
      title: 'Got a craving with a date on it?',
      body: "Birthdays, Tuesdays, apologies, celebrations. Tell us what you're after and when, and we'll send a quote, usually within a day.",
      button: 'Place an order',
    },

    about: {
      kicker: 'Our founder',
      title: 'Meet Carolyn.',
      lede:
        'Love in My Tummy began with one simple, stubborn idea: a treat should taste like the real thing, because it is the real thing.',
      sections: [
        {
          heading: 'A baker who means it',
          body: [
            'Carolyn bakes the way some people sing in the car: loudly, joyfully, and because it makes everything better. The kitchen is where she finds her calm, and you can taste it.',
            'Ask her to make your favourite and watch her light up. Nine times out of ten she’ll find a little twist that makes it even more yours.',
          ],
        },
        {
          heading: 'No shortcuts, ever',
          body: [
            'Real butter. Real chocolate. Fruit that came from a plant, not a bottle. Everything is made by hand in small batches, as close to the moment you pick it up as she can manage. Sometimes that means minutes.',
            'And nothing is ever too much of anything. Every bake is in balance: sweet but not cloying, rich but never heavy.',
          ],
        },
        {
          heading: 'Two brands, one founder',
          body: [
            'Carolyn built Love in My Tummy for the sweet, cosy, made-with-love side of baking. Then, being proudly Filipina Canadian, she built Tsismis to celebrate the flavours of home: ube, calamansi, leche flan and pandan, with a lot more attitude.',
            'Both are run entirely online, from first message to last crumb, by a business owner who designs the menu, bakes every order and still makes each one feel personal.',
          ],
        },
      ],
      closing: 'If you’ve tasted one of her bakes, you already know. If you haven’t, we’d love to change that.',
      cta: 'See the menu',
    },

    footer: {
      blurb: 'Small-batch sweets, baked by hand and made to be remembered.',
    },
  },

  tsismis: {
    name: 'Tsismis',
    logo: { nav: tsismisWordmarkNav, full: tsismisWordmarkFull },
    avatar: lgTsismis,

    switchLabel: 'Love in My Tummy',
    switchTitle: 'Switch back to Love in My Tummy',

    // Only used if the ticker messages can't be loaded from the database.
    ticker: [
      'Psst… you didn’t hear this from me.',
      'A little bird told me you might be hungry.',
      'So good, it’s worth the whisper.',
      'Tell your friends. (After you finish.)',
      'We can’t keep a secret this sweet.',
    ],

    hero: {
      title: 'The bakery everyone’s whispering about.',
      body:
        'Ube that turns your fingertips purple. Leche flan that wobbles just right. Calamansi bright enough to make you squint. Filipino favourites made the way they taste back home, and talked about for days afterwards.',
      primary: 'See the goods',
      secondary: 'Spill your order',
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
        body: 'Small batches, big reactions. Everyone will ask where you got it. Act casual.',
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
        'Tsismis is Love in My Tummy’s cheeky little sister: same kitchen, same LG, a lot more attitude. It’s where Filipino favourites get to be as loud as they like.',
        'If Love in My Tummy is a warm hug, Tsismis is the friend who leans in and tells you the good stuff first. Everything is still handmade, to order. We just talk about it more.',
      ],
      signature: 'LG, allegedly',
      link: 'Get the full story',
    },

    // The see no / hear no / speak no row above the gossip tags (Tsismis only)
    noTsismis: {
      title: 'We have a strict no-tsismis policy.',
      lines: ['See no tsismis.', 'Hear no tsismis.', 'Speak no tsismis.'],
      punchline: 'We lasted about four seconds.',
    },

    tags: [
      'A little bird told me you might be hungry.',
      'So good, it’s worth the whisper.',
      'Tell your friends. (After you finish.)',
      'We can’t keep a secret this sweet.',
    ],

    order: {
      title: 'Got something to spill?',
      body: "Merienda spreads, pasalubong boxes, or a tray of turon just for you. Tell us what you're planning and we'll send a quote. Your secret's safe. Mostly.",
      button: 'Spill your order',
    },

    about: {
      kicker: 'The boss of the gossip',
      title: 'Meet Carolyn.',
      lede: 'Every good tsismis starts with someone who knows the good stuff. Around here, that’s Carolyn.',
      sections: [
        {
          heading: 'Proudly Filipina Canadian',
          body: [
            'Carolyn founded Love in My Tummy, then decided the flavours of home deserved a brand of their own, with a bit more noise. Tsismis was born.',
            'Ube, calamansi, pandan, coconut, leche flan: the tastes of family tables and pasalubong boxes, made with the same real ingredients and the same stubborn care as everything else she bakes.',
          ],
        },
        {
          heading: 'Serious about baking. Not so serious about everything else.',
          body: [
            'She’ll happily laugh at a gossip joke, but she does not joke about ingredients. Everything is handmade in small batches, as fresh as it gets, with nothing artificial standing in for the real thing.',
          ],
        },
        {
          heading: 'Her business, her way',
          body: [
            'Two brands, one founder, run entirely online. Carolyn designs the menus, bakes the orders and makes sure every box leaves the kitchen feeling like a little celebration.',
          ],
        },
      ],
      closing: 'Now you know. Tell everyone. (After you finish.)',
      cta: 'See the goods',
    },

    footer: {
      blurb: 'Filipino-inspired treats with a gossip problem. Handmade to order.',
    },
  },
}

export function brandContent(key) {
  return BRAND_CONTENT[key] ?? BRAND_CONTENT.limt
}
