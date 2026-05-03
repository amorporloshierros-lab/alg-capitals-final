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
    if (body.plan            !== undefined) allowed.plan            = body.plan
    if (body.plan_expires_at !== undefined) allowed.plan_expires_at = body.plan_expires_at
    if (body.role            !== undefined) allowed.role            = body.role
    if (body.name            !== undefined) allowed.name            = body.name

    const { data, error } = await supabase.from('profiles').update(allowed).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
