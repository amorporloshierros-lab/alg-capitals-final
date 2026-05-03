import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const { fileName, contentType } = await req.json()
    if (!fileName) return NextResponse.json({ error: 'fileName requerido' }, { status: 400 })

    const ext = fileName.split('.').pop() ?? 'mp4'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const supabase = createAdminClient()
    const { data, error } = await supabase.storage
      .from('bias-videos')
      .createSignedUploadUrl(path)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ signedUrl: data.signedUrl, path, token: data.token })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
