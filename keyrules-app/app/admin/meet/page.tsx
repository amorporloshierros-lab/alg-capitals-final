import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import MeetEditor from './meet-editor'

export const dynamic = 'force-dynamic'

export default async function AdminMeetPage() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: meet } = await supabase.from('meet_config').select('*').eq('id', 1).single()
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={tag}>◎ Próximo Meet</div>
        <div style={title}>Configurar banner de meet</div>
      </div>
      <MeetEditor initial={meet} />
    </div>
  )
}

const tag: React.CSSProperties = { font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }
const title: React.CSSProperties = { font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }
