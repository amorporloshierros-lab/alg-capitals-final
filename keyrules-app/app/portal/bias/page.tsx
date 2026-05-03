import { createClient } from '@/lib/supabase/server'
import { requireProfile, canAccess } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const DIR_LABEL: Record<string, string> = {
  alcista: '▲ ALCISTA',
  bajista: '▼ BAJISTA',
  neutral: '◇ NEUTRAL',
  range:   '◎ RANGE',
}

const DIR_COLOR: Record<string, string> = {
  alcista: '#10b981',
  bajista: '#ef4444',
  neutral: '#fbbf24',
  range:   '#a3a3a3',
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs} h`
  const days = Math.floor(hrs / 24)
  return `hace ${days} d`
}

function formatFull(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function PortalBiasPage() {
  const profile = await requireProfile()
  const supabase = await createClient()

  const { data: biasList } = await supabase
    .from('bias')
    .select('*')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(20)

  const today = biasList?.[0] ?? null
  const rest  = biasList?.slice(1) ?? []

  // Verificar si el alumno puede ver el bias de hoy
  const canSeeToday = today
    ? canAccess(profile.plan, profile.plan_expires_at, today.min_plan)
    : false

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          font: '900 italic 9px/1 var(--font-sans)',
          letterSpacing: '.5em',
          textTransform: 'uppercase',
          color: '#10b981',
          marginBottom: 6,
        }}>
          ▲ Bias Diario
        </div>
        <div style={{
          font: '900 italic 22px/1 var(--font-sans)',
          color: '#f5f5f5',
          textTransform: 'uppercase',
          letterSpacing: '.05em',
        }}>
          Sesgo del mercado
        </div>
      </div>

      {!today ? (
        <div style={emptyCard}>
          <div style={{ font: '900 italic 32px/1 var(--font-sans)', color: '#262626', marginBottom: 12 }}>▲</div>
          <div style={{ font: '900 italic 14px/1 var(--font-sans)', color: '#525252', textTransform: 'uppercase', letterSpacing: '.2em' }}>
            Sin bias publicado
          </div>
          <div style={{ font: '400 12px/1.6 var(--font-sans)', color: '#404040', marginTop: 8 }}>
            El bias de hoy todavía no fue cargado.
          </div>
        </div>
      ) : !canSeeToday ? (
        <div style={lockedCard}>
          <div style={{ font: '900 italic 28px/1 var(--font-sans)', color: '#262626', marginBottom: 12 }}>◇</div>
          <div style={{ font: '900 italic 13px/1 var(--font-sans)', color: '#525252', textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: 8 }}>
            Contenido bloqueado
          </div>
          <div style={{ font: '400 12px/1.5 var(--font-sans)', color: '#404040', marginBottom: 16 }}>
            El bias diario requiere plan <strong style={{ color: '#10b981' }}>{today.min_plan.toUpperCase()}</strong> o superior.
            {profile.plan
              ? ` Tu plan actual es ${profile.plan.toUpperCase()}.`
              : ' No tenés un plan activo.'}
          </div>
          <a href="/#planes" style={{
            padding: '10px 20px',
            background: '#10b981',
            color: '#000',
            font: '900 italic 9px/1 var(--font-sans)',
            letterSpacing: '.4em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Ver planes
          </a>
        </div>
      ) : (
        /* ── BIAS HOY ── */
        <div style={{
          background: 'rgba(23,23,23,.6)',
          border: `1px solid ${DIR_COLOR[today.direction]}30`,
          borderLeft: `4px solid ${DIR_COLOR[today.direction]}`,
          padding: 28,
          marginBottom: 24,
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{
                  font: '900 italic 28px/1 var(--font-sans)',
                  color: '#f5f5f5',
                  letterSpacing: '.05em',
                  textTransform: 'uppercase',
                }}>
                  {today.pair}
                </span>
                <span style={{
                  font: '900 italic 13px/1 var(--font-sans)',
                  color: DIR_COLOR[today.direction],
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                }}>
                  {DIR_LABEL[today.direction]}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {today.session && (
                  <span style={{
                    font: '700 9px/1 var(--font-mono)',
                    color: '#525252',
                    letterSpacing: '.2em',
                    textTransform: 'uppercase',
                  }}>
                    ◉ {today.session}
                  </span>
                )}
                <span style={{
                  font: '400 10px/1 var(--font-mono)',
                  color: '#525252',
                  letterSpacing: '.15em',
                }}>
                  {today.published_at ? formatFull(today.published_at) : ''}
                </span>
                <span style={{
                  font: '400 10px/1 var(--font-mono)',
                  color: '#404040',
                  letterSpacing: '.1em',
                }}>
                  {today.published_at ? formatRelative(today.published_at) : ''}
                </span>
              </div>
            </div>
            <div style={{
              padding: '6px 12px',
              background: `${DIR_COLOR[today.direction]}15`,
              border: `1px solid ${DIR_COLOR[today.direction]}30`,
              font: '700 9px/1 var(--font-sans)',
              color: DIR_COLOR[today.direction],
              letterSpacing: '.3em',
              textTransform: 'uppercase',
            }}>
              {today.min_plan.toUpperCase()}
            </div>
          </div>

          {/* Análisis */}
          {today.analysis_md && (
            <div style={{
              background: 'rgba(10,10,10,.4)',
              padding: '16px 18px',
              borderTop: '1px solid rgba(16,185,129,.1)',
              font: '400 14px/1.7 var(--font-sans)',
              color: '#d4d4d4',
              whiteSpace: 'pre-wrap',
              marginBottom: today.video_url ? 16 : 0,
            }}>
              {today.analysis_md}
            </div>
          )}

          {/* Video */}
          {today.video_url && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                font: '900 italic 8px/1 var(--font-sans)',
                letterSpacing: '.4em',
                textTransform: 'uppercase',
                color: '#525252',
                marginBottom: 10,
              }}>
                ▶ Video del bias
              </div>
              {today.video_url.includes('youtube') || today.video_url.includes('youtu.be') ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  <iframe
                    src={today.video_url.replace('watch?v=', 'embed/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                  />
                </div>
              ) : (
                <a
                  href={today.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'rgba(16,185,129,.08)',
                    border: '1px solid rgba(16,185,129,.2)',
                    color: '#10b981',
                    font: '700 10px/1 var(--font-sans)',
                    letterSpacing: '.2em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  ▶ Ver video
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── HISTORIAL ── */}
      {rest.length > 0 && (
        <div>
          <div style={{
            font: '900 italic 9px/1 var(--font-sans)',
            letterSpacing: '.4em',
            textTransform: 'uppercase',
            color: '#525252',
            marginBottom: 12,
          }}>
            Historial reciente
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {rest.map(b => {
              const accessible = canAccess(profile.plan, profile.plan_expires_at, b.min_plan)
              const color = accessible ? DIR_COLOR[b.direction] : '#404040'
              return (
                <li
                  key={b.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: 'rgba(10,10,10,.3)',
                    borderLeft: `3px solid ${color}`,
                    opacity: accessible ? 1 : .4,
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{
                      font: '900 italic 12px/1 var(--font-sans)',
                      color: accessible ? '#f5f5f5' : '#404040',
                      letterSpacing: '.05em',
                    }}>
                      {b.pair}
                    </span>
                    <span style={{
                      font: '700 9px/1 var(--font-sans)',
                      color,
                      letterSpacing: '.2em',
                      textTransform: 'uppercase',
                    }}>
                      {DIR_LABEL[b.direction]}
                    </span>
                    {b.session && (
                      <span style={{
                        font: '400 9px/1 var(--font-mono)',
                        color: '#404040',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                      }}>
                        {b.session}
                      </span>
                    )}
                  </div>
                  <span style={{
                    font: '400 10px/1 var(--font-mono)',
                    color: '#404040',
                    letterSpacing: '.1em',
                  }}>
                    {b.published_at ? formatRelative(b.published_at) : ''}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

const emptyCard: React.CSSProperties = {
  background: 'rgba(23,23,23,.3)',
  border: '1px solid rgba(38,38,38,.8)',
  padding: '48px 32px',
  textAlign: 'center',
}

const lockedCard: React.CSSProperties = {
  background: 'rgba(23,23,23,.3)',
  border: '1px solid rgba(38,38,38,.8)',
  borderLeft: '4px solid #262626',
  padding: '40px 32px',
  textAlign: 'center',
}
