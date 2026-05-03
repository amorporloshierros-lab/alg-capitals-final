import { createClient } from '@/lib/supabase/server'
import BiasEditor from './bias-editor'

export const dynamic = 'force-dynamic'

export default async function AdminBiasPage() {
  const supabase = await createClient()

  const { data: biasList } = await supabase
    .from('bias')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          font: '900 italic 9px/1 var(--font-sans)',
          letterSpacing: '.5em',
          textTransform: 'uppercase',
          color: '#10b981',
          marginBottom: 6,
        }}>
          ▲ Bias Diario
        </div>
        <div style={{
          font: '900 italic 22px/1 var(--font-sans)',
          color: '#f5f5f5',
          textTransform: 'uppercase',
          letterSpacing: '.05em',
        }}>
          Publicar & gestionar bias
        </div>
      </div>

      <BiasEditor initialList={biasList ?? []} />
    </div>
  )
}
