import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import StudentsEditor from './students-editor'

export const dynamic = 'force-dynamic'

export default async function AdminStudentsPage() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const planCount = (students ?? []).reduce<Record<string, number>>((acc, s) => {
    const p = s.plan ?? 'sin plan'
    acc[p] = (acc[p] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }}>
          ● Alumnos
        </div>
        <div style={{ font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }}>
          Gestión de Usuarios
        </div>
      </div>

      {/* Resumen */}
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        {[
          { label:'Total', value: String(students?.length ?? 0), color:'#f5f5f5' },
          { label:'Starter', value: String(planCount['starter'] ?? 0), color:'#a3a3a3' },
          { label:'Pro',     value: String(planCount['pro']     ?? 0), color:'#10b981' },
          { label:'Elite',   value: String(planCount['elite']   ?? 0), color:'#fbbf24' },
          { label:'Sin plan',value: String(planCount['sin plan']?? 0), color:'#525252' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding:'12px 20px', background:'rgba(23,23,23,.6)', border:'1px solid #1f1f1f', minWidth:80 }}>
            <div style={{ font:'700 7px/1 var(--font-mono)', color:'#525252', letterSpacing:'.3em', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
            <div style={{ font:'900 italic 22px/1 var(--font-sans)', color }}>{value}</div>
          </div>
        ))}
      </div>

      <StudentsEditor initialStudents={(students ?? []) as Parameters<typeof StudentsEditor>[0]['initialStudents']} />
    </div>
  )
}
