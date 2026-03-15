// app/api/vip/activate/route.js
// Этот роут вызывается платёжным шлюзом после успешной оплаты (webhook)
// Также может вызываться вручную из админки

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // service key — только на сервере!
)

// Количество дней для каждого тарифа
const PLAN_DAYS = {
  vip_3:  3,
  vip_7:  7,
  vip_14: 14,
  vip_30: 30,
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { listing_id, plan_id, payment_id, secret } = body

    // ── Защита ──────────────────────────────────────────────────────────────
    // Для ручной активации из админки — проверяем секрет
    // Для платёжного шлюза — здесь будет проверка подписи webhook
    if (secret && secret !== process.env.ADMIN_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Считаем дату истечения ───────────────────────────────────────────────
    const days = PLAN_DAYS[plan_id]
    if (!days) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const expiry = new Date()
    expiry.setDate(expiry.getDate() + days)
    const vipExpiry = expiry.toISOString()

    // ── Обновляем в Supabase ─────────────────────────────────────────────────
    const { error } = await supabase
      .from('listings')
      .update({
        vip:        true,
        vip_expiry: vipExpiry,
        vip_plan:   plan_id,
        payment_id: payment_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listing_id)

    if (error) throw error

    // ── Логируем в таблицу vip_logs ──────────────────────────────────────────
    await supabase.from('vip_logs').insert({
      listing_id,
      plan_id,
      payment_id: payment_id || null,
      activated_at: new Date().toISOString(),
      expires_at:   vipExpiry,
      method: secret ? 'manual' : 'payment',
    })

    return Response.json({
      success: true,
      message: `VIP activated for ${days} days`,
      expires: vipExpiry,
    })

  } catch (err) {
    console.error('VIP activate error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// GET — проверить статус VIP объявления
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const listing_id = searchParams.get('listing_id')

  if (!listing_id) {
    return Response.json({ error: 'listing_id required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('listings')
    .select('id, vip, vip_expiry, vip_plan')
    .eq('id', listing_id)
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const daysLeft = data.vip_expiry
    ? Math.ceil((new Date(data.vip_expiry) - new Date()) / (1000*60*60*24))
    : null

  return Response.json({ ...data, days_left: daysLeft })
}
