import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import AiEditor from './ai-editor'

export const dynamic = 'force-dynamic'

export default async function AdminAiPage() {
  await requireAdmin()
  const supabase = createAdminClient()
  
  const { data } = await supabase.from('bot_config').select('*').eq('id', 1).single()

  return (
    <div>
      <AiEditor config={data} />
    </div>
  )
}
