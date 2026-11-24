-- Applied to bakedCRM on 2026-11-23. Photos for the eight featured filler items
-- (originals in design/images/, web copies in public/images/menu/).
update public.products p set image_url = v.url
from (values
  ('Signature Fudgy Brownies', '/images/menu/signature-fudgy-brownies.webp'),
  ('Brown Butter Chocolate Chunk Cookies', '/images/menu/brown-butter-chocolate-chunk-cookies.webp'),
  ('Brown Butter Sea Salt Brownies', '/images/menu/brown-butter-sea-salt-brownies.webp'),
  ('Raspberry Swirl Brownies', '/images/menu/raspberry-swirl-brownies.webp'),
  ('Ube Cheesecake Brownies', '/images/menu/ube-cheesecake-brownies.webp'),
  ('Ube Crinkle Cookies', '/images/menu/ube-crinkle-cookies.webp'),
  ('Mango Float Cups', '/images/menu/mango-float-cups.webp'),
  ('Ensaymada with Queso de Bola', '/images/menu/ensaymada-queso-de-bola.webp')
) as v(name, url)
where p.name = v.name and p.is_placeholder and p.archived_at is null;
