'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function saveBotConfig(data: { is_active: boolean; telegram_bot_token: string; openai_api_key: string; openai_assistant_id: string; system_prompt: string }) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('bot_config').update(data).eq('id', 1)
  if (error) throw new Error(error.message)
}
