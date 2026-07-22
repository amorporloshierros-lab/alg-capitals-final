import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey || !secret) {
      console.warn('Stripe keys missing')
      return NextResponse.json({ error: 'Keys missing' }, { status: 400 })
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2026-06-24.dahlia' as any })
    const signature = req.headers.get('stripe-signature')
    const bodyText = await req.text()

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(bodyText, signature!, secret)
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      const amount = session.amount_total ? session.amount_total / 100 : 0
      
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
          amount_usd: amount,
          method: 'stripe',
          external_id: session.id,
          status: 'approved'
        })
        
        // Trigger Welcome/Success Email
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

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
