export const dynamic = 'force-dynamic'
import { requireAdmin } from '@/lib/auth'

export default async function AdminPlansPage() {
  await requireAdmin()
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={tag}>◇ Planes</div>
        <div style={title}>Configuración de planes</div>
      </div>
      <div style={{ background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', padding:28 }}>
        <div style={{ font:'400 13px/1.7 var(--font-sans)', color:'#737373', marginBottom:24 }}>
          Los planes y precios se configuran directamente en MercadoPago y Stripe.
          Los alumnos se asignan a un plan desde la sección{' '}
          <span style={{ color:'#10b981' }}>Alumnos</span>{' '}
          o automáticamente via webhooks de pago.
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            { plan:'starter', features:['Señales semanales','Bias semanal','Canal de Telegram'] },
            { plan:'pro', features:['Señales diarias','Bias diario','Replays','Checkin grupal'] },
            { plan:'elite', features:['Todo Pro','Oracle MT5','Sesiones live 1:1','Review de setups','Libro KeyWick'], highlight:true },
          ].map(({ plan, features, highlight }) => (
            <div key={plan} style={{ background:'rgba(10,10,10,.5)', border: highlight ? '1px solid rgba(16,185,129,.4)':'1px solid rgba(38,38,38,.8)', padding:20 }}>
              {highlight && <div style={{ font:'700 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#10b981', marginBottom:8 }}>★ Recomendado</div>}
              <div style={{ font:'900 italic 16px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:16 }}>{plan}</div>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
                {features.map(f => (
                  <li key={f} style={{ font:'400 12px/1 var(--font-sans)', color:'#a3a3a3', display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ color:'#10b981', flexShrink:0 }}>◉</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop:24, padding:'14px 18px', background:'rgba(16,185,129,.05)', border:'1px solid rgba(16,185,129,.15)', font:'400 12px/1.6 var(--font-sans)', color:'#737373' }}>
          Para modificar precios: actualizá los productos en{' '}
          <a href="https://www.mercadopago.com.ar" target="_blank" style={{ color:'#10b981', textDecoration:'none' }}>MercadoPago</a>
          {' '}y/o{' '}
          <a href="https://dashboard.stripe.com" target="_blank" style={{ color:'#10b981', textDecoration:'none' }}>Stripe Dashboard</a>.
        </div>
      </div>
    </div>
  )
}

const tag: React.CSSProperties = { font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }
const title: React.CSSProperties = { font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }
