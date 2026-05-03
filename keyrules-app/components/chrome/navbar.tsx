'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      document.documentElement.style.setProperty('--scroll-rot', (y * 0.8) + 'deg')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => pathname === href

  const navLink = (href: string, label: string) => (
    <Link href={href} style={{
      font: '900 10px/1 var(--font-sans)', letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: isActive(href) ? '#10b981' : '#737373',
      textDecoration: 'none', transition: 'color 150ms',
    }}>{label}</Link>
  )

  return (
    <nav data-no-reveal style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 32px', maxWidth: 1280, margin: '0 auto',
      borderBottom: '1px solid #171717', position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(5,5,5,.95)', backdropFilter: 'blur(10px)',
    }}>
      <button
        onClick={() => router.push('/')}
        style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <div style={{
          width: 54, height: 54, borderRadius: 9999, padding: 2,
          border: '1px solid rgba(16,185,129,.2)', boxShadow: '0 0 25px rgba(16,185,129,.35)',
          perspective: 800, transformStyle: 'preserve-3d',
          transform: 'rotateY(var(--scroll-rot, 0deg))',
          transition: 'transform 120ms linear',
          flexShrink: 0,
        }}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Image src="/assets/logo-sello.jpg" alt="KeyRules logo" fill style={{ objectFit: 'cover', borderRadius: 9999, backfaceVisibility: 'hidden' }} />
            <Image src="/assets/logo-sello.jpg" alt="" fill style={{
              objectFit: 'cover', borderRadius: 9999,
              transform: 'rotateY(180deg)', filter: 'brightness(.75) contrast(1.1)',
              backfaceVisibility: 'hidden',
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: .95 }}>
          <span style={{
            font: '900 italic 22px/1 var(--font-sans)', letterSpacing: '.1em',
            color: '#fff', textTransform: 'uppercase',
            textShadow: '0 0 12px rgba(103,232,249,.45), 0 0 24px rgba(103,232,249,.25)',
          }}>Keyrules</span>
          <span style={{
            font: '900 italic 22px/1 var(--font-sans)', letterSpacing: '.1em',
            color: '#10b981', textTransform: 'uppercase',
            textShadow: '0 0 14px rgba(103,232,249,.4), 0 0 28px rgba(16,185,129,.35)',
          }}>Alg Capitals</span>
        </div>
      </button>

      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {navLink('/adn', 'ADN')}
        {navLink('/testimonios', 'Testimonios')}
        {navLink('/planes', 'Acceder')}
        <span style={{ color: '#262626' }}>|</span>
        <a
          href="https://t.me/keyrules_alg" target="_blank" rel="noopener noreferrer"
          style={{ font: '900 10px/1 var(--font-sans)', letterSpacing: '.2em', color: 'rgba(16,185,129,.5)', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer' }}
        >Telegram</a>
        <Link href="/portal" style={{
          marginLeft: 8, padding: '10px 20px',
          background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.5)',
          color: '#10b981', font: '900 10px/1 var(--font-sans)', letterSpacing: '.1em',
          textTransform: 'uppercase', textDecoration: 'none',
        }}>Portal Alumnos</Link>
      </div>
    </nav>
  )
}
