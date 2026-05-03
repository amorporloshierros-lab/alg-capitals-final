'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import type { BiasDir, PlanTier } from '@/types/database'

export interface BiasFormData {
  pair: string
  direction: BiasDir
  session: string
  analysis_md: string
  video_url: string
  min_plan: PlanTier
  publish: boolean
}

export async function createBias(data: BiasFormData) {
  const admin = await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any

  const { error } = await supabase.from('bias').insert({
    pair: data.pair.toUpperCase(),
    direction: data.direction,
    session: data.session || null,
    analysis_md: data.analysis_md || null,
    video_url: data.video_url || null,
    min_plan: data.min_plan,
    published_at: data.publish ? new Date().toISOString() : null,
    created_by: admin.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/bias')
  revalidatePath('/portal/bias')
}

export async function updateBias(id: string, data: Partial<BiasFormData>) {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any

  const { error } = await supabase.from('bias').update({
    ...(data.pair      !== undefined && { pair: data.pair.toUpperCase() }),
    ...(data.direction !== undefined && { direction: data.direction }),
    ...(data.session   !== undefined && { session: data.session || null }),
    ...(data.analysis_md !== undefined && { analysis_md: data.analysis_md || null }),
    ...(data.video_url !== undefined && { video_url: data.video_url || null }),
    ...(data.min_plan  !== undefined && { min_plan: data.min_plan }),
    ...(data.publish   !== undefined && {
      published_at: data.publish ? new Date().toISOString() : null
    }),
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/bias')
  revalidatePath('/portal/bias')
}

export async function deleteBias(id: string) {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any
  const { error } = await supabase.from('bias').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/bias')
  revalidatePath('/portal/bias')
}

export async function togglePublishBias(id: string, publish: boolean) {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any
  const { error } = await supabase.from('bias').update({
    published_at: publish ? new Date().toISOString() : null,
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/bias')
  revalidatePath('/portal/bias')
}
