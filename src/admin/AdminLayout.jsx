import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/dashboard.css'

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const initials = (user?.email || '?').slice(0, 2).toUpperCase()

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <div className="dash-brand-mark">bG</div>
          <div className="dash-brand-name">bakedGoods <span>CRM</span></div>
        </div>

        <div className="dash-identity">
          <div className="dash-avatar dash-avatar--neutral">{initials}</div>
          <div>
            <div className="dash-identity-name">{user?.email}</div>
            <div className="dash-identity-role">Admin</div>
          </div>
        </div>

        <nav className="dash-nav">
          <NavLink to="/admin/clients" className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}>
            Clients
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}>
            Orders &amp; Invoices
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}>
            Products
          </NavLink>
        </nav>

        <div className="dash-sidebar-footer">
          <button className="dash-signout" onClick={signOut}>Sign out</button>
        </div>
      </aside>

      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  )
}
