import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const supabase = createAdminClient()

    const allowed: Record<string, unknown> = { id: 1, updated_at: new Date().toISOString() }
    const fields = ['title', 'date_iso', 'url', 'min_plan', 'active'] as const
    for (const key of fields) {
      if (body[key] !== undefined) allowed[key] = body[key]
    }

    const { error } = await supabase.from('meet_config').upsert(allowed)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // TELEGRAM BROADCAST
    if (allowed.active && allowed.url && allowed.date_iso) {
      try {
        const { data: config } = await supabase.from('bot_config').select('telegram_bot_token').eq('id', 1).single()
        const groupsEnv = process.env.TELEGRAM_BROADCAST_GROUPS
        
        if (config?.telegram_bot_token && groupsEnv) {
          const groups = groupsEnv.split(',').map(g => g.trim())
          const dateObj = new Date(allowed.date_iso as string)
          const dateStr = dateObj.toLocaleDateString('es-AR')
          const timeStr = dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
          
          const text = `🚨 *NUEVO MEET EN VIVO PROGRAMADO* 🚨\n\n📌 *Tema:* ${allowed.title || 'Meet de Trading'}\n📅 *Fecha:* ${dateStr}\n⏰ *Hora:* ${timeStr}\n\n🔗 *Link de Acceso:* ${allowed.url}\n\n_¡Asegúrate de estar en el portal a tiempo!_`
          
          for (const chatId of groups) {
            await fetch(`https://api.telegram.org/bot${config.telegram_bot_token}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'Markdown'
              })
            }).catch(e => console.error('Telegram broadcast error:', e))
          }
        }
      } catch (e) {
        console.error('Error broadcasting to telegram', e)
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
