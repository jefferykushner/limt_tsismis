import { useState, useRef, useEffect } from 'react'
import { useRevealAll } from '../hooks/useReveal'
import './MenuPage.css'

/* ── Menu data ───────────────────────────────────────────── */
const MENU = {
  limt: {
    sections: [
      {
        id: 'limt-breads',
        label: 'Breads & Loaves',
        heading: ['Breads', '& Loaves'],
        headingItalic: 1,
        subtitle: 'Slow-fermented, made small-batch. Best enjoyed the day they are baked.',
        items: [
          { name: 'Classic Sourdough', price: '$12', desc: 'Open crumb, crisp crust, long cold ferment. Scored with a simple leaf — nothing flashy, just honest bread.', tags: [{ label: 'Signature', type: 'brand' }, { label: 'Vegan', type: 'note' }] },
          { name: 'Ube Swirl Milk Bread', price: '$14', desc: 'Pillowy Japanese-style pull-apart loaf ribboned with roasted ube halaya. Lavender-purple inside, golden outside.', tags: [{ label: 'Bestseller', type: 'brand' }] },
          { name: 'Cheddar & Scallion Focaccia', price: '$11', desc: 'Sheet-pan focaccia, olive oil–dimpled and blistered, finished with aged white cheddar and fresh scallion.', tags: [{ label: 'Vegetarian', type: 'note' }] },
          { name: 'Pan de Sal (half-dozen)', price: '$9', desc: 'Soft, lightly sweetened Filipino dinner rolls dusted in fine breadcrumbs. Baked fresh each morning order.', tags: [{ label: 'Dairy-free option available', type: 'note' }] },
          { name: 'Malunggay & Garlic Loaf', price: '$13', desc: 'Whole-wheat sandwich loaf with dried moringa (malunggay) and roasted garlic. Earthy, fragrant, and quietly nutritious.', tags: [] },
        ],
      },
      {
        id: 'limt-sweets',
        label: 'Sweets',
        heading: ['Sweet', 'Things'],
        headingItalic: 0,
        subtitle: 'Treats worth slowing down for.',
        items: [
          { name: 'Ube Crinkle Cookies (6)', price: '$10', desc: 'Fudgy, crackled, rolled in powdered sugar. Vivid purple inside with a deep ube-halaya richness.', tags: [{ label: 'Fan Favourite', type: 'brand' }] },
          { name: 'Bibingka Loaf Cake', price: '$18', desc: 'Rice flour base, coconut milk, salted egg, and kesong puti — a holiday classic in everyday loaf form. Topped with fresh grated coconut.', tags: [{ label: 'Limited', type: 'seasonal' }, { label: 'Gluten-free', type: 'note' }] },
          { name: 'Brown Butter Snickerdoodles (6)', price: '$9', desc: 'Chewy-centred, crisp-edged, rolled in cinnamon sugar. Brown butter gives them a faint toffee note that plain butter never could.', tags: [] },
          { name: 'Basque Cheesecake (6-inch)', price: '$28', desc: 'Deeply caramelised top, creamy centre that barely sets. Served at room temperature. One of those things you will make excuses to order again.', tags: [{ label: 'Signature', type: 'brand' }] },
          { name: 'Pandan Chiffon Cake (6-inch)', price: '$22', desc: 'Light, fragrant, and the colour of a garden. Fresh pandan extract, coconut cream frosting, toasted coconut on top.', tags: [] },
        ],
      },
      {
        id: 'limt-savoury',
        label: 'Savoury',
        heading: ['Savoury', 'Bakes'],
        headingItalic: 1,
        subtitle: 'The half of the menu people are always surprised to love.',
        items: [
          { name: 'Chicken Empanadas (3)', price: '$13', desc: 'Flaky hand-crimped pastry filled with garlicky chicken, potato, raisins, and a hint of sweetness. The way your lola made them.', tags: [{ label: 'Bestseller', type: 'brand' }] },
          { name: 'Mushroom & Leek Quiche', price: '$16', desc: 'Buttery blind-baked shell, custard filling, roasted cremini and leeks, a scatter of fresh thyme.', tags: [{ label: 'Vegetarian', type: 'note' }, { label: 'Slice: $5', type: 'note' }] },
          { name: 'Ensaymada (2)', price: '$11', desc: 'Soft brioche-like rolls heaped with butter, sugar, and aged Edam. The Filipino version of a Danish — better than it sounds.', tags: [] },
          { name: 'Cheese & Herb Scones (4)', price: '$12', desc: 'Tall, flaky, and sharp. Old cheddar, rosemary, cracked black pepper. Good warm, better cold with a bit of butter.', tags: [] },
        ],
      },
      {
        id: 'limt-seasonal',
        label: 'Seasonal',
        heading: ['In Season', 'Right Now'],
        headingItalic: 1,
        subtitle: 'These rotate. When they\'re gone, they\'re gone.',
        items: [
          { name: 'Strawberry Cream Cheese Danish', price: '$5 each', desc: 'Laminated dough, whipped cream cheese, and fresh Ontario strawberries glazed with a light jam. Summer in a pastry.', tags: [{ label: 'June Only', type: 'seasonal' }] },
          { name: 'Peach & Cardamom Galette (8-inch)', price: '$24', desc: 'Rough-edged, unfussy, and gorgeous. Almond frangipane base, ripe peaches, cardamom sugar, a dusting of raw almonds.', tags: [{ label: 'Summer', type: 'seasonal' }] },
        ],
        cta: true,
      },
    ],
  },
  tsismis: {
    sections: [
      {
        id: 'tsismis-pasalubong',
        label: 'Pasalubong',
        heading: ['Pasalubong', 'Boxes'],
        headingItalic: 1,
        subtitle: 'You didn\'t hear this from us — but these make incredible gifts.',
        items: [
          { name: 'Tsismis Classic Box', price: '$38', desc: 'A curated mix of our Filipino-inspired bakes: ube crinkles, pan de sal, polvoron, and barquillos. Tied and labelled. Ready to give.', tags: [{ label: 'Gift-ready', type: 'brand' }] },
          { name: 'Sweets Only Box', price: '$32', desc: 'For the one with a sweet tooth. Polvoron, yema balls, pastillas de leche, and a bonus seasonal cookie.', tags: [{ label: 'Gift-ready', type: 'brand' }] },
          { name: 'Build Your Own Box', price: 'From $28', desc: 'Choose your own combination from any available items. Add a handwritten note. We\'ll take care of the rest.', tags: [{ label: 'Custom', type: 'brand' }] },
        ],
      },
      {
        id: 'tsismis-lambing',
        label: 'Lambing Sweets',
        heading: ['Lambing', 'Sweets'],
        headingItalic: 0,
        subtitle: 'Lambing means tender, affectionate, a little bit spoiling. That\'s the brief.',
        items: [
          { name: 'Polvoron (6)', price: '$10', desc: 'Toasted flour, powdered milk, sugar, butter — pressed into a shape that crumbles the moment it hits your tongue. Classic, plain, or ube.', tags: [{ label: 'Bestseller', type: 'brand' }, { label: 'Choice of flavour', type: 'note' }] },
          { name: 'Yema Balls (6)', price: '$9', desc: 'Candied egg-yolk confections: silky, sweet, and rich. Each one is hand-rolled and wrapped in cellophane twist.', tags: [] },
          { name: 'Pastillas de Leche (6)', price: '$8', desc: 'Milk candy from Bulacan. Just milk, sugar, and patience. Cut into cylinders, rolled in sugar, wrapped in parol-style paper.', tags: [{ label: 'Traditional', type: 'brand' }] },
          { name: 'Ube Halaya Tart (4-inch)', price: '$16', desc: 'Butter tart shell, thick hand-stirred ube halaya, coconut cream rosette. Filipino purple in its finest form.', tags: [{ label: 'Signature', type: 'brand' }] },
          { name: 'Barquillos (tin of 10)', price: '$12', desc: 'Rolled wafer tubes, paper-thin and crisp, with a faint vanilla sweetness. The snack your grandparents kept in a tin on the counter.', tags: [] },
        ],
      },
      {
        id: 'tsismis-meryenda',
        label: 'Meryenda',
        heading: ['Meryenda', 'Snacks'],
        headingItalic: 1,
        subtitle: 'The Filipino afternoon snack hour is non-negotiable. We support this fully.',
        items: [
          { name: 'Turon (3)', price: '$9', desc: 'Banana and jackfruit rolled in lumpia wrappers, fried until caramelised gold. Exactly what you want at 3pm.', tags: [{ label: 'Fried', type: 'brand' }, { label: 'Vegan', type: 'note' }] },
          { name: 'Palitaw (4)', price: '$10', desc: 'Flat rice cakes that float to the surface when cooked — hence the name. Rolled in coconut, sugar, and toasted sesame.', tags: [{ label: 'Gluten-free', type: 'note' }, { label: 'Vegan', type: 'note' }] },
          { name: 'Puto (6)', price: '$11', desc: 'Steamed rice muffins. Soft and barely sweet, topped with a sliver of salted butter or a slice of kesong puti.', tags: [{ label: 'Choice of topping', type: 'note' }] },
          { name: 'Kutsinta (4)', price: '$9', desc: 'Brown sugar steamed cakes with a satisfying chew. Served with freshly grated coconut on the side. Deeply underrated.', tags: [{ label: 'Hidden Gem', type: 'brand' }, { label: 'Vegan', type: 'note' }] },
        ],
        cta: true,
      },
    ],
  },
}

