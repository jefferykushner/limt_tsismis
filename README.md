# Love in My Tummy × Tsismis

Website and back office for **Love in My Tummy Artisan Sweets**, Carolyn's small-batch bakery, and its Filipino-inspired sister brand **Tsismis**. The public site can switch between the two brands; the back office handles clients, quotes, invoices and the product catalog.

## Stack

- **Front end:** React 19 + Vite, React Router
- **Data and logins:** Supabase (project `bakedCRM`)
- **Hosting:** Netlify (`limt-tsismis`), built from `main`

## Running it locally

```bash
npm install
cp .env.example .env   # then fill in the two Supabase values
npm run dev
```

The site needs two environment variables, set in `.env` locally and in Netlify's site settings for deploys:

| Variable | Where to find it |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API (the public "anon" key) |

## Where things live

| Path | What it is |
| --- | --- |
| `src/pages/` | Public pages: home (LIMT and Tsismis), menu, order, login, not found |
| `src/brand/` | Brand switching: `BrandContext` (reads `/tsismis` from the URL), `brandPaths`, LG pose registry |
| `src/components/` | Nav, footer, the `LG` mascot component, featured collections |
| `src/admin/` | Back office: clients, orders/invoices, products, printable invoice |
| `src/account/` | Customer portal: a client's own orders |
| `src/styles/tokens.css` | Colours, type, spacing and shared button styles |
| `supabase/migrations/` | Database changes, in the order they were applied |

## Routes

| URL | Page |
| --- | --- |
| `/`, `/tsismis` | Home page for each brand |
| `/menu`, `/tsismis/menu` | Menu |
| `/order`, `/tsismis/order` | How to order |
| `/login` | Staff and client login |
| `/admin/...` | Back office (staff only) |
| `/account/...` | Customer portal (signed-in clients) |

## Working on it

Changes go on a branch and into `main` through a pull request, so Netlify builds a preview to check before anything goes live. Database changes are saved as SQL files in `supabase/migrations/` with the date they were applied.
