# LG pose library

Original LG images supplied by Jeffery on 25 Nov 2026, cut from his pose sheets so each pose can be used on its own. Like everything in `design/images/`, the site never loads from here. When a pose is used, it is cut out of the white background, resized and saved as WebP in `src/assets/lg/`.

## Folders

- `sheets/`: the untouched originals, kept for reference.
- `photo/`: single poses in the photographic style, 19 cut from two sheets plus one stand-alone image.
- `stickers/`: 30 single stickers in the pink birthday style, cut from the sticker sheet on a grid. Some edges include a sliver of the next sticker; the cut-out step removes it.

## Three styles: where each fits

| Style | Files | Best use |
| --- | --- | --- |
| Hand-drawn watercolour (logos, batches 1–2) | `src/assets/lg/` | The site's main voice, used in both brands |
| Photographic, ivory dress | `photo/` | Playful accents: the About page, empty states, 404, "added to order" moments, Tsismis peeking and secret gags |
| Glossy pink stickers | `stickers/` | A birthday and celebration orders section, promos, the ticker, social posts. Not for the main pages, where the pink outfits clash with LG's ivory dress |

Use one style per section so the site doesn't feel mixed.

## Resolution

These sheets are small, so each single pose is only about 250 × 520 px for the photos and 220 × 260 px for the stickers. That is enough for small accents (up to about 200 px wide on screen) but not for anything large. Any pose that becomes a hero or large feature should be regenerated alone at about 2048 px.

`sheet-photo-see-hear-speak-no-tsismis.jpg` (508 × 339) and `sheet-photo-secret-poses-small.jpg` (450 × 360) are too small to cut up. Their ideas, such as "see no / hear no / speak no tsismis", the TOP SECRET bag, the "Psst" notes and the "Who, me?" chalkboard, are great Tsismis material and should be regenerated at full size.

## Photo poses

| File | Pose | Suggested use |
| --- | --- | --- |
| lg-photo-wall-breakthrough-cupcake.png | Bursts through a wall, holding out a cupcake (1402 × 1122, cream background) | 404 page, "new item" announcement, promo banner |
| lg-photo-cabinet-peek.png | Peeks out from behind a cabinet | Tsismis: "psst" moments |
| lg-photo-cookie-jar-raid.png | Hands in the cookie jar | Cookies category, "caught you" empty cart |
| lg-photo-shh-wink.png | Finger to lips, winking | Tsismis hero or story |
| lg-photo-mixing-bowl.png | Stirring a bowl, flour sack beside | Made-fresh or how-we-bake section |
| lg-photo-cake-sneak.png | Sneaking a fingerful of cake | Cakes and custom orders |
| lg-photo-cupboard-hide.png | Hiding in a cupboard with a spoon | Tsismis gag |
| lg-photo-flour-mess.png | Sitting in flour, covered and laughing | Empty states, "oops" errors |
| lg-photo-sugar-sneak.png | Crouching by a sugar sack | Tsismis gag |
| lg-photo-wall-giggle.png | Leaning on a wall, giggling | Tsismis eavesdropping |
| lg-photo-wall-peek.png | Peeking around a wall edge | Tsismis: "did you hear?" |
| lg-photo-giggle-hands.png | Both hands over her mouth, giggling | Tsismis: "I can't say!" |
| lg-photo-whisk-cheer.png | Cheering with a whisk | Order confirmed |
| lg-photo-bunny-hug.png | Hugging a plush bunny | About, gentle LIMT moment |
| lg-photo-blanket-hood.png | Striped blanket over her head, winking (echoes the LIMT logo) | LIMT story section |
| lg-photo-coy-lean.png | Coy lean, hands behind her back | Tsismis "who, me?" |
| lg-photo-sitting-clap.png | Sitting and clapping | Thank-you or confirmation |
| lg-photo-basket-peek.png | Peeking out of a woven basket | Tsismis: hiding from the secret |
| lg-photo-blow-kiss.png | Blowing a kiss | Footer sign-off, thank-you |
| lg-photo-flower-bouquet.png | Holding a bouquet | Gifts, Mother's Day, thank-you |

## Stickers

Read across the sheet, row by row: birthday-girl-heart, sitting-bow, crown-chin-hands, teddy-hug, heart-sunglasses-dance, giggle-clap, birthday-candles, gift-box-pop, daisy-bouquet, balloons, cookie-munch, bunny-snuggle, yay, sweet-cake-smash, gift-hug, boba-sunglasses, make-a-wish, cupcake-hug, crown-daydream, party-time, blow-kiss, gift-stack, sun-hat, hugs-heart, love-you-sign, cake-candle, flower-crown, heart-purse, cake-mode-on, another-year-of-magic. Each file is `stickers/lg-sticker-<name>.png`.

Nine stickers have text baked in: Birthday Girl, Yay!, Sweet, Make a Wish!, Party Time!, Hugs!, Love You!, Cake Mode ON!, Another year of Magic! These suit birthday promos, not general pages.
