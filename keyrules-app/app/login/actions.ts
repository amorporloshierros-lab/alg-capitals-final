'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent(error?.message || 'Login failed')}`)
  }

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', data.user.id).single()

  if (profile?.role === 'admin') {
    redirect('/admin/bias')
  }
  
  redirect('/portal')
}
