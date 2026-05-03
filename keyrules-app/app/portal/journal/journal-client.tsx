'use client'

import { useState, useTransition } from 'react'

type Trade = {
  id: string
  user_id: string
  pair: string | null
  direction: string | null
  entry: number | null
  sl: number | null
  tp: number | null
  result_pct: number | null
  notes: string | null
  taken_at: string
}

const PAIRS = ['XAUUSD','EURUSD','NAS100','BTCUSD','GBPUSD','US30']

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'2-digit' })
}

export default function JournalClient({ userId, initialTrades }: { userId: string; initialTrades: Trade[] }) {
  const [trades, setTrades] = useState(initialTrades)
  const [isPending, startTransition] = useTransition()
  const [pair, setPair] = useState('XAUUSD')
  const [direction, setDirection] = useState<'LONG'|'SHORT'>('LONG')
  const [entry, setEntry] = useState('')
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')
  const [result, setResult] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [success, setSuccess] = useState(false)

  const winRate = trades.length ? Math.round(trades.filter(t => (t.result_pct ?? 0) > 0).length / trades.length * 100) : 0
  const totalPct = trades.reduce((acc, t) => acc + (t.result_pct ?? 0), 0)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId, pair, direction,
            entry: entry ? Number(entry) : null,
            sl: sl ? Number(sl) : null,
            tp: tp ? Number(tp) : null,
            result_pct: result ? Number(result) : null,
            notes: notes || null,
          }),
        })
        if (!res.ok) throw new Error(await res.text())
        const created = await res.json()
        setTrades(prev => [created, ...prev])
        setEntry(''); setSl(''); setTp(''); setResult(''); setNotes('')
        setSuccess(true); setTimeout(() => setSuccess(false), 2000)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error')
      }
    })
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await fetch(`/api/journal/${id}`, { method: 'DELETE' })
      setTrades(prev => prev.filter(t => t.id !== id))
    })
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:20, alignItems:'start' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[['Win Rate', `${winRate}%`, winRate >= 50 ? '#10b981':'#ef4444'],['P&L Total', `${totalPct >= 0 ? '+':''}${totalPct.toFixed(2)}%`, totalPct >= 0 ? '#10b981':'#ef4444'],].map(([l,v,c]) => (
            <div key={l} style={{ background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', padding:'14px 16px' }}>
              <div style={{ font:'900 italic 7px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#525252', marginBottom:8 }}>{l}</div>
              <div style={{ font:'900 italic 20px/1 var(--font-mono)', color:c as string }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={card}>
          <span style={sLabel}>+ Registrar operación</span>
          {success && <div style={successBar}>Operación guardada</div>}
          {error && <div style={errorBar}>{error}</div>}
          <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div>
              <div style={fLabel}>Par</div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:6 }}>
                {PAIRS.map(p => <button key={p} type="button" onClick={() => setPair(p)} style={{ ...chip, ...(pair===p ? chipA:{}) }}>{p}</button>)}
              </div>
            </div>
            <div>
              <div style={fLabel}>Dirección</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                <button type="button" onClick={() => setDirection('LONG')} style={{ padding:'8px 0', background: direction==='LONG' ? '#10b981':'transparent', color: direction==='LONG' ? '#000':'#10b981', border:'1px solid rgba(16,185,129,.3)', font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor:'pointer' }}>▲ LONG</button>
                <button type="button" onClick={() => setDirection('SHORT')} style={{ padding:'8px 0', background: direction==='SHORT' ? '#ef4444':'transparent', color: direction==='SHORT' ? '#000':'#ef4444', border:'1px solid rgba(239,68,68,.3)', font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor:'pointer' }}>▼ SHORT</button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div><div style={fLabel}>Entry</div><input value={entry} onChange={e=>setEntry(e.target.value)} type="number" step="any" style={input} placeholder="2435" /></div>
              <div><div style={fLabel}>Resultado %</div><input value={result} onChange={e=>setResult(e.target.value)} type="number" step="any" style={{ ...input, color: Number(result) >= 0 ? '#10b981':'#ef4444' }} placeholder="+1.5 / -0.5" /></div>
            </div>
            <div><div style={fLabel}>Notas</div><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} style={{ ...input, resize:'vertical', lineHeight:1.5 }} placeholder="Qué salió bien, qué mejorar..." /></div>
            <button type="submit" disabled={isPending} style={{ padding:'11px 0', background: isPending ? 'rgba(16,185,129,.4)':'#10b981', color:'#000', border:'none', cursor:'pointer', font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.35em', textTransform:'uppercase' }}>
              {isPending ? 'Guardando...' : 'Registrar'}
            </button>
          </form>
        </div>
      </div>

      <div style={card}>
        <span style={sLabel}>Historial ({trades.length} operaciones)</span>
        {trades.length === 0 ? (
          <div style={{ padding:'32px 0', textAlign:'center', color:'#525252', font:'400 12px/1 var(--font-sans)' }}>Sin operaciones registradas</div>
        ) : (
          <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:5 }}>
            {trades.map(t => {
              const win = (t.result_pct ?? 0) > 0
              const col = t.result_pct == null ? '#737373' : win ? '#10b981':'#ef4444'
              return (
                <li key={t.id} style={{ padding:'10px 12px', background:'rgba(10,10,10,.5)', borderLeft:`3px solid ${col}`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                  <div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:3 }}>
                      <span style={{ font:'900 italic 12px/1 var(--font-sans)', color:'#f5f5f5', letterSpacing:'.04em' }}>{t.pair ?? '—'}</span>
                      {t.direction && <span style={{ font:'700 8px/1 var(--font-sans)', color: t.direction==='LONG' ? '#10b981':'#ef4444', letterSpacing:'.2em', textTransform:'uppercase' }}>{t.direction}</span>}
                    </div>
                    <div style={{ font:'400 9px/1 var(--font-mono)', color:'#525252', letterSpacing:'.1em' }}>{fmt(t.taken_at)}</div>
                    {t.notes && <div style={{ font:'400 10px/1.4 var(--font-sans)', color:'#737373', marginTop:4, maxWidth:240, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.notes}</div>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    {t.result_pct != null && (
                      <span style={{ font:'900 italic 14px/1 var(--font-mono)', color:col }}>
                        {t.result_pct >= 0 ? '+':''}{t.result_pct.toFixed(2)}%
                      </span>
                    )}
                    <button onClick={() => handleDelete(t.id)} style={{ padding:'3px 6px', background:'transparent', color:'rgba(239,68,68,.4)', border:'1px solid rgba(239,68,68,.2)', cursor:'pointer', font:'10px/1 var(--font-sans)' }}>✕</button>
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

const card: React.CSSProperties = { background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', padding:20 }
const sLabel: React.CSSProperties = { display:'block', font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.4em', textTransform:'uppercase', color:'#10b981', marginBottom:16 }
const fLabel: React.CSSProperties = { display:'block', font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#737373', marginBottom:6 }
const input: React.CSSProperties = { width:'100%', background:'rgba(10,10,10,.7)', border:'1px solid rgba(64,64,64,.6)', color:'#f5f5f5', padding:'9px 11px', font:'400 13px/1 var(--font-sans)', outline:'none', boxSizing:'border-box' }
const chip: React.CSSProperties = { padding:'4px 7px', background:'rgba(10,10,10,.7)', border:'1px solid rgba(64,64,64,.5)', color:'#737373', cursor:'pointer', font:'700 9px/1 var(--font-mono)', letterSpacing:'.1em' }
const chipA: React.CSSProperties = { background:'#10b981', color:'#000', border:'none' }
const successBar: React.CSSProperties = { background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.25)', borderLeft:'3px solid #10b981', padding:'8px 12px', font:'400 11px/1 var(--font-sans)', color:'#10b981', marginBottom:12 }
const errorBar: React.CSSProperties = { background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', borderLeft:'3px solid #ef4444', padding:'8px 12px', font:'400 11px/1 var(--font-sans)', color:'#ef4444', marginBottom:12 }
