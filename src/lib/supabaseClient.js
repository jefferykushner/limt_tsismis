import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const missingConfig = !supabaseUrl || !supabaseAnonKey

if (missingConfig) {
  console.error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
    'in your .env file (local) or Netlify site settings (deployed). ' +
    'Login and account/admin features will not work until this is fixed, ' +
    'but the rest of the site will still render.'
  )
}

// Falls back to harmless placeholder values so createClient() never throws
// and takes down the whole app (including public pages that don't need auth
// at all) just because Supabase isn't configured yet.
export const supabase = createClient(
  missingConfig ? 'https://placeholder.supabase.co' : supabaseUrl,
  missingConfig ? 'placeholder-key' : supabaseAnonKey
)
