import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('signals').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
