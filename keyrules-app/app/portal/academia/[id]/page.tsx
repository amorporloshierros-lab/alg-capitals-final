import { createClient } from '@/lib/supabase/server'
import { requireProfile, canAccess } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MuxClient from './mux-client'
import CompleteButton from './complete-button'

export const dynamic = 'force-dynamic'

export default async function ClassVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await requireProfile()
  const supabase = await createClient()

  const { data: c } = await supabase.from('classes').select('*').eq('id', id).single()
  if (!c) redirect('/portal/academia')

  if (!canAccess(profile.plan, profile.plan_expires_at, c.min_plan as 'pro'|'elite')) {
    redirect('/portal/academia')
  }

  // Check if completed
  const { data: prog } = await supabase.from('class_progress').select('*').eq('user_id', profile.id).eq('class_id', c.id).maybeSingle()
  const completed = !!prog

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/portal/academia" style={{ color: '#10b981', textDecoration: 'none', font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.2em', textTransform: 'uppercase' }}>← Volver a la Academia</Link>
      </div>
      <h1 style={{ font: '900 italic 28px/1.2 var(--font-sans)', color: '#f5f5f5', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.03em' }}>{c.title}</h1>
      <div style={{ font: '400 12px/1 var(--font-mono)', color: '#a3a3a3', marginBottom: 24, letterSpacing: '.1em', textTransform: 'uppercase' }}>{c.module} • {c.duration_min} min</div>
      
      {c.mux_playback_id ? (
        <div style={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #1f1f1f', background: '#000', marginBottom: 24, boxShadow: '0 0 20px rgba(16,185,129,.1)' }}>
          <MuxClient playbackId={c.mux_playback_id} />
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', border: '1px solid #1f1f1f', color: '#525252', marginBottom: 24 }}>
          <div style={{ font: '900 italic 12px/1 var(--font-sans)', letterSpacing: '.2em', textTransform: 'uppercase' }}>Video no disponible</div>
          <div style={{ font: '400 10px/1 var(--font-mono)', marginTop: 8 }}>El ID de Mux no está configurado para esta clase.</div>
        </div>
      )}

      {c.description && (
        <div style={{ background: 'rgba(23,23,23,.6)', padding: 20, border: '1px solid rgba(16,185,129,.15)', marginBottom: 24 }}>
          <div style={{ font: '900 italic 10px/1 var(--font-sans)', color: '#10b981', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 10 }}>Descripción</div>
          <p style={{ font: '400 13px/1.6 var(--font-sans)', color: '#d4d4d4', margin: 0, whiteSpace: 'pre-wrap' }}>
            {c.description}
          </p>
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {completed ? (
          <span style={{ padding: '12px 24px', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', color: '#10b981', font: '900 italic 11px/1 var(--font-sans)', letterSpacing: '.3em', textTransform: 'uppercase' }}>
            ◉ Clase Completada
          </span>
        ) : (
          <CompleteButton classId={c.id} />
        )}
      </div>
    </div>
  )
}
