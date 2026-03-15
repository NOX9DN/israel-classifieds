import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Клиентский клиент — для браузера (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Серверный клиент — только для API роутов и Server Components (service_role key)
// НИКОГДА не используй на клиенте — key секретный
export function createServerClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
