import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import type { Database, UserRole, PlanTier } from '@/types/database'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

// Retorna el usuario autenticado o redirige al login.
export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return user
}

// Retorna el profile completo usando service role (saltea RLS).
export async function requireProfile(): Promise<ProfileRow> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  return profile
}

// Requiere rol admin o redirige al home.
export async function requireAdmin() {
  const profile = await requireProfile()
  if (profile.role !== 'admin') redirect('/')
  return profile
}

// Verifica si el plan del usuario tiene acceso al contenido de min_plan.
export function canAccess(userPlan: PlanTier | null, expiresAt: string | null, minPlan: PlanTier): boolean {
  if (!userPlan) return false
  const now = Date.now()
  if (expiresAt && new Date(expiresAt).getTime() < now) return false
  const level: Record<PlanTier, number> = { 