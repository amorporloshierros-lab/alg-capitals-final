import { createClient } from '@/lib/supabase/server'
import { requireProfile, canAccess } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function PortalAcademiaPage() {
  const profile = await requireProfile()
  const supabase = await createClient()

  const { data: classes } = await supabase
    .from('classes')
    .select('*')
    .not('published_at', 'is', null)
    .order('created_at', { ascending: true })

  const { data: progress } = await supabase
    .from('class_progress')
    .select('class_id')

  const completedIds = new Set((progress ?? []).map(p => p.class_id))

  const byModule: Record<string, typeof classes> = {}
  for (const c of classes ?? []) {
    const mod = c.module ?? 'Sin módulo'
    if (!byModule[mod]) byModule[mod] = []
    byModule[mod]!.push(c)
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={tag}>▶ Academia</div>
        <div style={title}>Clases & Replays</div>
      </div>

      {Object.keys(byModule).length === 0 ? (
        <div style={emptyCard}>
          <div style={{ font:'900 italic 11px/1 var(--font-sans)', color:'#525252', textTransform:'uppercase', letterSpacing:'.2em' }}>Sin clases disponibles aún</div>
        </div>
      ) : (
        Object.entries(byModule).map(([mod, items]) => (
          <div key={mod} style={{ marginBottom: 28 }}>
            <div style={{ font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.4em', textTransform:'uppercase', color:'#737373', marginBottom:12 }}>
              {mod}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {items!.map(c => {
                const accessible = canAccess(profile.plan, profile.plan_expires_at, c.min_plan as 'pro'|'elite')
                const completed = completedIds.has(c.id)
                return (
                  <div key={c.id} style={{ background:'rgba(23,23,23,.6)', border:'1px solid rgba(38,38,38,.8)', borderLeft:`3px solid ${completed ? '#10b981' : accessible ? 'rgba(16,185,129,.3)':'#262626'}`, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, opacity: accessible ? 1 : .5 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ font:'900 italic 13px/1.2 var(--font-sans)', color: accessible ? '#f5f5f5':'#404040', letterSpacing:'.04em', marginBottom:4 }}>{c.title}</div>
                      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                        {c.duration_min && <span style={{ font:'400 9px/1 var(--font-mono)', color:'#525252', letterSpacing:'.1em' }}>{c.duration_min}min</span>}
                        <span style={{ font:'700 8px/1 var(--font-sans)', color: c.min_plan==='elite' ? '#fbbf24':'#10b981', letterSpacing:'.2em', textTransform:'uppercase' }}>{c.min_plan}</span>
                        {completed && <span style={{ font:'700 8px/1 var(--font-sans)', color:'#10b981', letterSpacing:'.2em', textTransform:'uppercase' }}>◉ Completado</span>}
                      </div>
                    </div>
                    <div>
                      {accessible && c.mux_playback_id ? (
                        <a href={`/portal/academia/${c.id}`} style={{ padding:'8px 14px', background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.3)', color:'#10b981', font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', textDecoration:'none', display:'inline-block', whiteSpace:'nowrap' }}>
                          ▶ Ver clase
                        </a>
                      ) : !accessible ? (
                        <span style={{ font:'700 8px/1 var(--font-sans)', color:'#404040', letterSpacing:'.2em', textTransform:'uppercase' }}>◇ Bloqueado</span>
                      ) : (
                        <span style={{ font:'700 8px/1 var(--font-sans)', color:'#404040', letterSpacing:'.2em', textTransform:'uppercase' }}>Sin video</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

const tag: React.CSSProperties = { font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }
const title: React.CSSProperties = { font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }
const emptyCard: React.CSSProperties = { background:'rgba(23,23,23,.3)', border:'1px solid rgba(38,38,38,.8)', padding:'48px 32px', textAlign:'center' }
