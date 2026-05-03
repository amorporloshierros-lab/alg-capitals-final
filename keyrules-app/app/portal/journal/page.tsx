import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import JournalClient from './journal-client'

export const dynamic = 'force-dynamic'

export default async function PortalJournalPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: trades } = await supabase
    .from('journal_trades')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={tag}>◇ Journal</div>
        <div style={title}>Registro de operaciones</div>
      </div>
      <JournalClient userId={user.id} initialTrades={trades ?? []} />
    </div>
  )
}

const tag: React.CSSProperties = { font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }
const title: React.CSSProperties = { font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }
