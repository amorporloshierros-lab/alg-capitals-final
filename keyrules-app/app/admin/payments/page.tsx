import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminPaymentsPage() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: payments } = await supabase
    .from('payments')
    .select('*, profiles(email,name)')
    .order('paid_at', { ascending: false })
    .limit(100)

  const total = payments?.reduce((acc, p) => acc + (Number(p.amount_usd) || 0), 0) ?? 0

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={tag}>$ Pagos</div>
        <div style={title}>Historial de pagos</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        {[
          ['Total recaudado', `$${total.toLocaleString('en-US',{maximumFractionDigits:0})} USD`],
          ['Pagos registrados', String(payments?.length ?? 0)],
          ['Este mes', String(payments?.filter(p => new Date(p.paid_at).getMonth() === new Date().getMonth()).length ?? 0)],
        ].map(([l,v]) => (
          <div key={l} style={{ background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', padding:'16px 20px' }}>
            <div style={{ font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#525252', marginBottom:8 }}>{l}</div>
            <div style={{ font:'900 italic 22px/1 var(--font-mono)', color:'#f5f5f5', letterSpacing:'.02em' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(16,185,129,.15)' }}>
              {['Usuario','Plan','Monto','Método','Estado','Fecha'].map(h => (
                <th key={h} style={{ padding:'12px 16px', font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#10b981', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(payments ?? []).map((p, i) => {
              const profile = p.profiles as { email: string; name: string | null } | null
              const statusColor = p.status === 'approved' ? '#10b981' : p.status === 'pending' ? '#fbbf24' : '#ef4444'
              return (
                <tr key={p.id} style={{ borderBottom:'1px solid rgba(38,38,38,.5)', background: i%2===0 ? 'transparent':'rgba(10,10,10,.2)' }}>
                  <td style={td}>{profile?.name ?? profile?.email ?? '—'}</td>
                  <td style={td}>
                    {p.plan && <span style={{ padding:'2px 7px', background:'rgba(16,185,129,.08)', color:'#10b981', font:'700 8px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase' }}>{p.plan}</span>}
                  </td>
                  <td style={{ ...td, fontFamily:'var(--font-mono)', color:'#10b981', fontWeight:700 }}>
                    {p.amount_usd ? `$${Number(p.amount_usd).toLocaleString('en-US')}` : '—'}
                  </td>
                  <td style={{ ...td, color:'#737373', fontSize:11 }}>{p.method ?? '—'}</td>
                  <td style={td}>
                    {p.status && <span style={{ padding:'2px 7px', background:`${statusColor}15`, color:statusColor, font:'700 8px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase' }}>{p.status}</span>}
                  </td>
                  <td style={{ ...td, fontFamily:'var(--font-mono)', fontSize:10, color:'#525252' }}>
                    {new Date(p.paid_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!payments || payments.length === 0) && (
          <div style={{ padding:'32px', textAlign:'center', color:'#525252', font:'400 12px/1 var(--font-sans)' }}>Sin pagos registrados</div>
        )}
      </div>
    </div>
  )
}

const tag: React.CSSProperties = { font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }
const title: React.CSSProperties = { font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }
const td: React.CSSProperties = { padding:'11px 16px', font:'400 12px/1 var(--font-sans)', color:'#d4d4d4', whiteSpace:'nowrap' }
