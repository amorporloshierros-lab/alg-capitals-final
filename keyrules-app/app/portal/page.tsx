import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import CockpitClient from './cockpit-client'

export const dynamic = 'force-dynamic'

export default async function PortalPage() {
  const profile = await requireProfile()
  const supabase = await createClient()

  const [{ data: trades }, { data: biasRaw }, { data: meetRaw }, { data: signals }, { data: classProgress }, { data: classes }] = await Promise.all([
    supabase.from('journal_trades').select('result_pct, taken_at, pair, direction, notes').eq('user_id', profile.id).order('taken_at', { ascending: false }).limit(10),
    supabase.from('bias').select('*').not('published_at', 'is', null).order('published_at', { ascending: false }).limit(1),
    supabase.from('meet_config').select('*').eq('active', true).limit(1),
    supabase.from('signals').select('*').order('posted_at', { ascending: false }).limit(5),
    supabase.from('class_progress').select('class_id').eq('user_id', profile.id),
    supabase.from('classes').select('id, module').not('published_at', 'is', null),
  ])

  const tradeList = trades ?? []
  const wins = tradeList.filter((t: { result_pct: number | null }) => (t.result_pct ?? 0) > 0).length
  const total = tradeList.length
  const winRate = total > 0 ? Math.round(wins / total * 100) : 0
  const pnlPct = tradeList.reduce((acc: number, t: { result_pct: number | null }) => acc + (t.result_pct ?? 0), 0)

  const completedIds = new Set((classProgress ?? []).map((p: { class_id: string }) => p.class_id))
  const totalClasses = classes?.length ?? 0
  const completedClasses = (classes ?? []).filter((c: { id: string }) => completedIds.has(c.id)).length
  const academyPct = totalClasses > 0 ? Math.round(completedClasses / totalClasses * 100) : 0

  const name = profile.name ?? profile.email.split('@')[0]
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <CockpitClient
      userName={name}
      userInitials={initials}
      plan={profile.plan ?? 'free'}
      stats={{ total, winRate, pnlPct }}
      trades={tradeList as { result_pct: number | null; pair: string | null; direction: string | null; notes: string | null; taken_at: string }[]}
      todayBias={biasRaw?.[0] ?? null}
      nextMeet={meetRaw?.[0] ?? null}
      signals={(signals ?? []) as { id: string; pair: string; direction: string; entry: number; sl: number; tp: number; status: string; posted_at: string }[]}
      academyPct={academyPct}
      completedClasses={completedClasses}
      totalClasses={totalClasses}
    />
  )
}
