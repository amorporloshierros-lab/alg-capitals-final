'use client'

import { useState, useTransition, useCallback } from 'react'

type Student = { id: string; name: string | null; email: string; plan: string | null }
type License = {
  id: string; user_id: string; product: string; license_key: string
  notes: string | null; expires_at: string | null; active: boolean; created_at: string
  profiles?: { name: string | null; email: string }
}

const PRODUCTS = [
  { id:'oracle_mt5_full', label:'Oracle MT5 · Full',        prefix:'ORCL' },
  { id:'keywick_pro',     label:'Keywick Pro Indicator',    prefix:'KWCK' },
  { id:'bias_telegram',   label:'Bias Channel · Telegram',  prefix:'TGVP' },
  { id:'discord_elite',   label:'Discord Elite Access',     prefix:'DISC' },
  { id:'libro_keywick',   label:'Libro KEYWICK · Digital',  prefix:'BOOK' },
  { id:'oracle_lite',     label:'Oracle MT5 · Lite',        prefix:'ORLT' },
]

const PRODUCT_COLOR: Record<string, string> = {
  oracle_mt5_full: '#10b981', keywick_pro:'#fbbf24', bias_telegram:'#34d399',
  discord_elite:'#818cf8', libro_keywick:'#f472b6', oracle_lite:'#a3a3a3',
}

function s(base: React.CSSProperties, extra?: React.CSSProperties): React.CSSProperties {
  return { ...base, ...extra }
}