/* ── Sub-components ──────────────────────────────────────── */
function Tag({ label, type, brand }) {
  return (
    <span className={`menu-tag menu-tag--${type} menu-tag--${brand}`}>
      {label}
    </span>
  )
}

function MenuItem({ item, brand }) {
  return (
    <div className={`menu-item menu-item--${brand}`}>
      <span className="menu-item__name">{item.name}</span>
      <span className="menu-item__price">{item.price}</span>
      <p className="menu-item__desc">{item.desc}</p>
      {item.tags.length > 0 && (
        <div className="menu-item__tags">
          {item.tags.map(t => <Tag key={t.label} {...t} brand={brand} />)}
        </div>
      )}
    </div>
  )
}

function OrderCTA({ brand }) {
  const isLimt = brand === 'limt'
  return (
    <div className="menu-cta">
      <p className="menu-cta__eyebrow">
        {isLimt ? 'Place a Custom Order' : 'Catering & Events'}
      </p>
      <h3 className="menu-cta__heading">
        {isLimt ? 'Something special in mind?' : 'Feeding a crowd?'}
      </h3>
      <p className="menu-cta__body">
        {isLimt
          ? 'Celebrate with a custom cake, gift box, or event order. We would love to make something just for you.'
          : 'Custom meryenda spreads, pasalubong stations, and event catering. Tell us what you\'re planning and we\'ll make it happen.'}
      </p>
      <a href="/order" className={`btn ${isLimt ? 'btn--blush' : 'btn--ube'}`}>
        {isLimt ? 'Request a Quote' : 'Get in Touch'}
      </a>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MenuPage
   ══════════════════════════════════════════════════════════ */
export default function MenuPage() {
  const [activeBrand, setActiveBrand] = useState('limt')
  const [activeTab, setActiveTab] = useState('limt-breads')
  const pageRef = useRevealAll()

  const switchBrand = (brand) => {
    setActiveBrand(brand)
    const firstSection = MENU[brand].sections[0].id
    setActiveTab(firstSection)
    document.getElementById(firstSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToSection = (id, brand) => {
    if (brand !== activeBrand) switchBrand(brand)
    setActiveTab(id)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const currentMenu = MENU[activeBrand]

  return (
    <div ref={pageRef}>

      {/* ── Brand header ──────────────────────────────────── */}
      <header className="menu-header">
        <p className="menu-header__eyebrow">Handcrafted in Toronto · Order for pickup or delivery</p>
        <div className="menu-header__lockup">
          <button
            className={`brand-pill brand-pill--limt ${activeBrand === 'limt' ? 'active' : ''}`}
            onClick={() => switchBrand('limt')}
          >
            <span className="brand-pill__name">Love in My Tummy</span>
          </button>
          <div className="brand-divider" aria-hidden="true" />
          <button
            className={`brand-pill brand-pill--tsismis ${activeBrand === 'tsismis' ? 'active' : ''}`}
            onClick={() => switchBrand('tsismis')}
          >
            <span className="brand-pill__name">Tsismis</span>
          </button>
        </div>
      </header>

      {/* ── Sticky section nav ────────────────────────────── */}
      <nav className="menu-nav" aria-label="Menu sections">
        <div className="menu-nav__inner">
          {Object.entries(MENU).flatMap(([brand, data]) =>
            data.sections.map(s => (
              <button
                key={s.id}
                className={`menu-nav__tab ${activeTab === s.id ? 'active' : ''} menu-nav__tab--${brand} ${activeBrand !== brand ? 'dimmed' : ''}`}
                onClick={() => scrollToSection(s.id, brand)}
                data-brand={brand}
              >
                {s.label}
              </button>
            ))
          )}
        </div>
      </nav>

      {/* ── Menu content ──────────────────────────────────── */}
      <main className="menu-main">
        {currentMenu.sections.map((section) => (
          <section key={section.id} id={section.id} className="menu-section">

            <div className={`whisper whisper--${activeBrand}`}>
              <div className="whisper__line" />
              <span className="whisper__label">
                {activeBrand === 'limt' ? 'Love in My Tummy' : 'Tsismis'}
              </span>
              <div className="whisper__line" />
            </div>

            <h2 className="menu-section__heading">
              {section.heading[0]}{' '}
              {section.headingItalic === 1
                ? <em>{section.heading[1]}</em>
                : section.heading[1]}
            </h2>
            <p className="menu-section__subtitle">{section.subtitle}</p>

            {section.items.map(item => (
              <MenuItem key={item.name} item={item} brand={activeBrand} />
            ))}

            {section.cta && <OrderCTA brand={activeBrand} />}
          </section>
        ))}

        <div className="menu-allergen">
          <strong>Allergen Information</strong>
          All items are prepared in a home kitchen that handles wheat, eggs, dairy, tree nuts, and sesame.
          Please reach out before ordering if you have a severe allergy. Gluten-free and dairy-free options
          are noted but produced in a shared environment.
        </div>
      </main>

    </div>
  )
}
