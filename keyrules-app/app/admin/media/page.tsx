import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import MediaEditor from './media-editor'

export const dynamic = 'force-dynamic'

export default async function AdminMediaPage() {
  await requireAdmin()
  const supabase = createAdminClient()
  
  const { data } = await supabase.from('media_items').select('*').order('sort_order', { ascending: true })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <div style={{ font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.3em', color: '#10b981', textTransform: 'uppercase', marginBottom: 8 }}>Testimonios & Certificados</div>
          <h1 style={{ font: '900 italic 32px/1 var(--font-sans)', color: '#f5f5f5', textTransform: 'uppercase', margin: 0 }}>Media Items</h1>
        </div>
      </div>
      <MediaEditor initialItems={data ?? []} />
    </div>
  )
}
