'use server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

export async function saveManualStats(stats: any) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Actualizar trading_stats del perfil
  const { error } = await supabase
    .from('profiles')
    .update({ trading_stats: stats })
    .eq('id', user.id)

  if (error) throw new Error(error.message)
}
