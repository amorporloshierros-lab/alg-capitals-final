'use client'

import { useState, useTransition } from 'react'

type MeetConfig = {
  id: number
  title: string | null
  date_iso: string | null
  url: string | null
  min_plan: string
  active: boolean | null
}

export default function MeetEditor({ initial }: { initial: MeetConfig | null }) {
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(initial?.title ?? 'Live Trading')
  const [dateIso, setDateIso] = useState(
    initial?.date_iso ? new Date(initial.date_iso).toISOString().slice(0,16) : ''
  )
  const [url, setUrl] = useState(initial?.url ?? '')
  const [minPlan, setMinPlan] = useState(initial?.min_plan ?? 'pro')
  const [active, setActive] = useState(initial?.active ?? true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string|null>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/meet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, date_iso: dateIso ? new Date(dateIso).toISOString() : null, url, min_plan: minPlan, active }),
        })
        if (!res.ok) throw new Error(await res.text())
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2500)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error')
      }
    })
  }

  const countdown = dateIso ? (() => {
    const diff = new Date(dateIso).getTime() - Date.now()
    if (diff <= 0) return 'Ya pasó'
    const d = Math.floor(diff/86400000)
    const h = Math.floor((diff%86400000)/3600000)
    const m = Math.floor((diff%3600000)/60000)
    return `${d}d ${h}h ${m}m`
  })() : null

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'start' }}>
      <div style={card}>
        <span style={sLabel}>Configuración</span>
        {success && <div style={successBar}>Guardado correctamente</div>}
        {error && <div style={errorBar}>{error}</div>}
        <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <div style={fLabel}>Título del meet</div>
            <input value={title} onChange={e=>setTitle(e.target.value)} style={input} placeholder="Live Trading" />
          </div>
          <div>
            <div style={fLabel}>Fecha y hora</div>
            <input type="datetime-local" value={dateIso} onChange={e=>setDateIso(e.target.value)} style={input} />
          </div>
          <div>
            <div style={fLabel}>URL (Zoom / YouTube / Telegram)</div>
            <input value={url} onChange={e=>setUrl(e.target.value)} style={input} placeholder="https://..." />
          </div>
          <div>
            <div style={fLabel}>Plan mínimo</div>
            <div style={{ display:'flex', gap:8 }}>
              {['pro','elite'].map(p => (
                <button key={p} type="button" onClick={() => setMinPlan(p)}
                  style={{ padding:'7px 16px', font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor:'pointer',
                    background: minPlan===p ? 'rgba(16,185,129,.12)':'rgba(10,10,10,.7)',
                    color: minPlan===p ? '#10b981':'#737373',
                    border: minPlan===p ? '1px solid rgba(16,185,129,.35)':'1px solid rgba(64,64,64,.5)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
            <div onClick={() => setActive(!active)} style={{ width:36, height:20, background: active ? '#10b981':'rgba(64,64,64,.5)', position:'relative', cursor:'pointer' }}>
              <div style={{ position:'absolute', top:2, left: active ? 18:2, width:16, height:16, background:'#fff', transition:'left .2s' }} />
            </div>
            <span style={{ font:'700 10px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', color: active ? '#10b981':'#737373' }}>
              {active ? 'Banner activo' : 'Banner oculto'}
            </span>
          </label>
          <button type="submit" disabled={isPending} style={{ padding:'12px 0', background: isPending ? 'rgba(16,185,129,.4)':'#10b981', color:'#000', border:'none', cursor:'pointer', font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.35em', textTransform:'uppercase' }}>
            {isPending ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </form>
      </div>

      <div style={card}>
        <span style={sLabel}>Preview del banner</span>
        <div style={{ background:'rgba(16,185,129,.05)', border:'1px solid rgba(16,185,129,.2)', padding:'20px 24px' }}>
          <div style={{ font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:8 }}>
            ◎ {title || 'Próximo Meet'}
          </div>
          {countdown && (
            <div style={{ font:'900 italic 28px/1 var(--font-mono)', color:'#f5f5f5', letterSpacing:'.05em', marginBottom:8 }}>
              {countdown}
            </div>
          )}
          {dateIso && (
            <div style={{ font:'400 10px/1 var(--font-mono)', color:'#737373', letterSpacing:'.1em', marginBottom:16 }}>
              {new Date(dateIso).toLocaleString('es-AR', { weekday:'long', day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' })}
            </div>
          )}
          <div style={{ display:'inline-block', padding:'8px 16px', background:'#10b981', color:'#000', font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase' }}>
            Unirse al meet →
          </div>
          {!active && (
            <div style={{ marginTop:12, font:'700 9px/1 var(--font-sans)', color:'#ef4444', letterSpacing:'.2em', textTransform:'uppercase' }}>
              Banner oculto — no visible para alumnos
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const card: React.CSSProperties = { background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', padding:22 }
const sLabel: React.CSSProperties = { display:'block', font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.4em', textTransform:'uppercase', color:'#10b981', marginBottom:18 }
const fLabel: React.CSSProperties = { display:'block', font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#737373', marginBottom:7 }
const input: React.CSSProperties = { width:'100%', background:'rgba(10,10,10,.7)', border:'1px solid rgba(64,64,64,.6)', color:'#f5f5f5', padding:'10px 12px', font:'400 13px/1 var(--font-sans)', outline:'none', boxSizing:'border-box' }
const successBar: React.CSSProperties = { background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.25)', borderLeft:'3px solid #10b981', padding:'9px 12px', font:'400 11px/1 var(--font-sans)', color:'#10b981', marginBottom:14 }
const errorBar: React.CSSProperties = { background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', borderLeft:'3px solid #ef4444', padding:'9px 12px', font:'400 11px/1 var(--font-sans)', color:'#ef4444', marginBottom:14 }
