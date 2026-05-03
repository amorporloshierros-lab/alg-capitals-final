import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const supabase = createAdminClient()

    // Only insert columns that exist in the schema
    const payload: Record<string, unknown> = {
      pair:      body.pair,
      direction: body.direction,
      entry:     body.entry,
      sl:        body.sl,
      tp:        body.tp,
      status:    body.status ?? 'active',
      min_plan:  body.min_plan ?? 'starter',
    }
    // Optional columns — include only if provided
    if (body.notes     !== undefined) payload.notes     = body.notes
    if (body.timeframe !== undefined) payload.timeframe = body.timeframe
    if (body.rr        !== undefined) payload.rr        = body.rr

    const { data, error } = await supabase.from('signals').insert(payload).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
