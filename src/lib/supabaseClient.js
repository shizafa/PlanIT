import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase env vars are missing — auth will not work until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local (see .env.example).',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
