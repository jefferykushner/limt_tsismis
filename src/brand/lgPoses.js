/*
  Per-brand LG pose registry.

  Page code asks for a UI moment ("hero", "story", "empty"...), never for a
  specific picture, so each brand can answer the same request with its own
  pose. A moment a brand doesn't list falls back to that brand's circular
  portrait, unless the caller asks for no fallback.

  Images are cut out from the originals in design/images/ (see README).
*/
import lgLimt from '../assets/lg-limt.png'
import lgTsismis from '../assets/lg-tsismis.png'
import limtWave from '../assets/lg/limt/lg-limt-wave.webp'
import limtBrownieOffer from '../assets/lg/limt/lg-limt-brownie-offer.webp'
import limtFlourLaugh from '../assets/lg/limt/lg-limt-flour-laugh.webp'
import tsismisWhisper from '../assets/lg/tsismis/lg-tsismis-whisper.webp'
import tsismisDoorPeek from '../assets/lg/tsismis/lg-tsismis-door-peek.webp'
import tsismisWhoMe from '../assets/lg/tsismis/lg-tsismis-who-me.webp'

const limtBrownie = { src: limtBrownieOffer, alt: 'LG holding out a fudgy brownie', w: 442, h: 1000 }
const tsismisWhisperPose = { src: tsismisWhisper, alt: 'LG whispering a secret behind her hand', w: 499, h: 1000 }

export const LG_POSES = {
  limt: {
    story: { src: limtWave, alt: 'LG waving hello, holding a wooden spoon', w: 482, h: 1000 },
    featured: limtBrownie,
    order: limtBrownie,
    empty: { src: limtFlourLaugh, alt: 'LG laughing, covered in flour', w: 937, h: 1000 },
    fallback: { src: lgLimt, alt: 'LG, the Love in My Tummy mascot, winking and hugging a striped blanket' },
  },
  tsismis: {
    hero: tsismisWhisperPose,
    story: { src: tsismisDoorPeek, alt: 'LG peeking around a doorway with a finger to her lips', w: 567, h: 1000 },
    order: tsismisWhisperPose,
    empty: { src: tsismisWhoMe, alt: 'LG looking innocent, as if to say "who, me?"', w: 412, h: 1000 },
    fallback: { src: lgTsismis, alt: 'LG, the Tsismis mascot, smiling with a finger to her lips' },
  },
}
