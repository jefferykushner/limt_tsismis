/*
  Per-brand LG pose registry.

  Page code asks for a UI moment ("hero", "story", "empty"...), never for a
  specific picture, so each brand can answer the same request with its own
  pose. A moment a brand doesn't list falls back to that brand's circular
  portrait, unless the caller asks for no fallback.

  LG is photographic (from 25 Nov 2026). Images are cut out of the white
  backgrounds of the originals in design/images/ (batch 3) and saved as WebP.
*/
import lgLimtPortrait from '../assets/lg/limt/lg-limt-portrait.webp'
import lgTsismisPortrait from '../assets/lg/tsismis/lg-tsismis-portrait.webp'
import limtWave from '../assets/lg/limt/lg-limt-wave.webp'
import limtBrownieOffer from '../assets/lg/limt/lg-limt-brownie-offer.webp'
import limtFlourLaugh from '../assets/lg/limt/lg-limt-flour-laugh.webp'
import limtBlanketWink from '../assets/lg/limt/lg-limt-blanket-wink.webp'
import tsismisWhisper from '../assets/lg/tsismis/lg-tsismis-whisper.webp'
import tsismisDoorPeek from '../assets/lg/tsismis/lg-tsismis-door-peek.webp'
import tsismisWhoMe from '../assets/lg/tsismis/lg-tsismis-who-me.webp'
import tsismisSeeNo from '../assets/lg/tsismis/lg-tsismis-see-no.webp'
import tsismisHearNo from '../assets/lg/tsismis/lg-tsismis-hear-no.webp'
import tsismisSpeakNo from '../assets/lg/tsismis/lg-tsismis-speak-no.webp'

const limtBrownie = { src: limtBrownieOffer, alt: 'LG holding out a fudgy brownie and winking', w: 426, h: 1000 }
const tsismisWhisperPose = { src: tsismisWhisper, alt: 'LG whispering a secret behind her hand', w: 448, h: 1000 }

export const LG_POSES = {
  limt: {
    story: { src: limtWave, alt: 'LG waving hello, holding a chocolatey wooden spoon', w: 476, h: 1000 },
    featured: limtBrownie,
    order: limtBrownie,
    empty: { src: limtFlourLaugh, alt: 'LG sitting in a pile of flour, laughing', w: 1260, h: 1000 },
    cozy: { src: limtBlanketWink, alt: 'LG winking under a striped blanket', w: 546, h: 1000 },
    fallback: { src: lgLimtPortrait, alt: 'LG, the Love in My Tummy mascot, winking under a striped blanket', w: 320, h: 320 },
  },
  tsismis: {
    hero: tsismisWhisperPose,
    story: { src: tsismisDoorPeek, alt: 'LG peeking around a door with a finger to her lips', w: 702, h: 1000 },
    order: tsismisWhisperPose,
    empty: { src: tsismisWhoMe, alt: 'LG looking innocent, as if to say "who, me?"', w: 422, h: 1000 },
    seeNo: { src: tsismisSeeNo, alt: 'LG covering her eyes', w: 638, h: 1000 },
    hearNo: { src: tsismisHearNo, alt: 'LG covering her ears, laughing', w: 638, h: 1000 },
    speakNo: { src: tsismisSpeakNo, alt: 'LG covering her mouth, bursting to tell', w: 637, h: 1000 },
    fallback: { src: lgTsismisPortrait, alt: 'LG, the Tsismis mascot, with a finger to her lips', w: 320, h: 320 },
  },
}
