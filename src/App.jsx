import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminRoute, CustomerRoute } from './routes/RoleRoutes'
import Nav from './components/Nav'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import Login from './pages/Login'

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

function PublicLayout({ children }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="auth-loading">Loading…</div>}>
          <Routes>
            {/* Public marketing site */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
            <Route path="/login" element={<Login />} />

            {/* Admin back office */}
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

            {/* Customer portal */}
            <Route path="/account" element={<CustomerRoute />}>
              <Route element={<AccountLayout />}>
                <Route index element={<MyOrders />} />
                <Route path="orders" element={<MyOrders />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
