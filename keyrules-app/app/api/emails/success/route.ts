import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not set')
      return NextResponse.json({ error: 'Resend API key missing' }, { status: 500 })
    }
    const resend = new Resend(resendApiKey)

    const body = await req.json()
    const { userId, plan } = body

    if (!userId || !plan) {
      return NextResponse.json({ error: 'Missing userId or plan' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: profile } = await supabase.from('profiles').select('email, name').eq('id', userId).single()

    if (!profile?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userName = profile.name || profile.email.split('@')[0]
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@keyrulesalg.com'

    await resend.emails.send({
      from: `KeyRules ALG <${fromEmail}>`,
      to: profile.email,
      subject: `¡Bienvenido al Plan ${plan.toUpperCase()}! Acceso habilitado`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #050505; color: #f5f5f5; padding: 40px; border: 1px solid #262626;">
          <h1 style="color: #10b981; font-style: italic; text-transform: uppercase;">ACCESO HABILITADO</h1>
          <p>Hola ${userName},</p>
          <p>Tu pago ha sido procesado correctamente y tu suscripción <strong>${plan.toUpperCase()}</strong> ya está activa.</p>
          <p>Ya puedes acceder al Portal Alumnos, conectar tu cuenta de fondeo (MetaTrader 5) y acceder a la Academia y el Bias Diario.</p>
          <div style="margin: 40px 0;">
            <a href="https://www.keyrulesalg.com/portal" style="background: #10b981; color: #000; padding: 16px 32px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-style: italic; border-radius: 2px;">
              Entrar al Portal
            </a>
          </div>
          <p style="color: #737373; font-size: 12px; margin-top: 40px; border-top: 1px solid #262626; padding-top: 20px;">
            Si necesitas ayuda, puedes responder a este correo o contactar al soporte en Discord/Telegram.<br>
            Equipo de KeyRules × ALG Capitals.
          </p>
        </div>
      `
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Email sending error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
