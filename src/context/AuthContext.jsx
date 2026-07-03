import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [clientRecord, setClientRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadRole = async (session) => {
    if (!session) {
      setIsAdmin(false)
      setClientRecord(null)
      return
    }

    const [{ data: staffRow }, { data: clientRow }] = await Promise.all([
      supabase.from('staff').select('user_id').eq('user_id', session.user.id).maybeSingle(),
      supabase.from('clients').select('*').eq('user_id', session.user.id).maybeSingle(),
    ])

    setIsAdmin(!!staffRow)
    setClientRecord(clientRow || null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      await loadRole(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      await loadRole(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  const value = {
    session,
    user: session?.user ?? null,
    isAdmin,
    clientRecord,
    loading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
