import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/dashboard.css'

export default function AccountLayout() {
  const { user, clientRecord, signOut } = useAuth()
  const initials = (clientRecord?.name || user?.email || '?').slice(0, 2).toUpperCase()

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <div className="dash-brand-mark">bG</div>
          <div className="dash-brand-name">Love in My Tummy <span>&amp; Tsismis</span></div>
        </div>

        <div className="dash-identity">
          <div className="dash-avatar dash-avatar--blush">{initials}</div>
          <div>
            <div className="dash-identity-name">{clientRecord?.name || user?.email}</div>
            <div className="dash-identity-role">Client Account</div>
          </div>
        </div>

        <nav className="dash-nav">
          <NavLink to="/account/orders" className={({ isActive }) => `dash-nav-link ${isActive ? 'active' : ''}`}>
            My Orders
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
