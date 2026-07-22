import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_email, secret_key, stats } = body

    // En producción, el secret_key debe validarse contra una ENV var o una tabla de API keys.
    // Aquí hacemos un bypass simple si envían el secret o validamos el email.
    if (!user_email || !stats) {
      return NextResponse.json({ error: 'Missing user_email or stats' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Buscar al usuario
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user_email)
      .maybeSingle()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Actualizar trading_stats
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ trading_stats: stats })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    // Registrar log (opcional)
    await supabase.from('webhook_logs').insert({
      user_id: user.id,
      payload: stats
    })

    return NextResponse.json({ ok: true, updated: user_email })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
