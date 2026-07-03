import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import './Login.css'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { data, error } = await signIn(email, password)
    if (error) {
      setSubmitting(false)
      setError('Email or password not recognized. Please try again.')
      return
    }

    // Check staff membership directly rather than reading it off context —
    // the context's role lookup runs async off the auth-state-change event,
    // so it may not have resolved yet at this exact moment.
    const { data: staffRow } = await supabase
      .from('staff')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle()

    setSubmitting(false)
    const destination = staffRow ? '/admin' : (from || '/account')
    navigate(destination, { replace: true })
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <span className="login-kicker">Welcome back</span>
          <h1>Love in My Tummy <em>&amp;</em> Tsismis</h1>
          <p>Sign in to manage your orders and invoices.</p>
        </div>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="login-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="login-error">{error}</div>}

        <button className="btn btn--filled login-submit" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
