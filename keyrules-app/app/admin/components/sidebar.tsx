'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const SECTIONS = [
  { href: '/admin',           label: 'Overview',        icon: '◉' },
  { href: '/admin/bias',      label: 'Bias Diario',     icon: '▲' },
  { href: '/admin/signals',   label: 'Señales',         icon: '◆' },
  { href: '/admin/meet',      label: 'Próximo Meet',    icon: '◎' },
  { href: '/admin/classes',   label: 'Clases & Replays',icon: '▶' },
  { href: '/admin/students',  label: 'Alumnos',         icon: '●' },
  { href: '/admin/licenses',  label: 'Licencias Oracle',icon: '⬢' },
  { href: '/admin/payments',  label: 'Pagos',           icon: '$' },
  { href: '/admin/plans',     label: 'Planes',          icon: '◇' },
]

export default function AdminSidebar() {
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
          ◉ Admin
        </div>
        <div style={{
          font: '900 italic 14px/1.1 var(--font-sans)',
          color: '#f5f5f5',
          textTransform: 'uppercase',
          letterSpacing: '.05em',
        }}>
          KeyRules
          <br />
          <span style={{ color: '#737373', fontSize: 11, fontStyle: 'normal', fontWeight: 400, letterSpacing: '.2em' }}>
            Panel de control
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {SECTIONS.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
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
        <Link href="/portal" style={{
          display: 'block',
          font: '400 10px/1 var(--font-mono)',
          color: '#525252',
          textDecoration: 'none',
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          → Portal Alumnos
        </Link>
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
