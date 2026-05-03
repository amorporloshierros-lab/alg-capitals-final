'use client'

import { useState, useTransition } from 'react'

type Signal = {
  id: string
  pair: string
  direction: 'LONG' | 'SHORT'
  entry: number
  sl: number
  tp: number
  rr: number | null
  timeframe: string | null
  min_plan: string
  status: string
  notes: string | null
  posted_at: string
}

const PAIRS = ['XAUUSD','EURUSD','NAS100','BTCUSD','GBPUSD','US30','SPX500']
const TIMEFRAMES = ['M5','M15','M30','H1','H4','D1']
const STATUSES = ['active','executed','stop','tp']
const STATUS_COLOR: Record<string, string> = {
  active: '#10b981', executed: '#a3a3a3', stop: '#ef4444', tp: '#fbbf24'
}

function fmt(n: number | null) {
  return n != null ? Number(n).toLocaleString('en-US', { maximumFractionDigits: 5 }) : ''
}
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff/60000)
  if (m < 60) return `hace ${m}m`
  const h = Math.floor(m/60)
  if (h < 24) return `hace ${h}h`
  return `hace ${Math.floor(h/24)}d`
}

async function createSignal(data: Omit<Signal,'id'|'rr'|'posted_at'>) {
  const res = await fetch('/api/admin/signals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
async function updateSignalStatus(id: string, status: string) {
  const res = await fetch(`/api/admin/signals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(await res.text())
}
async function deleteSignal(id: string) {
  const res = await fetch(`/api/admin/signals/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
}

export default function SignalsEditor({ initialList }: { initialList: Signal[] }) {
  const [list, setList] = useState(initialList)
  const [isPending, startTransition] = useTransition()
  const [pair, setPair] = useState('XAUUSD')
  const [direction, setDirection] = useState<'LONG'|'SHORT'>('LONG')
  const [entry, setEntry] = useState('')
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')
  const [tf, setTf] = useState('H1')
  const [minPlan, setMinPlan] = useState('pro')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [success, setSuccess] = useState(false)

  const rr = entry && sl && tp
    ? Math.abs(Number(tp)-Number(entry)) / Math.abs(Number(sl)-Number(entry))
    : null

  function showSuccess() {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!entry || !sl || !tp) { setError('Completá entry, SL y TP'); return }
    setError(null)
    startTransition(async () => {
      try {
        const created = await createSignal({
          pair, direction,
          entry: Number(entry), sl: Number(sl), tp: Number(tp),
          timeframe: tf, min_plan: minPlan, status: 'active', notes: notes || null
        })
        setList(prev => [created, ...prev])
        setEntry(''); setSl(''); setTp(''); setNotes('')
        showSuccess()
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error')
      }
    })
  }

  async function handleStatus(id: string, status: string) {
    startTransition(async () => {
      try {
        await updateSignalStatus(id, status)
        setList(prev => prev.map(s => s.id === id ? {...s, status} : s))
      } catch {}
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminás esta señal?')) return
    startTransition(async () => {
      try {
        await deleteSignal(id)
        setList(prev => prev.filter(s => s.id !== id))
      } catch {}
    })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, alignItems: 'start' }}>
      <div style={card}>
        <span style={sLabel}>+ Nueva señal</span>
        {success && <div style={successBar}>Señal publicada</div>}
        {error && <div style={errorBar}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={fLabel}>Par</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
              {PAIRS.map(p => (
                <button key={p} type="button" onClick={() => setPair(p)}
                  style={{ ...chip, ...(pair===p ? chipActive : {}) }}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={fLabel}>Dirección</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <button type="button" onClick={() => setDirection('LONG')}
                style={{ padding:'10px 0', background: direction==='LONG' ? '#10b981':'transparent', color: direction==='LONG' ? '#000':'#10b981', border: direction==='LONG' ? 'none':'1px solid rgba(16,185,129,.3)', font:'900 italic 11px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor:'pointer' }}>
                ▲ LONG
              </button>
              <button type="button" onClick={() => setDirection('SHORT')}
                style={{ padding:'10px 0', background: direction==='SHORT' ? '#ef4444':'transparent', color: direction==='SHORT' ? '#000':'#ef4444', border: direction==='SHORT' ? 'none':'1px solid rgba(239,68,68,.3)', font:'900 italic 11px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor:'pointer' }}>
                ▼ SHORT
              </button>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            <div>
              <div style={fLabel}>Entry</div>
              <input value={entry} onChange={e=>setEntry(e.target.value)} type="number" step="any" placeholder="2435.00" style={input} />
            </div>
            <div>
              <div style={fLabel}>Stop Loss</div>
              <input value={sl} onChange={e=>setSl(e.target.value)} type="number" step="any" placeholder="2418.00" style={input} />
            </div>
            <div>
              <div style={fLabel}>Take Profit</div>
              <input value={tp} onChange={e=>setTp(e.target.value)} type="number" step="any" placeholder="2460.00" style={input} />
            </div>
          </div>
          {rr && (
            <div style={{ padding:'8px 12px', background:'rgba(16,185,129,.06)', borderLeft:'3px solid #10b981', font:'700 11px/1 var(--font-mono)', color:'#10b981', letterSpacing:'.1em' }}>
              RR: 1:{rr.toFixed(2)}
            </div>
          )}
          <div>
            <div style={fLabel}>Timeframe</div>
            <div style={{ display:'flex', gap:6 }}>
              {TIMEFRAMES.map(t => (
                <button key={t} type="button" onClick={() => setTf(t)}
                  style={{ ...chip, ...(tf===t ? chipActive : {}) }}>{t}</button>
              ))}
            </div>
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
          <div>
            <div style={fLabel}>Notas (opcional)</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Confluencias, contexto del setup..." style={{ ...input, resize:'vertical', lineHeight:1.5 }} />
          </div>
          <button type="submit" disabled={isPending} style={{ padding:'12px 0', background: isPending ? 'rgba(16,185,129,.4)':'#10b981', color:'#000', border:'none', cursor: isPending ? 'not-allowed':'pointer', font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.35em', textTransform:'uppercase' }}>
            {isPending ? 'Publicando...' : 'Publicar señal'}
          </button>
        </form>
      </div>

      <div style={card}>
        <span style={sLabel}>Señales activas ({list.filter(s=>s.status==='active').length})</span>
        {list.length === 0 ? (
          <div style={{ padding:'32px 0', textAlign:'center', color:'#525252', font:'400 12px/1 var(--font-sans)' }}>Sin señales</div>
        ) : (
          <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6 }}>
            {list.map(s => {
              const col = s.direction === 'LONG' ? '#10b981' : '#ef4444'
              const sc = STATUS_COLOR[s.status] ?? '#737373'
              return (
                <li key={s.id} style={{ padding:'12px 14px', background:'rgba(10,10,10,.5)', borderLeft:`3px solid ${col}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ font:'900 italic 14px/1 var(--font-sans)', color:'#f5f5f5', letterSpacing:'.04em' }}>{s.pair}</span>
                      <span style={{ font:'900 italic 10px/1 var(--font-sans)', color:col, letterSpacing:'.2em', textTransform:'uppercase' }}>
                        {s.direction === 'LONG' ? '▲' : '▼'} {s.direction}
                      </span>
                      {s.timeframe && <span style={{ font:'400 9px/1 var(--font-mono)', color:'#525252', letterSpacing:'.1em' }}>{s.timeframe}</span>}
                    </div>
                    <div style={{ display:'flex', gap:5 }}>
                      <span style={{ padding:'3px 7px', background:`${sc}15`, border:`1px solid ${sc}30`, font:'700 8px/1 var(--font-sans)', color:sc, letterSpacing:'.2em', textTransform:'uppercase' }}>{s.status}</span>
                      <button onClick={() => handleDelete(s.id)} style={{ padding:'3px 6px', background:'transparent', color:'rgba(239,68,68,.5)', border:'1px solid rgba(239,68,68,.2)', cursor:'pointer', font:'10px/1 var(--font-sans)' }}>✕</button>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:6 }}>
                    {[['ENTRY', fmt(s.entry)],['SL', fmt(s.sl)],['TP', fmt(s.tp)]].map(([l,v]) => (
                      <div key={l} style={{ background:'rgba(0,0,0,.3)', padding:'6px 8px' }}>
                        <div style={{ font:'700 7px/1 var(--font-mono)', color:'#525252', letterSpacing:'.2em', marginBottom:3 }}>{l}</div>
                        <div style={{ font:'700 11px/1 var(--font-mono)', color:'#f5f5f5' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {s.rr && <div style={{ font:'700 10px/1 var(--font-mono)', color:'#10b981', letterSpacing:'.1em', marginBottom:6 }}>RR 1:{Number(s.rr).toFixed(2)}</div>}
                  <div style={{ display:'flex', gap:5, justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ font:'400 9px/1 var(--font-mono)', color:'#404040', letterSpacing:'.1em' }}>{timeAgo(s.posted_at)}</span>
                    <div style={{ display:'flex', gap:4 }}>
                      {STATUSES.filter(st => st !== s.status).map(st => (
                        <button key={st} onClick={() => handleStatus(s.id, st)}
                          style={{ padding:'3px 8px', background:'transparent', color: STATUS_COLOR[st], border:`1px solid ${STATUS_COLOR[st]}40`, cursor:'pointer', font:'700 7px/1 var(--font-sans)', letterSpacing:'.15em', textTransform:'uppercase' }}>
                          {st}
                        </button>
                      ))}
                    </div>
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

const card: React.CSSProperties = { background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', padding:22 }
const sLabel: React.CSSProperties = { display:'block', font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.4em', textTransform:'uppercase', color:'#10b981', marginBottom:18 }
const fLabel: React.CSSProperties = { display:'block', font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#737373', marginBottom:7 }
const input: React.CSSProperties = { width:'100%', background:'rgba(10,10,10,.7)', border:'1px solid rgba(64,64,64,.6)', color:'#f5f5f5', padding:'9px 11px', font:'400 13px/1 var(--font-sans)', outline:'none', boxSizing:'border-box' }
const chip: React.CSSProperties = { padding:'4px 8px', background:'rgba(10,10,10,.7)', border:'1px solid rgba(64,64,64,.5)', color:'#737373', cursor:'pointer', font:'700 9px/1 var(--font-mono)', letterSpacing:'.1em' }
const chipActive: React.CSSProperties = { background:'#10b981', color:'#000', border:'none' }
const successBar: React.CSSProperties = { background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.25)', borderLeft:'3px solid #10b981', padding:'9px 12px', font:'400 11px/1 var(--font-sans)', color:'#10b981', marginBottom:14 }
const errorBar: React.CSSProperties = { background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', borderLeft:'3px solid #ef4444', padding:'9px 12px', font:'400 11px/1 var(--font-sans)', color:'#ef4444', marginBottom:14 }
