import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import SignalsEditor from './signals-editor'

export const dynamic = 'force-dynamic'

export default async function AdminSignalsPage() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data: signals } = await supabase
    .from('signals')
    .select('*')
    .order('posted_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={pageTag}>◆ Señales</div>
        <div style={pageTitle}>Publicar & gestionar señales</div>
      </div>
      <SignalsEditor initialList={signals ?? []} />
    </div>
  )
}

const pageTag: React.CSSProperties = {
  font: '900 italic 9px/1 var(--font-sans)',
  letterSpacing: '.5em',
  textTransform: 'uppercase',
  color: '#10b981',
  marginBottom: 6,
}
const pageTitle: React.CSSProperties = {
  font: '900 italic 22px/1 var(--font-sans)',
  color: '#f5f5f5',
  textTransform: 'uppercase',
  letterSpacing: '.05em',
}
