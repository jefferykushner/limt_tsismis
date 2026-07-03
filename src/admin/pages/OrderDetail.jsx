import { Link, useParams } from 'react-router-dom'

export default function OrderDetail() {
  const { id } = useParams()
  return (
    <div>
      <Link to="/admin/orders" className="dash-link-back">← All orders</Link>
      <div className="dash-empty">
        <p>The invoice builder isn't wired up yet — that's the next phase.</p>
        {id !== 'new' && <p style={{ marginTop: 8, color: 'var(--graphite)' }}>Order ID: {id}</p>}
      </div>
    </div>
  )
}
