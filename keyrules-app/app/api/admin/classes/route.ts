import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const supabase = createAdminClient()

    // Whitelist explícita de campos permitidos
    const payload: Record<string, unknown> = {}
    const allowed = ['title', 'module', 'duration_min', 'description', 'mux_playback_id', 'mux_asset_id', 'thumbnail_url', 'min_plan', 'published_at'] as const
    for (const key of allowed) {
      if (body[key] !== undefined) payload[key] = body[key]
    }

    const { data, error } = await supabase.from('classes').insert(payload).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
