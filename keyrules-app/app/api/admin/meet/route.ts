import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const supabase = createAdminClient()
    const { error } = await supabase.from('meet_config')
      .upsert({ id: 1, ...body, updated_at: new Date().toISOString() })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
