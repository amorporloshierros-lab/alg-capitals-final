'use client'

import { useState, useTransition, useRef } from 'react'
import { createBias, updateBias, deleteBias, togglePublishBias } from '../actions/bias'
import type { BiasDir, PlanTier } from '@/types/database'

type BiasRow = {
  id: string
  pair: string
  direction: BiasDir
  session: string | null
  analysis_md: string | null
  video_url: string | null
  min_plan: PlanTier
  published_at: string | null
  created_at: string
}

const DIRECTION_OPTIONS: { value: BiasDir; label: string; color: string }[] = [
  { value: 'alcista',  label: 'Alcista',       color: '#10b981' },
  { value: 'bajista',  label: 'Bajista',       color: '#ef4444' },
  { value: 'neutral',  label: 'Neutral / Doji', color: '#fbbf24' },
  { value: 'range',    label: 'Range',          color: '#a3a3a3' },
]

const SESSION_OPTIONS = ['Asia', 'Londres', 'NY AM', 'NY PM', 'Todo el día']
const PLAN_OPTIONS: { value: PlanTier; label: string }[] = [
  { value: 'pro',   label: 'Pro' },
  { value: 'elite', label: 'Elite' },
]

const COMMON_PAIRS = ['XAUUSD', 'EURUSD', 'NAS100', 'BTCUSD', 'GBPUSD', 'US30', 'SPX500']

