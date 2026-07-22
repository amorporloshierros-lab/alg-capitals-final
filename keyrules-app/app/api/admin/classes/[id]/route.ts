import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const supabase = createAdminClient()

    const allowed: Record<string, unknown> = {}
    const fields = ['title', 'module', 'duration_min', 'description', 'mux_playback_id', 'mux_asset_id', 'thumbnail_url', 'min_plan', 'published_at'] as const
    for (const key of fields) {
      if (body[key] !== undefined) allowed[key] = body[key]
    }

    const { error } = await supabase.from('classes').update(allowed).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const supabase = createAdminClient()
    const { error } = await supabase.from('classes').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
