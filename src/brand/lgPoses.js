/*
  Per-brand LG pose registry.

  Page code asks for a UI moment ("hero", "aboutIntro", "empty"), never for a
  specific picture, so each brand can answer the same request with a
  different pose.

  Until the individual pose illustrations are produced, every moment uses
  the brand's circular portrait that already ships in /src/assets. To add a
  pose later: drop the image in /src/assets/lg/<brand>/, import it here and
  give that moment its own entry. Anything not listed falls back to
  `fallback`.
*/
import lgLimt from '../assets/lg-limt.png'
import lgTsismis from '../assets/lg-tsismis.png'

const limtPortrait = {
  src: lgLimt,
  alt: 'LG, the Love in My Tummy mascot, winking and hugging a striped blanket',
}

const tsismisPortrait = {
  src: lgTsismis,
  alt: 'LG, the Tsismis mascot, smiling with a finger to her lips',
}

export const LG_POSES = {
  limt: {
    fallback: limtPortrait,
  },
  tsismis: {
    fallback: tsismisPortrait,
  },
}
