import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BrandProvider } from './brand/BrandContext'
import { AdminRoute, CustomerRoute } from './routes/RoleRoutes'
import PublicLayout from './components/PublicLayout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import Login from './pages/Login'
import OrderPage from './pages/OrderPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

// LG's shared circle-breakout mechanic.
import './components/lg-mascot.css'

// Admin and account sections are lazy-loaded so their code never
// ships to public visitors browsing the marketing site.
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const Clients = lazy(() => import('./admin/pages/Clients'))
const ClientDetail = lazy(() => import('./admin/pages/ClientDetail'))
const Orders = lazy(() => import('./admin/pages/Orders'))
const OrderDetail = lazy(() => import('./admin/pages/OrderDetail'))
const Products = lazy(() => import('./admin/pages/Products'))

const AccountLayout = lazy(() => import('./account/AccountLayout'))
const MyOrders = lazy(() => import('./account/pages/MyOrders'))
const OrderView = lazy(() => import('./account/pages/OrderView'))

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* BrandProvider needs useLocation, so it must be inside
            BrowserRouter. It wraps everything below it because admin,
            account, and login all still need SOME brand active (even if
            that's just "limt" as the default) for shared components like
            <LG /> to resolve a pose without special-casing. */}
        <BrandProvider>
          <Suspense fallback={<div className="auth-loading">Loading…</div>}>
            <Routes>
              {/* LIMT — the default public experience */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
              <Route path="/order" element={<PublicLayout><OrderPage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />

              {/* Tsismis — its own distinct shell, same MenuPage component
                  (it reads the active brand from BrandContext, which
                  resolves from the /tsismis prefix, so no separate menu
                  component is needed here). */}
              <Route path="/tsismis" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/tsismis/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
              <Route path="/tsismis/order" element={<PublicLayout><OrderPage /></PublicLayout>} />
              <Route path="/tsismis/about" element={<PublicLayout><AboutPage /></PublicLayout>} />

              <Route path="/login" element={<Login />} />

              {/* Admin back office — unchanged */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Clients />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/:id" element={<ClientDetail />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="orders/:id" element={<OrderDetail />} />
                  <Route path="products" element={<Products />} />
                </Route>
              </Route>

              {/* Customer portal — unchanged */}
              <Route path="/account" element={<CustomerRoute />}>
                <Route element={<AccountLayout />}>
                  <Route index element={<MyOrders />} />
                  <Route path="orders" element={<MyOrders />} />
                  <Route path="orders/:id" element={<OrderView />} />
                </Route>
              </Route>

              <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
            </Routes>
          </Suspense>
        </BrandProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}
