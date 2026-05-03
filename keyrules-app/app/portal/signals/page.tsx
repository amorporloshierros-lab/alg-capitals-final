import { createClient } from '@/lib/supabase/server'
import { requireProfile, canAccess } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const DIR_COLOR: Record<string, string> = { LONG: '#10b981', SHORT: '#ef4444' }
const STATUS_COLOR: Record<string, string> = { active:'#10b981', executed:'#a3a3a3', stop:'#ef4444', tp:'#fbbf24' }

function fmt(n: number | null) {
  return n != null ? Number(n).toLocaleString('en-US', { maximumFractionDigits: 5 }) : '—'
}
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff/60000)
  if (m < 60) return `hace ${m}m`
  const h = Math.floor(m/60)
  if (h < 24) return `hace ${h}h`
  return `hace ${Math.floor(h/24)}d`
}

export default async function PortalSignalsPage() {
  const profile = await requireProfile()
  const supabase = await createClient()

  const { data: signals } = await supabase
    .from('signals')
    .select('*')
    .order('posted_at', { ascending: false })
    .limit(30)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={tag}>◆ Señales</div>
        <div style={title}>Feed de señales</div>
      </div>

      {(!signals || signals.length === 0) ? (
        <div style={emptyCard}>
          <div style={{ font:'900 italic 11px/1 var(--font-sans)', color:'#525252', textTransform:'uppercase', letterSpacing:'.2em' }}>Sin señales activas</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {signals.map(s => {
            const accessible = canAccess(profile.plan, profile.plan_expires_at, s.min_plan as 'pro'|'elite')
            const col = accessible ? DIR_COLOR[s.direction] ?? '#737373' : '#404040'
            const sc = STATUS_COLOR[s.status] ?? '#737373'
            return (
              <div key={s.id} style={{ background:'rgba(23,23,23,.6)', border:`1px solid ${accessible ? col+'25':'rgba(38,38,38,.6)'}`, borderLeft:`4px solid ${col}`, padding:'18px 20px', opacity: accessible ? 1 : .5 }}>
                {!accessible && (
                  <div style={{ font:'700 9px/1 var(--font-sans)', color:'#525252', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:10 }}>
                    ◇ Requiere plan {s.min_plan.toUpperCase()}
                  </div>
                )}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, flexWrap:'wrap', gap:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ font:'900 italic 20px/1 var(--font-sans)', color: accessible ? '#f5f5f5':'#404040', letterSpacing:'.04em' }}>{s.pair}</span>
                    <span style={{ font:'900 italic 11px/1 var(--font-sans)', color:col, letterSpacing:'.2em', textTransform:'uppercase' }}>
                      {s.direction === 'LONG' ? '▲' : '▼'} {s.direction}
                    </span>
                    {s.timeframe && <span style={{ font:'400 9px/1 var(--font-mono)', color:'#525252', letterSpacing:'.1em' }}>{s.timeframe}</span>}
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ padding:'3px 8px', background:`${sc}15`, border:`1px solid ${sc}30`, font:'700 8px/1 var(--font-sans)', color:sc, letterSpacing:'.2em', textTransform:'uppercase' }}>{s.status}</span>
                    <span style={{ font:'400 9px/1 var(--font-mono)', color:'#404040', letterSpacing:'.1em' }}>{timeAgo(s.posted_at)}</span>
                  </div>
                </div>
                {accessible && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                    {[['ENTRY', fmt(s.entry),'#f5f5f5'],['STOP LOSS', fmt(s.sl),'#ef4444'],['TAKE PROFIT', fmt(s.tp),'#10b981']].map(([l,v,c]) => (
                      <div key={l} style={{ background:'rgba(0,0,0,.3)', padding:'10px 12px' }}>
                        <div style={{ font:'700 7px/1 var(--font-mono)', color:'#525252', letterSpacing:'.2em', marginBottom:5 }}>{l}</div>
                        <div style={{ font:'700 13px/1 var(--font-mono)', color:c }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}
                {accessible && s.rr && (
                  <div style={{ marginTop:10, font:'700 10px/1 var(--font-mono)', color:'#10b981', letterSpacing:'.1em' }}>RR 1:{Number(s.rr).toFixed(2)}</div>
                )}
                {accessible && s.notes && (
                  <div style={{ marginTop:10, padding:'10px 12px', background:'rgba(10,10,10,.4)', font:'400 12px/1.6 var(--font-sans)', color:'#a3a3a3', borderTop:'1px solid rgba(16,185,129,.08)' }}>{s.notes}</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const tag: React.CSSProperties = { font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }
const title: React.CSSProperties = { font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }
const emptyCard: React.CSSProperties = { background:'rgba(23,23,23,.3)', border:'1px solid rgba(38,38,38,.8)', padding:'48px 32px', textAlign:'center' }
