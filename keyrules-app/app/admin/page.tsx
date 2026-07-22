import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdmin()
  const supabase = createAdminClient()

  const [
    { data: profiles },
    { data: payments },
    { data: signals },
  ] = await Promise.all([
    supabase.from('profiles').select('id, plan, created_at').neq('role', 'admin'),
    supabase.from('payments').select('amount_usd, created_at, status').eq('status', 'approved'),
    supabase.from('signals').select('id, status'),
  ])

  // Cálculos básicos
  const users = profiles ?? []
  const totalUsers = users.length
  const activeSubs = users.filter(u => u.plan !== 'free' && u.plan != null).length
  
  const pays = payments ?? []
  const totalRev = pays.reduce((acc, p) => acc + Number(p.amount_usd || 0), 0)
  
  // MRR aproximado (Suma de pagos de los últimos 30 días)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const mrr = pays
    .filter(p => new Date(p.created_at) > thirtyDaysAgo)
    .reduce((acc, p) => acc + Number(p.amount_usd || 0), 0)

  const activeSignals = (signals ?? []).filter(s => s.status === 'active').length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <div style={{ font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.3em', color: '#10b981', textTransform: 'uppercase', marginBottom: 8 }}>Overview</div>
          <h1 style={{ font: '900 italic 32px/1 var(--font-sans)', color: '#f5f5f5', textTransform: 'uppercase', margin: 0 }}>Dashboard Financiero</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', padding: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 100, opacity: 0.02 }}>$</div>
          <div style={{ font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', marginBottom: 12 }}>Ingresos (30d / MRR)</div>
          <div style={{ font: '900 italic 32px/1 var(--font-sans)', color: '#10b981', display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 16, color: '#525252' }}>USD</span>
            {Math.round(mrr).toLocaleString('en-US')}
          </div>
        </div>

        <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', padding: 24 }}>
          <div style={{ font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', marginBottom: 12 }}>Ingresos Históricos</div>
          <div style={{ font: '900 italic 24px/1 var(--font-sans)', color: '#f5f5f5', display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 14, color: '#525252' }}>USD</span>
            {Math.round(totalRev).toLocaleString('en-US')}
          </div>
        </div>

        <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', padding: 24 }}>
          <div style={{ font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', marginBottom: 12 }}>Alumnos Activos (Pagos)</div>
          <div style={{ font: '900 italic 32px/1 var(--font-sans)', color: '#fbbf24' }}>
            {activeSubs} <span style={{ fontSize: 14, color: '#525252', fontStyle: 'normal' }}>/ {totalUsers} total</span>
          </div>
        </div>

        <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', padding: 24 }}>
          <div style={{ font: '700 10px/1 var(--font-mono)', color: '#737373', textTransform: 'uppercase', marginBottom: 12 }}>Señales Abiertas</div>
          <div style={{ font: '900 italic 32px/1 var(--font-sans)', color: '#818cf8' }}>
            {activeSignals}
          </div>
        </div>
      </div>

      <div style={{ background: '#0a0a0a', border: '1px dashed #262626', padding: 32, textAlign: 'center' }}>
        <h2 style={{ font: '900 italic 16px/1 var(--font-sans)', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: 8 }}>Pasarelas de Pago</h2>
        <p style={{ font: '400 12px/1.6 var(--font-mono)', color: '#525252', margin: 0 }}>
          Las suscripciones se gestionan automáticamente vía Webhooks cuando configures las claves de Mercado Pago y Stripe en Vercel.
        </p>
      </div>
    </div>
  )
}
