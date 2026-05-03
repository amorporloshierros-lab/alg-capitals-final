'use client'

import { useState, useTransition, Fragment } from 'react'

type Student = {
  id: string; name: string | null; email: string; role: string | null
  plan: string | null; plan_expires_at: string | null; created_at: string
}

const PLANS = ['starter', 'pro', 'elite']
const PLAN_COLOR: Record<string, string> = { starter:'#a3a3a3', pro:'#10b981', elite:'#fbbf24' }

export default function StudentsEditor({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState(initialStudents)
  const [editing, setEditing] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [editPlan, setEditPlan] = useState('')
  const [editExpiry, setEditExpiry] = useState('')
  const [editRole, setEditRole] = useState('')
  const [search, setSearch] = useState('')
  const [feedback, setFeedback] = useState<{id:string; msg:string; ok:boolean} | null>(null)

  function openEdit(s: Student) {
    setEditing(s.id)
    setEditPlan(s.plan ?? '')
    setEditExpiry(s.plan_expires_at ? s.plan_expires_at.split('T')[0] : '')
    setEditRole(s.role ?? 'student')
  }

  function showFeedback(id: string, msg: string, ok: boolean) {
    setFeedback({ id, msg, ok })
    setTimeout(() => setFeedback(null), 3000)
  }

  async function handleSave(id: string) {
    startTransition(async () => {
      try {
        const body: Record<string, string | null> = {
          plan: editPlan || null,
          plan_expires_at: editExpiry ? new Date(editExpiry + 'T23:59:59').toISOString() : null,
          role: editRole || null,
        }
        const res = await fetch(`/api/admin/students/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) { showFeedback(id, data.error, false); return }
        setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
        setEditing(null)
        showFeedback(id, 'Guardado', true)
      } catch {
        showFeedback(id, 'Error al guardar', false)
      }
    })
  }

  const filtered = students.filter(s =>
    !search ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.name ?? '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre o email..."
          style={{ flex:1, maxWidth:320, padding:'9px 14px', background:'rgba(5,5,5,.8)', border:'1px solid #262626', color:'#f5f5f5', font:'400 12px/1 var(--font-sans)', outline:'none' }}/>
        <div style={{ font:'700 9px/1 var(--font-mono)', color:'#525252', letterSpacing:'.2em' }}>
          {filtered.length} alumno{filtered.length!==1?'s':''}
        </div>
      </div>

      <div style={{ background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(16,185,129,.15)' }}>
              {['','Nombre / Email','Rol','Plan','Vence','Registrado','Acciones'].map(h => (
                <th key={h} style={{ padding:'12px 14px', font:'900 italic 7px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#10b981', whiteSpace:'nowrap', textAlign:'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const isEditing = editing === s.id
              const fb = feedback?.id === s.id ? feedback : null
              return (
                <Fragment key={s.id}>
                  <tr style={{ borderBottom:'1px solid rgba(38,38,38,.5)', background: i%2===0?'transparent':'rgba(10,10,10,.2)' }}>
                    <td style={{ padding:'10px 14px', width:32 }}>
                      <div style={{ width:28, height:28, background:'#10b981', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', font:'900 italic 10px/1 var(--font-sans)', flexShrink:0 }}>
                        {(s.name ?? s.email)[0].toUpperCase()}
                      </div>
                    </td>
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ font:'700 12px/1 var(--font-sans)', color:'#f5f5f5', marginBottom:3 }}>{s.name ?? '—'}</div>
                      <div style={{ font:'400 10px/1 var(--font-mono)', color:'#525252' }}>{s.email}</div>
                    </td>
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ padding:'3px 8px', background: s.role==='admin'?'rgba(251,191,36,.1)':'rgba(16,185,129,.08)', color: s.role==='admin'?'#fbbf24':'#10b981', font:'700 8px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase' }}>
                        {s.role ?? 'student'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 14px' }}>
                      {s.plan ? (
                        <span style={{ padding:'3px 8px', background:`${PLAN_COLOR[s.plan]}18`, color:PLAN_COLOR[s.plan]??'#10b981', font:'700 8px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase' }}>
                          {s.plan}
                        </span>
                      ) : <span style={{ color:'#404040', font:'400 11px/1 var(--font-sans)' }}>sin plan</span>}
                    </td>
                    <td style={{ padding:'10px 14px', font:'400 10px/1 var(--font-mono)', color:'#525252' }}>
                      {s.plan_expires_at ? new Date(s.plan_expires_at).toLocaleDateString('es-AR') : '—'}
                    </td>
                    <td style={{ padding:'10px 14px', font:'400 10px/1 var(--font-mono)', color:'#404040' }}>
                      {new Date(s.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => isEditing ? setEditing(null) : openEdit(s)}
                          style={{ padding:'5px 10px', background: isEditing?'rgba(245,158,11,.12)':'rgba(16,185,129,.08)', border: isEditing?'1px solid rgba(245,158,11,.3)':'1px solid rgba(16,185,129,.25)', color: isEditing?'#f59e0b':'#10b981', font:'700 8px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor:'pointer' }}>
                          {isEditing ? 'Cancelar' : 'Editar'}
                        </button>
                        <a href="/portal" style={{ padding:'5px 10px', background:'rgba(129,140,248,.08)', border:'1px solid rgba(129,140,248,.2)', color:'#818cf8', font:'700 8px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', textDecoration:'none', display:'inline-block' }}>
                          Portal
                        </a>
                      </div>
                      {fb && (
                        <div style={{ marginTop:4, font:'400 9px/1 var(--font-mono)', color: fb.ok?'#10b981':'#ef4444' }}>{fb.msg}</div>
                      )}
                    </td>
                  </tr>
                  {isEditing && (
                    <tr key={`${s.id}-edit`} style={{ background:'rgba(16,185,129,.03)', borderBottom:'1px solid rgba(16,185,129,.15)' }}>
                      <td colSpan={7} style={{ padding:'16px 20px' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:12, alignItems:'end' }}>
                          <div>
                            <div style={{ font:'700 7px/1 var(--font-mono)', color:'#525252', letterSpacing:'.3em', textTransform:'uppercase', marginBottom:6 }}>Plan</div>
                            <div style={{ display:'flex', gap:6 }}>
                              {['', ...PLANS].map(p => (
                                <button key={p} type="button" onClick={() => setEditPlan(p)}
                                  style={{ padding:'6px 10px', background: editPlan===p ? `${PLAN_COLOR[p]??'#262626'}18`:'rgba(10,10,10,.7)', border: editPlan===p ? `1px solid ${PLAN_COLOR[p]??'#525252'}40`:'1px solid #262626', color: editPlan===p ? PLAN_COLOR[p]??'#737373':'#525252', font:'700 8px/1 var(--font-sans)', letterSpacing:'.15em', textTransform:'uppercase', cursor:'pointer' }}>
                                  {p || 'ninguno'}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div style={{ font:'700 7px/1 var(--font-mono)', color:'#525252', letterSpacing:'.3em', textTransform:'uppercase', marginBottom:6 }}>Vencimiento</div>
                            <input type="date" value={editExpiry} onChange={e=>setEditExpiry(e.target.value)}
                              style={{ padding:'8px 10px', background:'rgba(5,5,5,.8)', border:'1px solid #262626', color:'#f5f5f5', font:'400 11px/1 var(--font-sans)', outline:'none', width:'100%' }}/>
                          </div>
                          <div>
                            <div style={{ font:'700 7px/1 var(--font-mono)', color:'#525252', letterSpacing:'.3em', textTransform:'uppercase', marginBottom:6 }}>Rol</div>
                            <div style={{ display:'flex', gap:6 }}>
                              {['student','admin'].map(r => (
                                <button key={r} type="button" onClick={() => setEditRole(r)}
                                  style={{ padding:'6px 10px', background: editRole===r?'rgba(251,191,36,.1)':'rgba(10,10,10,.7)', border: editRole===r?'1px solid rgba(251,191,36,.3)':'1px solid #262626', color: editRole===r?'#fbbf24':'#525252', font:'700 8px/1 var(--font-sans)', letterSpacing:'.15em', textTransform:'uppercase', cursor:'pointer' }}>
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button onClick={() => handleSave(s.id)} disabled={isPending}
                            style={{ padding:'10px 20px', background:'#10b981', color:'#000', border:'none', font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', cursor:'pointer' }}>
                            {isPending ? '...' : 'Guardar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:'32px', textAlign:'center', color:'#525252', font:'400 12px/1 var(--font-sans)' }}>Sin resultados</div>
        )}
      </div>
    </div>
  )
}
