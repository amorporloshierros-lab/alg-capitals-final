import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminStudentsPage() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={tag}>● Alumnos</div>
        <div style={title}>Gestión de usuarios ({students?.length ?? 0})</div>
      </div>
      <div style={{ background:'rgba(23,23,23,.6)', border:'1px solid rgba(16,185,129,.18)', overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(16,185,129,.15)' }}>
              {['Nombre','Email','Rol','Plan','Vence','Registrado'].map(h => (
                <th key={h} style={{ padding:'12px 16px', text:'left', font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', color:'#10b981', whiteSpace:'nowrap', textAlign:'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(students ?? []).map((s, i) => (
              <tr key={s.id} style={{ borderBottom:'1px solid rgba(38,38,38,.5)', background: i%2===0 ? 'transparent':'rgba(10,10,10,.2)' }}>
                <td style={td}>{s.name ?? '—'}</td>
                <td style={{ ...td, fontFamily:'var(--font-mono)', fontSize:11, color:'#a3a3a3' }}>{s.email}</td>
                <td style={td}>
                  <span style={{ padding:'3px 8px', background: s.role==='admin' ? 'rgba(251,191,36,.1)':'rgba(16,185,129,.08)', color: s.role==='admin' ? '#fbbf24':'#10b981', font:'700 8px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase' }}>
                    {s.role}
                  </span>
                </td>
                <td style={td}>
                  {s.plan ? (
                    <span style={{ padding:'3px 8px', background:'rgba(16,185,129,.08)', color:'#10b981', font:'700 8px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase' }}>
                      {s.plan}
                    </span>
                  ) : <span style={{ color:'#404040', fontSize:11 }}>—</span>}
                </td>
                <td style={{ ...td, fontFamily:'var(--font-mono)', fontSize:10, color:'#525252' }}>
                  {s.plan_expires_at ? new Date(s.plan_expires_at).toLocaleDateString('es-AR') : '—'}
                </td>
                <td style={{ ...td, fontFamily:'var(--font-mono)', fontSize:10, color:'#525252' }}>
                  {new Date(s.created_at).toLocaleDateString('es-AR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!students || students.length === 0) && (
          <div style={{ padding:'32px', textAlign:'center', color:'#525252', font:'400 12px/1 var(--font-sans)' }}>Sin usuarios registrados</div>
        )}
      </div>
    </div>
  )
}

const tag: React.CSSProperties = { font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }
const title: React.CSSProperties = { font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }
const td: React.CSSProperties = { padding:'11px 16px', font:'400 12px/1 var(--font-sans)', color:'#d4d4d4', whiteSpace:'nowrap' }
