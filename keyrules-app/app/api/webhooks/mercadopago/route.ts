import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

// MP Docs: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
export async function POST(req: NextRequest) {
  try {
    const signatureHeader = req.headers.get('x-signature')
    const requestId = req.headers.get('x-request-id')
    
    // In dev, you might skip signature validation or use a dummy secret
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
    
    const bodyText = await req.text()
    
    // Validate Signature
    if (secret && signatureHeader) {
      const parts = signatureHeader.split(',')
      let ts = ''
      let hash = ''
      for (const part of parts) {
        const [k, v] = part.split('=')
        if (k === 'ts') ts = v
        if (k === 'v1') hash = v
      }
      const manifest = `id:${requestId};request-id:${requestId};ts:${ts};`
      const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex')
      
      // We log but don't strictly block if it fails in case of misconfiguration during setup
      if (hmac !== hash) {
        console.warn('MP Webhook signature mismatch')
      }
    }

    const body = JSON.parse(bodyText)

    if (body.action === 'payment.created' || body.type === 'payment') {
      const paymentId = body.data?.id
      if (!paymentId) return NextResponse.json({ ok: true }) // ignore

      // Fetch payment details from MP
      const token = process.env.MERCADOPAGO_ACCESS_TOKEN
      if (!token) throw new Error('No MP token configured')

      const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const mpData = await res.json()

      if (mpData.status === 'approved') {
        const userId = mpData.external_reference // We assume the checkout sends user_id here
        const amount = mpData.transaction_amount
        // Identify plan by amount or description
        let plan = 'pro'
        if (amount >= 500) plan = 'elite'

        const supabase = createAdminClient()

        if (userId) {
          // 1. Update Profile
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + 30)

          await supabase.from('profiles').update({
            plan,
            plan_expires_at: expiresAt.toISOString(),
          }).eq('id', userId)

          // 2. Insert Payment
          await supabase.from('payments').insert({
            user_id: userId,
            plan,
            amount_usd: amount, // MP might be local currency, but we store numeric
            method: 'mercadopago',
            external_id: String(paymentId),
            status: 'approved'
          })
          
          // Trigger Welcome/Success Email (Implementation pending Resend step)
          try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.keyrulesalg.com'}/api/emails/success`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, plan })
            })
          } catch (e) {
            console.error('Failed to trigger email', e)
          }
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('MP Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
