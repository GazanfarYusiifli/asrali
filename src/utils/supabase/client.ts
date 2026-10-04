import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gyklrvsnldpduwrngkjg.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_B1v_7FSA0PS2kNnN7g23Xg_PvBE43aN'
  )
}
