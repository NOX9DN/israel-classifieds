// app/api/vip/expire/route.js
// Cron-job — вызывается каждую ночь в 00:00
// Снимает VIP со всех объявлений у которых истёк срок
//
// Настройка cron в vercel.json:
// {
//   "crons": [{ "path": "/api/vip/expire", "schedule": "0 0 * * *" }]
// }

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function GET(request) {
  // Защита — только Vercel Cron или запрос с секретом
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const authHeader = request.headers.get('authorization')

  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
  const isManual     = secret === process.env.ADMIN_SECRET

  if (!isVercelCron && !isManual) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date().toISOString()

    // Находим все VIP объявления с истёкшим сроком
    const { data: expired, error: fetchError } = await supabase
      .from('listings')
      .select('id, title, vip_expiry')
      .eq('vip', true)
      .lt('vip_expiry', now)

    if (fetchError) throw fetchError

    if (expired.length === 0) {
      return Response.json({ success: true, expired: 0, message: 'No VIP to expire' })
    }

    // Снимаем VIP
    const ids = expired.map(l => l.id)
    const { error: updateError } = await supabase
      .from('listings')
      .update({
        vip:        false,
        vip_expiry: null,
        vip_plan:   null,
        updated_at: now,
      })
      .in('id', ids)

    if (updateError) throw updateError

    // Логируем
    const logs = expired.map(l => ({
      listing_id:  l.id,
      plan_id:     null,
      activated_at: null,
      expires_at:  l.vip_expiry,
      expired_at:  now,
      method:      'auto_expire',
    }))
    await supabase.from('vip_logs').insert(logs)

    console.log(`VIP expired for ${expired.length} listings:`, ids)

    return Response.json({
      success: true,
      expired: expired.length,
      ids,
    })

  } catch (err) {
    console.error('VIP expire error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
