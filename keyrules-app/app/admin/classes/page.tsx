import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import ClassesEditor from './classes-editor'

export const dynamic = 'force-dynamic'

export default async function AdminClassesPage() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: classes } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false })
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={tag}>▶ Clases & Replays</div>
        <div style={title}>Gestionar contenido educativo</div>
      </div>
      <ClassesEditor initialList={classes ?? []} />
    </div>
  )
}
const tag: React.CSSProperties = { font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }
const title: React.CSSProperties = { font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }
