-- Applied to bakedCRM on 2026-11-23. Warmer, team-voice copy for categories and the filler menu.
update public.categories c set subtitle = v.s, subtitle_tsismis = v.t from (values
  ('Brownies', 'Crackly on top, fudgy all the way through. The reason most people find us.', 'Everyone''s talking about them. For good reason.'),
  ('Gourmet Cookies', 'Crisp at the edges, soft in the middle, never from a mix.', 'Crumbs on your shirt are evidence. We won''t tell.'),
  ('Bars & Squares', 'Cut from the pan, made for sharing (or not).', 'Cut into squares, shared in secret.'),
  ('Filipino Favourites', 'The flavours of home: ube, mango, coconut and caramel.', 'The flavours of home. Loud and proud.'),
  ('Cheesecakes', 'Rich, creamy, and worth the fork fight.', 'Rich, creamy, and worth the fork fight.'),
  ('Boxes & Gifting', 'A little of everything, boxed up for someone you love (you count).', 'Bring one to the party and you''ll be the story.')
) as v(name, s, t) where c.name = v.name;
update public.products p set description = v.d from (values
  ('Signature Fudgy Brownies', 'The one that started it all. Dark chocolate, good butter, a paper-thin crackly top and a middle so fudgy it bends.'),
  ('Brown Butter Sea Salt Brownies', 'We brown the butter until the whole kitchen smells like toffee, then finish every square with flaky salt. Sweet, salty, gone.'),
  ('Raspberry Swirl Brownies', 'Fresh raspberries cooked down and swirled through dark chocolate. Tart, glossy, a little bit pink, and completely real.'),
  ('Ube Cheesecake Brownies', 'Fudgy chocolate on the bottom, creamy ube cheesecake on top. Purple, proud and a little dramatic.'),
  ('Espresso Hazelnut Brownies', 'Fresh espresso and toasted hazelnuts folded into fudgy chocolate. For the grown-ups, and the kids who act like grown-ups.'),
  ('Brown Butter Chocolate Chunk Cookies', 'Thick, chewy and golden at the edges, with pools of melted dark chocolate and a pinch of salt. The cookie you remember from somewhere, only better.'),
  ('Pistachio Rose Shortbread', 'Buttery, crumbly shortbread with real pistachios and the gentlest whisper of rose. Fancy, but it doesn''t make a fuss.'),
  ('Strawberry Shortcake Cookies', 'Soft vanilla cookies baked with real strawberries. They taste like the first warm day of June.'),
  ('Ube Crinkle Cookies', 'Soft and chewy, rolled in powdered sugar until they crack open in the oven. They''ll leave sugar on your shirt. Worth it.'),
  ('Calamansi Sugar Cookies', 'Crisp at the edges and bright with fresh calamansi juice and zest. Sunshine, but crunchy.'),
  ('Black Sesame Miso Cookies', 'Nutty, salty-sweet and a little unexpected. For people who say they don''t really like sweets. (They do now.)'),
  ('Ube Halaya Swirl Bars', 'A buttery shortbread base under a silky layer swirled with homemade ube halaya. Pretty enough to stare at, too good to wait.'),
  ('Lemon Curd Bars', 'A crumbly shortbread crust and a curd made from real lemons, squeezed by hand. Puckery in the very best way.'),
  ('Salted Caramel Blondies', 'Brown sugar blondies with ribbons of homemade salted caramel. Chewy, buttery and frankly dangerous.'),
  ('Mango Float Cups', 'Layers of graham, cream and ripe mango, chilled until spoonable. Summer in a cup, any time of year.'),
  ('Leche Flan Cheesecake Bites', 'Silky leche flan baked on creamy cheesecake and finished with amber caramel. Two favourites, one perfect bite.'),
  ('Buko Pandan Cream Tarts', 'Young coconut and fragrant pandan cream in buttery little tart shells. Cool, light, and very easy to eat three of.'),
  ('Ensaymada with Queso de Bola', 'Soft, buttery brioche coils, sugared and snowed with grated queso de bola. Best eaten the day they''re made, which is never a problem.'),
  ('Turon Bites with Caramel', 'Banana and jackfruit wrapped in crisp pastry and caramelised until they crackle. The street-corner favourite, party-sized.'),
  ('Biko Squares', 'Sticky rice slow-cooked in coconut milk and brown sugar, crowned with golden latik. Chewy, rich and deeply comforting.'),
  ('Basque Burnt Cheesecake', 'Burnished and caramelised outside, barely set and creamy inside. It''s meant to look like that. Serves 6 to 8, or 2 very good friends.'),
  ('Brownie Cheesecake Slab', 'Our fudgy brownie base under a layer of vanilla bean cheesecake. Two desserts, zero compromise.'),
  ('The Gossip Box', 'A little of everything worth talking about: brownies, cookies and bars, picked fresh from that day''s bake.'),
  ('Pasalubong Box', 'Filipino favourites to bring home or bring along: ube crinkles, ensaymada, turon bites and more. Instantly the favourite guest.')
) as v(name, d) where p.name = v.name and p.is_placeholder and p.archived_at is null;
