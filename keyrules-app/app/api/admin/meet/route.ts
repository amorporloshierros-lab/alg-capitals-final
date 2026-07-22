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
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
