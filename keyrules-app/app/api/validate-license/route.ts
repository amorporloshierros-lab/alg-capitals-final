import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  const product = searchParams.get('product')

  if (!key || !product) {
    return NextResponse.json({ valid: false, error: 'Missing key or product' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('licenses')
    .select('*, profiles(email)')
    .eq('license_key', key)
    .eq('product', product)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ valid: false, error: 'Invalid license' }, { status: 404 })
  }

  if (!data.active) {
    return NextResponse.json({ valid: false, error: 'License revoked' }, { status: 403 })
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: 'License expired' }, { status: 403 })
  }

  return NextResponse.json({
    valid: true,
    email: (data.profiles as unknown as { email: string })?.email,
    expires_at: data.expires_at
  })
}
