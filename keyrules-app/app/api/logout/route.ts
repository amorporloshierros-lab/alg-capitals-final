import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.keyrulesalg.com'
  return NextResponse.redirect(new URL('/login', origin))
}
