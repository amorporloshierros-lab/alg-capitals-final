'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function markClassCompleted(classId: string) {
  const user = await requireAuth()
  const supabase = await createClient()
  
  await supabase.from('class_progress').insert({
    user_id: user.id,
    class_id: classId
  })
  
  revalidatePath('/portal/academia')
  revalidatePath(`/portal/academia/${classId}`)
}
