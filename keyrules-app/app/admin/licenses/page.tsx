import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import LicensesEditor from './licenses-editor'

export const dynamic = 'force-dynamic'

export default async function AdminLicensesPage() {
  await requireAdmin()
  const supabase = createAdminClient()

  const [{ data: students }, { data: licenses }] = await Promise.all([
    supabase.from('profiles').select('id, name, email, plan').order('created_at', { ascending: false }),
    supabase.from('licenses').select('*, profiles(name, email)').order('created_at', { ascending: false }),
  ])

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', textTransform:'uppercase', color:'#10b981', marginBottom:6 }}>
          ⬢ Oracle · Sistema de licencias
        </div>
        <div style={{ font:'900 italic 22px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }}>
          Gestión de Licencias
        </div>
        <div style={{ marginTop:8, font:'400 11px/1 var(--font-mono)', color:'#525252', letterSpacing:'.1em' }}>
          {licenses?.length ?? 0} licencias emitidas · {students?.length ?? 0} alumnos registrados
        </div>
      </div>

      <LicensesEditor
        students={(students ?? []) as { id: string; name: string | null; email: string; plan: string | null }[]}
        initialLicenses={(licenses ?? []) as Parameters<typeof LicensesEditor>[0]['initialLicenses']}
      />
    </div>
  )
}
