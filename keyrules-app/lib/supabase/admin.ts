import { createClient } from '@supabase/supabase-js'

// Cliente con service_role — solo usar en server-side (webhooks, crons, admin actions).
// NUNCA exponer al browser.
// Sin genérico Database para evitar errores de tipo never en operaciones admin.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
