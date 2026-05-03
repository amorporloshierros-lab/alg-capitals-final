'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

const SECTIONS = [
  { href: '/portal',          label: 'Dashboard',    icon: '◉' },
  { href: '/portal/bias',     label: 'Bias Diario',  icon: '▲' },
  { href: '/portal/signals',  label: 'Señales',      icon: '◆' },
  { href: '/portal/academia', label: 'Academia',     icon: '▶' },
  { href: '/portal/journal',  label: 'Journal',      icon: '◇' },
]

const PLAN_COLOR: Record<string, string> = {
  starter: '#a3a3a3',
  pro:     '#10b981',
  elite:   '#fbbf24',
}

export default function PortalSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  return (
    <aside style={{
      borderRight: '1px solid rgba(16,185,129,.15)',
      background: 'rgba(0,0,0,.4)',
      position: 'sticky',
      top: 0,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(16,185,129,.12)',
      }}>
        <div style={{
          font: '900 italic 9px/1 var(--font-sans)',
          letterSpacing: '.5em',
          color: '#10b981',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          ◉ Portal
        </div>
        <div style={{
          font: '900 italic 13px/1.2 var(--font-sans)',
          color: '#f5f5f5',
          textTransform: 'uppercase',
          letterSpacing: '.05em',
          marginBottom: 8,
        }}>
          {profile.name ?? profile.email.split('@')[0]}
        </div>
        {profile.plan && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 8px',
            background: 'rgba(16,185,129,.05)',
            borderLeft: `3px solid ${PLAN_COLOR[profile.plan] ?? '#10b981'}`,
          }}>
            <span style={{
              font: '700 9px/1 var(--font-sans)',
              color: PLAN_COLOR[profile.plan] ?? '#10b981',
              letterSpacing: '.3em',
              textTransform: 'uppercase',
            }}>
              {profile.plan}
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {SECTIONS.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/portal' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 20px',
                background: active ? 'rgba(16,185,129,.08)' : 'transparent',
                borderLeft: active ? '3px solid #10b981' : '3px solid transparent',
                color: active ? '#10b981' : '#737373',
                textDecoration: 'none',
                font: '700 11px/1 var(--font-sans)',
                letterSpacing: '.15em',
                textTransform: 'uppercase',
                transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: 10, opacity: active ? 1 : .6 }}>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(16,185,129,.12)' }}>
        <Link href="/" style={{
          display: 'block',
          font: '400 10px/1 var(--font-mono)',
          color: '#525252',
          textDecoration: 'none',
          letterSpacing: '.2em',
          textTransform: 'uppercase',
        }}>
          → Landing
        </Link>
      </div>
    </aside>
  )
}
