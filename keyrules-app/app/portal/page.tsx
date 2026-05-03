import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import CockpitClient from './cockpit-client'

export const dynamic = 'force-dynamic'

export default async function PortalPage() {
  const profile = await requireProfile()
  const supabase = await createClient()

  const [{ data: trades }, { data: biasRaw }, { data: meetRaw }] = await Promise.all([
    supabase.from('journal_trades').select('result_pct, taken_at').eq('user_id', profile.id),
    supabase.from('bias').select('*').not('published_at', 'is', null).order('published_at', { ascending: false }).limit(1),
    supabase.from('meet_config').select('*').eq('active', true).limit(1),
  ])

  const tradeList = trades ?? []
  const wins = tradeList.filter((t: { result_pct: number | null }) => (t.result_pct ?? 0) > 0).length
  const total = tradeList.length
  const winRate = total > 0 ? Math.round(wins / total * 100) : 0
  const pnlPct = tradeList.reduce((acc: number, t: { result_pct: number | null }) => acc + (t.result_pct ?? 0), 0)
  const todayBias = biasRaw?.[0] ?? null
  const nextMeet = meetRaw?.[0] ?? null

  const name = profile.name ?? profile.email.split('@')[0]
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <CockpitClient
      userName={name}
      userInitials={initials}
      plan={profile.plan ?? 'free'}
      stats={{ total, winRate, pnlPct }}
      todayBias={todayBias}
      nextMeet={nextMeet}
    />
  )
}