function dirColor(d: BiasDir) {
  return DIRECTION_OPTIONS.find(o => o.value === d)?.color ?? '#a3a3a3'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: '2-digit' }) +
    ' · ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export default function BiasEditor({ initialList }: { initialList: BiasRow[] }) {
  const [list, setList] = useState<BiasRow[]>(initialList)
  const [editing, setEditing] = useState<BiasRow | null>(null)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Form state
  const [pair, setPair] = useState('XAUUSD')
  const [direction, setDirection] = useState<BiasDir>('bajista')
  const [session, setSession] = useState('Londres')
  const [analysisMd, setAnalysisMd] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [minPlan, setMinPlan] = useState<PlanTier>('pro')
  const [publish, setPublish] = useState(true)
  const [videoTab, setVideoTab] = useState<'url'|'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  function resetForm() {
    setPair('XAUUSD')
    setDirection('bajista')
    setSession('Londres')
    setAnalysisMd('')
    setVideoUrl('')
    setMinPlan('pro')
    setPublish(true)
    setEditing(null)
    setFormError(null)
  }

  function loadForEdit(b: BiasRow) {
    setEditing(b)
    setPair(b.pair)
    setDirection(b.direction)
    setSession(b.session ?? 'Londres')
    setAnalysisMd(b.analysis_md ?? '')
    setVideoUrl(b.video_url ?? '')
    setMinPlan(b.min_plan)
    setPublish(!!b.published_at)
    setFormError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleVideoUpload(file: File) {
    setUploading(true)
    setUploadProgress(10)
    try {
      // 1. Pedir URL firmada de upload
      const res = await fetch('/api/admin/bias/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      })
      const { signedUrl, path } = await res.json()
      if (!signedUrl) throw new Error('No se pudo obtener URL de upload')
      setUploadProgress(30)

      // 2. Subir directo a Supabase Storage
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (!uploadRes.ok) throw new Error('Error al subir el video')
      setUploadProgress(90)

      // 3. Guardar el path en el campo video_url (prefijado con storage:// para distinguirlo)
      setVideoUrl(`storage://${path}`)
      setUploadProgress(100)
      showSuccess(`Video subido: ${file.name}`)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al subir video')
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1500)
    }
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pair.trim()) { setFormError('Ingresá el par/activo'); return }
    setFormError(null)

    startTransition(async () => {
      try {
        const data = { pair, direction, session, analysis_md: analysisMd, video_url: videoUrl, min_plan: minPlan, publish }
        if (editing) {
          await updateBias(editing.id, data)
          showSuccess('Bias actualizado')
        } else {
          await createBias(data)
          showSuccess('Bias publicado')
        }
        // Refresh list from server: reload page sections
        window.location.reload()
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : 'Error desconocido')
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminás este bias?')) return
    startTransition(async () => {
      try {
        await deleteBias(id)
        setList((prev: BiasRow[]) => prev.filter((b: BiasRow) => b.id !== id))
        if (editing?.id === id) resetForm()
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Error al eliminar')
      }
    })
  }

  async function handleTogglePublish(b: BiasRow) {
    const next = !b.published_at
    startTransition(async () => {
      try {
        await togglePublishBias(b.id, next)
        setList((prev: BiasRow[]) => prev.map((x: BiasRow) => x.id === b.id
          ? { ...x, published_at: next ? new Date().toISOString() : null }
          : x
        ))
        showSuccess(next ? 'Bias publicado' : 'Bias despublicado')
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Error')
      }
    })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'start' }}>

      {/* ── FORMULARIO ── */}
      <div style={card}>
        <div style={sectionLabel}>{editing ? '✎ Editar Bias' : '+ Nuevo Bias'}</div>

        {successMsg && (
          <div style={{
            background: 'rgba(16,185,129,.1)',
            border: '1px solid rgba(16,185,129,.3)',
            borderLeft: '3px solid #10b981',
            padding: '10px 14px',
            font: '400 12px/1.4 var(--font-sans)',
            color: '#10b981',
            marginBottom: 16,
          }}>
            {successMsg}
          </div>
        )}

        {formError && (
          <div style={{
            background: 'rgba(239,68,68,.1)',
            border: '1px solid rgba(239,68,68,.3)',
            borderLeft: '3px solid #ef4444',
            padding: '10px 14px',
            font: '400 12px/1.4 var(--font-sans)',
            color: '#ef4444',
            marginBottom: 16,
          }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Par / Activo */}
          <div>
            <label style={fieldLabel}>Par / Activo</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {COMMON_PAIRS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPair(p)}
                  style={{
                    padding: '5px 10px',
                    background: pair === p ? '#10b981' : 'rgba(10,10,10,.7)',
                    color: pair === p ? '#000' : '#737373',
                    border: pair === p ? 'none' : '1px solid rgba(64,64,64,.5)',
                    cursor: 'pointer',
                    font: '700 10px/1 var(--font-mono)',
                    letterSpacing: '.1em',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={pair}
              onChange={e => setPair(e.target.value.toUpperCase())}
              placeholder="Otro par (ej: USDJPY)"
              style={inputStyle}
            />
          </div>

          {/* Dirección */}
          <div>
            <label style={fieldLabel}>Sesgo</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DIRECTION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDirection(opt.value)}
                  style={{
                    padding: '10px 0',
                    background: direction === opt.value ? opt.color : 'rgba(10,10,10,.7)',
                    color: direction === opt.value ? '#000' : opt.color,
                    border: direction === opt.value ? 'none' : `1px solid ${opt.color}40`,
                    cursor: 'pointer',
                    font: '900 italic 10px/1 var(--font-sans)',
                    letterSpacing: '.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sesión */}
          <div>
            <label style={fieldLabel}>Sesión</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SESSION_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSession(s)}
                  style={{
                    padding: '6px 12px',
                    background: session === s ? 'rgba(16,185,129,.15)' : 'rgba(10,10,10,.7)',
                    color: session === s ? '#10b981' : '#737373',
                    border: session === s ? '1px solid rgba(16,185,129,.4)' : '1px solid rgba(64,64,64,.5)',
                    borderLeft: session === s ? '3px solid #10b981' : '3px solid transparent',
                    cursor: 'pointer',
                    font: '700 10px/1 var(--font-sans)',
                    letterSpacing: '.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Análisis */}
          <div>
            <label style={fieldLabel}>Análisis</label>
            <textarea
              value={analysisMd}
              onChange={e => setAnalysisMd(e.target.value)}
              rows={7}
              placeholder="Liquidez tomada en 2435 — esperamos retest hacia FVG 4H y caza de stops por debajo de 2418..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* Video */}
          <div>
            <label style={fieldLabel}>Video del Bias (opcional)</label>
            {/* Tab switcher */}
            <div style={{ display:'flex', gap:0, marginBottom:10, border:'1px solid #262626' }}>
              {(['url','upload'] as const).map(tab => (
                <button key={tab} type="button" onClick={() => setVideoTab(tab)}
                  style={{ flex:1, padding:'8px 0', background: videoTab===tab ? 'rgba(16,185,129,.12)':'transparent', color: videoTab===tab ? '#10b981':'#525252', border:'none', borderRight: tab==='url' ? '1px solid #262626':'none', font:'700 9px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor:'pointer' }}>
                  {tab === 'url' ? '🔗 Link externo' : '⬆ Subir video'}
                </button>
              ))}
            </div>

            {videoTab === 'url' ? (
              <input
                type="url"
                value={videoUrl.startsWith('storage://') ? '' : videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://loom.com/... o YouTube..."
                style={inputStyle}
              />
            ) : (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*,.mp4,.mov,.webm"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleVideoUpload(f) }}
                  style={{ display:'none' }}
                />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  style={{ width:'100%', padding:'16px', background:'rgba(16,185,129,.04)', border:'1px dashed rgba(16,185,129,.25)', color: uploading?'#525252':'#10b981', font:'700 10px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor: uploading?'not-allowed':'pointer' }}>
                  {uploading ? `Subiendo... ${uploadProgress}%` : videoUrl.startsWith('storage://') ? '✓ Video subido — click para reemplazar' : '+ Seleccionar video (.mp4, .mov)'}
                </button>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={{ marginTop:6, height:3, background:'#1a1a1a' }}>
                    <div style={{ height:'100%', width:`${uploadProgress}%`, background:'#10b981', transition:'width .3s' }}/>
                  </div>
                )}
                {videoUrl.startsWith('storage://') && (
                  <div style={{ marginTop:6, font:'400 9px/1 var(--font-mono)', color:'#10b981', letterSpacing:'.1em' }}>
                    ✓ {videoUrl.replace('storage://','')} — almacenado de forma privada
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Plan mínimo */}
          <div>
            <label style={fieldLabel}>Plan mínimo</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PLAN_OPTIONS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setMinPlan(p.value)}
                  style={{
                    padding: '8px 20px',
                    background: minPlan === p.value ? 'rgba(16,185,129,.15)' : 'rgba(10,10,10,.7)',
                    color: minPlan === p.value ? '#10b981' : '#737373',
                    border: minPlan === p.value ? '1px solid rgba(16,185,129,.4)' : '1px solid rgba(64,64,64,.5)',
                    cursor: 'pointer',
                    font: '900 italic 10px/1 var(--font-sans)',
                    letterSpacing: '.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle publicar */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div
              onClick={() => setPublish(!publish)}
              style={{
                width: 40,
                height: 22,
                background: publish ? '#10b981' : 'rgba(64,64,64,.5)',
                position: 'relative',
                transition: 'background .2s',
                cursor: 'pointer',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 3,
                left: publish ? 21 : 3,
                width: 16,
                height: 16,
                background: '#fff',
                transition: 'left .2s',
              }}/>
            </div>
            <span style={{
              font: '700 10px/1 var(--font-sans)',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: publish ? '#10b981' : '#737373',
            }}>
              {publish ? 'Publicar ahora' : 'Guardar borrador'}
            </span>
          </label>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button
              type="submit"
              disabled={isPending}
              style={{
                flex: 1,
                padding: '12px 0',
                background: isPending ? 'rgba(16,185,129,.4)' : '#10b981',
                color: '#000',
                border: 'none',
                cursor: isPending ? 'not-allowed' : 'pointer',
                font: '900 italic 10px/1 var(--font-sans)',
                letterSpacing: '.35em',
                textTransform: 'uppercase',
              }}
            >
              {isPending ? 'Guardando...' : editing ? 'Actualizar' : publish ? 'Publicar bias' : 'Guardar borrador'}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '12px 16px',
                  background: 'transparent',
                  color: '#737373',
                  border: '1px solid rgba(64,64,64,.5)',
                  cursor: 'pointer',
                  font: '700 10px/1 var(--font-sans)',
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── LISTA ── */}
      <div style={card}>
        <div style={sectionLabel}>Bias recientes</div>

        {list.length === 0 ? (
          <div style={{
            padding: '32px 0',
            textAlign: 'center',
            font: '400 12px/1.6 var(--font-sans)',
            color: '#525252',
            letterSpacing: '.1em',
          }}>
            No hay bias publicados todavía.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {list.map(b => {
              const color = dirColor(b.direction)
              const published = !!b.published_at
              return (
                <li
                  key={b.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: 'rgba(10,10,10,.5)',
                    borderLeft: `3px solid ${published ? color : '#404040'}`,
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        font: '900 italic 13px/1 var(--font-sans)',
                        color: '#f5f5f5',
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
                        {b.direction}
                      </span>
                      {b.session && (
                        <span style={{
                          font: '400 9px/1 var(--font-mono)',
                          color: '#525252',
                          letterSpacing: '.15em',
                          textTransform: 'uppercase',
                        }}>
                          {b.session}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        font: '400 10px/1 var(--font-mono)',
                        color: '#525252',
                        letterSpacing: '.1em',
                      }}>
                        {formatDate(b.created_at)}
                      </span>
                      {!published && (
                        <span style={{
                          font: '700 8px/1 var(--font-sans)',
                          color: '#fbbf24',
                          letterSpacing: '.2em',
                          textTransform: 'uppercase',
                        }}>
                          borrador
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => handleTogglePublish(b)}
                      title={published ? 'Despublicar' : 'Publicar'}
                      style={iconBtn(published ? '#10b981' : '#525252')}
                    >
                      {published ? '●' : '○'}
                    </button>
                    <button
                      onClick={() => loadForEdit(b)}
                      title="Editar"
                      style={iconBtn('#737373')}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      title="Eliminar"
                      style={iconBtn('#ef444460')}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: 'rgba(23,23,23,.6)',
  border: '1px solid rgba(16,185,129,.18)',
  padding: 24,
}

const sectionLabel: React.CSSProperties = {
  font: '900 italic 9px/1 var(--font-sans)',
  letterSpacing: '.4em',
  textTransform: 'uppercase',
  color: '#10b981',
  marginBottom: 20,
  display: 'block',
}

const fieldLabel: React.CSSProperties = {
  display: 'block',
  font: '900 italic 8px/1 var(--font-sans)',
  letterSpacing: '.3em',
  textTransform: 'uppercase',
  color: '#737373',
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(10,10,10,.7)',
  border: '1px solid rgba(64,64,64,.6)',
  color: '#f5f5f5',
  padding: '10px 12px',
  font: '400 13px/1 var(--font-sans)',
  outline: 'none',
  boxSizing: 'border-box',
}

const iconBtn = (color: string): React.CSSProperties => ({
  padding: '6px 8px',
  background: 'transparent',
  color,
  border: `1px solid ${color}50`,
  cursor: 'pointer',
  font: '700 11px/1 var(--font-sans)',
  lineHeight: 1,
})
