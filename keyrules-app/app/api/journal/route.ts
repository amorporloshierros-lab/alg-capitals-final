import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const supabase = await createClient()

    const payload: Record<string, unknown> = { user_id: user.id }
    const fields = ['pair', 'direction', 'entry', 'sl', 'tp', 'result_pct', 'notes', 'taken_at'] as const
    for (const key of fields) {
      if (body[key] !== undefined) payload[key] = body[key]
    }

    const { data, error } = await supabase
      .from('journal_trades')
      .insert(payload)
      .select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