const card: React.CSSProperties = { background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', padding:20 }
const fLabel: React.CSSProperties = { font:'900 italic 7px/1 var(--font-sans)', letterSpacing:'.4em', color:'#525252', textTransform:'uppercase', marginBottom:8 }
const input: React.CSSProperties = { width:'100%', padding:'9px 12px', background:'rgba(5,5,5,.8)', border:'1px solid #262626', color:'#f5f5f5', font:'400 12px/1 var(--font-sans)', outline:'none', boxSizing:'border-box' }
const errBar: React.CSSProperties = { padding:'8px 12px', background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', color:'#fca5a5', font:'400 11px/1 var(--font-sans)', marginBottom:12 }
const okBar: React.CSSProperties = { padding:'8px 12px', background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.3)', color:'#6ee7b7', font:'400 11px/1 var(--font-sans)', marginBottom:12 }

export default function LicensesEditor({ students, initialLicenses }: { students: Student[]; initialLicenses: License[] }) {
  const [licenses, setLicenses] = useState(initialLicenses)
  const [isPending, startTransition] = useTransition()
  const [userId, setUserId] = useState('')
  const [product, setProduct] = useState('oracle_mt5_full')
  const [customKey, setCustomKey] = useState('')
  const [notes, setNotes] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [success, setSuccess] = useState<string|null>(null)
  const [search, setSearch] = useState('')
  const [filterProduct, setFilterProduct] = useState('all')

  const filteredStudents = students.filter(st =>
    (st.name?.toLowerCase().includes(search.toLowerCase()) ||
     st.email.toLowerCase().includes(search.toLowerCase())))

  const filteredLicenses = licenses.filter(l =>
    filterProduct === 'all' || l.product === filterProduct)

  function showSuccess(msg: string) {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 3000)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) { setError('Seleccioná un alumno'); return }
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/licenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, product, notes: notes||null, expires_at: expiresAt||null, custom_key: customKey||null }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error); return }
        const student = students.find(s => s.id === userId)
        setLicenses(prev => [{ ...data, profiles: student ? { name: student.name, email: student.email } : undefined }, ...prev])
        setCustomKey(''); setNotes(''); setExpiresAt('')
        showSuccess(`Licencia generada: ${data.license_key}`)
      } catch { setError('Error al generar licencia') }
    })
  }

  async function handleRevoke(id: string) {
    if (!confirm('¿Revocar esta licencia?')) return
    startTransition(async () => {
      try {
        await fetch(`/api/admin/licenses/${id}`, { method: 'DELETE' })
        setLicenses(prev => prev.filter(l => l.id !== id))
      } catch {}
    })
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key)
    showSuccess(`Copiado: ${key}`)
  }

  const grouped = filteredLicenses.reduce<Record<string, License[]>>((acc, l) => {
    const uid = l.user_id
    if (!acc[uid]) acc[uid] = []
    acc[uid].push(l)
    return acc
  }, {})

  return (
    <div style={{ display:'grid', gridTemplateColumns:'380px 1fr', gap:20, alignItems:'start' }}>

      {/* FORM */}
      <div style={card}>
        <div style={{ font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.4em', color:'#10b981', textTransform:'uppercase', marginBottom:16 }}>+ Generar Licencia</div>
        {error   && <div style={errBar}>{error}</div>}
        {success && <div style={okBar}>{success}</div>}
        <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:14 }}>

          <div>
            <div style={fLabel}>Buscar alumno</div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nombre o email..." style={input}/>
            {search && filteredStudents.length > 0 && (
              <div style={{ border:'1px solid #262626', background:'#0a0a0a', maxHeight:160, overflowY:'auto', marginTop:4 }}>
                {filteredStudents.map(st => (
                  <div key={st.id} onClick={() => { setUserId(st.id); setSearch('') }}
                    style={{ padding:'8px 12px', cursor:'pointer', borderBottom:'1px solid #171717', background: userId===st.id ? 'rgba(16,185,129,.08)':'transparent' }}>
                    <div style={{ font:'700 11px/1 var(--font-sans)', color:'#f5f5f5' }}>{st.name ?? st.email}</div>
                    <div style={{ font:'400 9px/1 var(--font-mono)', color:'#525252', marginTop:3 }}>{st.email} · {st.plan ?? 'sin plan'}</div>
                  </div>
                ))}
              </div>
            )}
            {userId && (
              <div style={{ marginTop:6, padding:'6px 10px', background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.2)', font:'700 10px/1 var(--font-sans)', color:'#10b981', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                {students.find(s=>s.id===userId)?.name ?? students.find(s=>s.id===userId)?.email}
                <span onClick={()=>setUserId('')} style={{ cursor:'pointer', color:'#525252', fontSize:12 }}>✕</span>
              </div>
            )}
          </div>

          <div>
            <div style={fLabel}>Producto</div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {PRODUCTS.map(p => (
                <button key={p.id} type="button" onClick={() => setProduct(p.id)}
                  style={{ padding:'9px 12px', textAlign:'left', background: product===p.id ? `${PRODUCT_COLOR[p.id]}12`:'rgba(10,10,10,.7)', border: product===p.id ? `1px solid ${PRODUCT_COLOR[p.id]}40`:'1px solid #1f1f1f', color: product===p.id ? PRODUCT_COLOR[p.id]:'#737373', font:'700 10px/1 var(--font-sans)', letterSpacing:'.1em', cursor:'pointer', display:'flex', justifyContent:'space-between' }}>
                  <span>{p.label}</span>
                  <span style={{ font:'400 8px/1 var(--font-mono)', opacity:.6 }}>{p.prefix}-XXXX-ALG</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={fLabel}>Key personalizada (opcional)</div>
            <input value={customKey} onChange={e=>setCustomKey(e.target.value)} placeholder="ORCL-AB12-CD34-ALG (auto si vacío)" style={input}/>
          </div>

          <div>
            <div style={fLabel}>Notas (opcional)</div>
            <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="ej: Incluido en plan Elite 2024" style={input}/>
          </div>

          <div>
            <div style={fLabel}>Vence (opcional)</div>
            <input type="date" value={expiresAt} onChange={e=>setExpiresAt(e.target.value)} style={input}/>
          </div>

          <button type="submit" disabled={isPending || !userId}
            style={{ padding:'12px 0', background: (!userId||isPending) ? 'rgba(16,185,129,.3)':'#10b981', color:'#000', border:'none', cursor: (!userId||isPending) ? 'not-allowed':'pointer', font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.4em', textTransform:'uppercase' }}>
            {isPending ? 'Generando...' : '⬢ Generar Licencia'}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.4em', color:'#10b981', textTransform:'uppercase' }}>
            {licenses.length} licencias emitidas
          </div>
          <select value={filterProduct} onChange={e=>setFilterProduct(e.target.value)}
            style={{ padding:'6px 10px', background:'#0a0a0a', border:'1px solid #262626', color:'#a3a3a3', font:'400 10px/1 var(--font-mono)', outline:'none' }}>
            <option value="all">Todos los productos</option>
            {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div style={{ padding:'40px', textAlign:'center', color:'#404040', font:'400 12px/1 var(--font-sans)', border:'1px solid #1f1f1f' }}>Sin licencias generadas</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {Object.entries(grouped).map(([uid, lics]) => {
              const profile = lics[0]?.profiles
              const studentInfo = profile ?? students.find(s=>s.id===uid)
              return (
                <div key={uid} style={{ background:'rgba(23,23,23,.4)', border:'1px solid #1f1f1f' }}>
                  <div style={{ padding:'10px 16px', borderBottom:'1px solid #1f1f1f', display:'flex', alignItems:'center', gap:10, background:'rgba(10,10,10,.4)' }}>
                    <div style={{ width:28, height:28, background:'#10b981', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', font:'900 italic 10px/1 var(--font-sans)' }}>
                      {(studentInfo?.name ?? studentInfo?.email ?? '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ font:'700 11px/1 var(--font-sans)', color:'#f5f5f5' }}>{studentInfo?.name ?? '—'}</div>
                      <div style={{ font:'400 9px/1 var(--font-mono)', color:'#525252' }}>{studentInfo?.email}</div>
                    </div>
                    <div style={{ marginLeft:'auto', font:'700 8px/1 var(--font-mono)', color:'#737373' }}>{lics.length} licencia{lics.length>1?'s':''}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                    {lics.map((l, i) => {
                      const col = PRODUCT_COLOR[l.product] ?? '#10b981'
                      const prod = PRODUCTS.find(p=>p.id===l.product)
                      const expired = l.expires_at && new Date(l.expires_at) < new Date()
                      return (
                        <div key={l.id} style={{ display:'grid', gridTemplateColumns:'3px 1fr auto', alignItems:'center', borderTop: i>0 ? '1px solid #171717':'none' }}>
                          <div style={{ background: expired ? '#ef4444' : col, height:'100%', alignSelf:'stretch', minHeight:44 }}/>
                          <div style={{ padding:'10px 14px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                              <span style={{ font:'700 10px/1 var(--font-sans)', color:'#f5f5f5' }}>{prod?.label ?? l.product}</span>
                              {expired && <span style={{ font:'700 7px/1 var(--font-mono)', color:'#ef4444', letterSpacing:'.2em' }}>VENCIDA</span>}
                              {!l.active && <span style={{ font:'700 7px/1 var(--font-mono)', color:'#737373', letterSpacing:'.2em' }}>INACTIVA</span>}
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <code style={{ font:'700 11px/1 var(--font-mono)', color:col, letterSpacing:'.08em' }}>{l.license_key}</code>
                              <button onClick={() => copyKey(l.license_key)} style={{ background:'transparent', border:'none', color:'#525252', cursor:'pointer', fontSize:11, padding:0 }}>⎘</button>
                            </div>
                            {l.notes && <div style={{ font:'400 9px/1 var(--font-sans)', color:'#525252', marginTop:3 }}>{l.notes}</div>}
                            {l.expires_at && <div style={{ font:'400 8px/1 var(--font-mono)', color: expired?'#ef4444':'#525252', marginTop:3 }}>Vence: {new Date(l.expires_at).toLocaleDateString('es-AR')}</div>}
                          </div>
                          <div style={{ padding:'0 14px' }}>
                            <button onClick={() => handleRevoke(l.id)} style={{ background:'transparent', border:'1px solid rgba(239,68,68,.2)', color:'#ef4444', font:'700 7px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', padding:'4px 8px', cursor:'pointer' }}>
                              Revocar
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
