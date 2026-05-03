import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

function generateKey(product: string): string {
  const prefix: Record<string, string> = {
    oracle_mt5_full:   'ORCL',
    keywick_pro:       'KWCK',
    bias_telegram:     'TGVP',
    discord_elite:     'DISC',
    libro_keywick:     'BOOK',
    oracle_lite:       'ORLT',
  }
  const pre = prefix[product] ?? 'GENL'
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${pre}-${rand()}-${rand()}-ALG`
}

export async function GET() {
  try {
    await requireAdmin()
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('licenses')
      .select('*, profiles(name, email)')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const { user_id, product, notes, expires_at, custom_key } = body

    if (!user_id || !product) {
      return NextResponse.json({ error: 'user_id y product son requeridos' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const license_key = custom_key?.trim() || generateKey(product)

    const payload: Record<string, unknown> = { user_id, product, license_key, active: true }
    if (notes)      payload.notes      = notes
    if (expires_at) payload.expires_at = expires_at

    const { data, error } = await supabase.from('licenses').insert(payload).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
