import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmnrrzvzatatdpgrnxpt.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_tnf-AIph6ymAuUM66_A02g_0Rd0OyGz'

export const supabase = createClient(supabaseUrl, supabaseKey)