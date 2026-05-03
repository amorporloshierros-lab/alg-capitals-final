'use client'

import { useState, useTransition } from 'react'

type Class = {
  id: string
  title: string
  module: string | null
  duration_min: number | null
  description: string | null
  mux_playback_id: string | null
  thumbnail_url: string | null
  min_plan: string
  published_at: string | null
  created_at: string
}

export default function ClassesEditor({ initialList }: { initialList: Class[] }) {
  const [list, setList] = useState(initialList)
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [module, setModule] = useState('')
  const [duration, setDuration] = useState('')
  const [description, setDescription] = useState('')
  const [playbackId, setPlaybackId] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [minPlan, setMinPlan] = useState('pro')
  const [publish, setPublish] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title) { setError('El título es obligatorio'); return }
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title, module: module || null, duration_min: duration ? Number(duration) : null,
            description: description || null, mux_playback_id: playbackId || null,
            thumbnail_url: thumbnail || null, min_plan: minPlan,
            published_at: publish ? new Date().toISOString() : null,
          }),
        })
        if (!res.ok) throw new Error(await res.text())
        const created = await res.json()
        setList(prev => [created, ...prev])
        setTitle(''); setModule(''); setDuration(''); setDescription(''); setPlaybackId(''); setThumbnail('')
        setSuccess(true); setTimeout(() => setSuccess(false), 2500)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error')
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminás esta clase?')) return
    startTransition(async () => {
      await fetch(`/api/admin/classes/${id}`, { method: 'DELETE' })
      setList(prev => prev.filter(c => c.id !== id))
    })
  }

  async function handleToggle(c: Class) {
    const published_at = c.published_at ? null : new Date().toISOString()
    startTransition(async () => {
      await fetch(`/api/admin/classes/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published_at }),
      })
      setList(prev => prev.map(x => x.id === c.id ? {...x, published_at} : x))
    })
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:20, alignItems:'start' }}>
      <div style={card}>
        <span style={sLabel}>+ Nueva clase / replay</span>
        {success && <div style={successBar}>Clase guardada</div>}
        {error && <div style={errorBar}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><div style={fLabel}>Título</div><input value={title} onChange={e=>setTitle(e.target.value)} style={input} placeholder="Sesión: Estructura de mercado avanzada" /></div>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:8 }}>
            <div><div style={fLabel}>Módulo</div><input value={module} onChange={e=>setModule(e.target.value)} style={input} placeholder="Módulo 3" /></div>
            <div><div style={fLabel}>Duración (min)</div><input type="number" value={duration} onChange={e=>setDuration(e.target.value)} style={input} placeholder="45" /></div>
          </div>
          <div><div style={fLabel}>Descripción</div><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} style={{ ...input, resize:'vertical', lineHeight:1.5 }} placeholder="¿Qué cubre esta clase?" /></div>
          <div><div style={fLabel}>Mux Playback ID</div><input value={playbackId} onChange={e=>setPlaybackId(e.target.value)} style={input} placeholder="abc123xyz..." /></div>
          <div><div style={fLabel}>Thumbnail URL</div><input value={thumbnail} onChange={e=>setThumbnail(e.target.value)} style={input} placeholder="https://..." /></div>
          <div>
            <div style={fLabel}>Plan mínimo</div>
            <div style={{ display:'flex', gap:8 }}>
              {['pro','elite'].map(p => (
                <button key={p} type="button" onClick={() => setMinPlan(p)}
                  style={{ padding:'7px 16px', font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor:'pointer',
                    background: minPlan===p ? 'rgba(16,185,129,.12)':'rgba(10,10,10,.7)', color: minPlan===p ? '#10b981':'#737373',
                    border: minPlan===p ? '1px solid rgba(16,185,129,.35)':'1px solid rgba(64,64,64,.5)' }}>{p}</button>
              ))}
            </div>
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
            <div onClick={() => setPublish(!publish)} style={{ width:36, height:20, background: publish ? '#10b981':'rgba(64,64,64,.5)', position:'relative', cursor:'pointer' }}>
              <div style={{ position:'absolute', top:2, left: publish ? 18:2, width:16, height:16, background:'#fff', transition:'left .2s' }} />
            </div>
            <span style={{ font:'700 10px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', color: publish ? '#10b981':'#737373' }}>
              {publish ? 'Publicar ahora' : 'Guardar borrador'}
            </span>
          </label>
          <button type="submit" disabled={isPending} style={{ padding:'12px 0', background: isPending ? 'rgba(16,185,129,.4)':'#10b981', color:'#000', border:'none', cursor:'pointer', font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.35em', textTransform:'uppercase' }}>
            {isPending ? 'Guardando...' : 'Guardar clase'}
          </button>
        </form>
      </div>

      <div style={card}>
        <span style={sLabel}>Clases ({list.length})</span>
        {list.length === 0 ? (
          <div style={{ padding:'32px 0', textAlign:'center', color:'#525252', font:'400 12px/1 var(--font-sans)' }}>Sin clases cargadas</div>
        ) : (
          <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6 }}>
            {list.map(c => (
              <li key={c.id} style={{ padding:'12px 14px', background:'rgba(10,10,10,.5)', borderLeft:`3px solid ${c.published_at ? '#10b981':'#404040'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ font:'900 italic 12px/1.2 var(--font-sans)', color:'#f5f5f5', letterSpacing:'.04em', marginBottom:4 }}>{c.title}</div>
                    <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                      {c.module && <span style={{ font:'400 9px/1 var(--font-mono)', color:'#525252', letterSpacing:'.1em' }}>{c.module}</span>}
                      {c.duration_min && <span style={{ font:'400 9px/1 var(--font-mono)', color:'#525252', letterSpacing:'.1em' }}>{c.duration_min}min</span>}
                      <span style={{ font:'700 8px/1 var(--font-sans)', color: c.min_plan==='elite' ? '#fbbf24':'#10b981', letterSpacing:'.2em', textTransform:'uppercase' }}>{c.min_plan}</span>
                      {!c.published_at && <span style={{ font:'700 8px/1 var(--font-sans)', color:'#fbbf24', letterSpacing:'.2em', textTransform:'uppercase' }}>borrador</span>}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                    <button onClick={() => handleToggle(c)} style={{ padding:'4px 7px', background:'transparent', color: c.published_at ? '#10b981':'#525252', border:`1px solid ${c.published_at ? 'rgba(16,185,129,.3)':'rgba(82,82,82,.3)'}`, cursor:'pointer', font:'10px/1 var(--font-sans)' }}>{c.published_at ? '●' : '○'}</button>
                    <button onClick={() => handleDelete(c.id)} style={{ padding:'4px 7px', background:'transparent', color:'rgba(239,68,68,.5)', border:'1px solid rgba(239,68,68,.2)', cursor:'pointer', font:'10px/1 var(--font-sans)' }}>✕</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

const card: React.CSSProperties = { background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', padding:22 }
const sLabel: React.CSSProperties = { display:'block', font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.4em', textTransform:'uppercase', color:'#10b981', marginBottom:18 }
const fLabel: React.CSSProperties = { display:'block', font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#737373', marginBottom:7 }
const input: React.CSSProperties = { width:'100%', background:'rgba(10,10,10,.7)', border:'1px solid rgba(64,64,64,.6)', color:'#f5f5f5', padding:'9px 11px', font:'400 13px/1 var(--font-sans)', outline:'none', boxSizing:'border-box' }
const successBar: React.CSSProperties = { background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.25)', borderLeft:'3px solid #10b981', padding:'9px 12px', font:'400 11px/1 var(--font-sans)', color:'#10b981', marginBottom:14 }
const errorBar: React.CSSProperties = { background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', borderLeft:'3px solid #ef4444', padding:'9px 12px', font:'400 11px/1 var(--font-sans)', color:'#ef4444', marginBottom:14 }
