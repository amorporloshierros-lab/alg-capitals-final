'use client'

import { useRouter } from 'next/navigation'
import LiveChart from '@/components/chrome/live-chart'
import type { Database } from '@/types/database'

type MeetConfig = Database['public']['Tables']['meet_config']['Row'] | null

export default function Hero({ meetConfig }: { meetConfig: MeetConfig }) {
  const router = useRouter()

  return (
    <main style={{
      position: 'relative', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '140px 16px', maxWidth: 1280, margin: '0 auto',
      overflow: 'hidden', minHeight: '95vh',
    }}>
      <LiveChart meetConfig={meetConfig} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', marginBottom: 32,
          font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.4em',
          color: '#10b981', background: 'rgba(16,185,129,.05)',
          border: '1px solid rgba(16,185,129,.2)', textTransform: 'uppercase',
          boxShadow: '0 0 20px rgba(16,185,129,.1)',
        }}>Institutional Liquidity Protocol v4.0</div>

        <h1 className="hero-title-reveal" style={{
          font: '900 italic clamp(3.5rem,10vw,9rem)/0.8 var(--font-sans)',
          letterSpacing: '-0.04em', color: '#fff', marginBottom: 120,
          textTransform: 'uppercase', marginTop: 0,
        }}>
          Domina el<br />
          <span style={{
            background: 'linear-gradient(to bottom,#34d399,#064e3b)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            filter: 'drop-shadow(0 0 45px rgba(16,185,129,.4))',
          }}>Algoritmo.</span>
        </h1>

        <style>{`
          .hero-title-reveal { animation: heroBurst 1400ms cubic-bezier(.2,.7,.2,1) 0.2s both; transform-origin:50% 50%; }
          @keyframes heroBurst {
            0%   { opacity:0; transform:scale(0.05); filter:blur(20px) brightness(2.5); letter-spacing:-0.2em; }
            35%  { opacity:1; filter:blur(6px) brightness(1.8); }
            70%  { transform:scale(1.04); filter:blur(0) brightness(1.2); letter-spacing:-0.02em; }
            100% { opacity:1; transform:scale(1); filter:blur(0) brightness(1); letter-spacing:-0.04em; }
          }
        `}</style>

        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/portal')}
            style={{
              padding: '24px 56px', font: '900 12px/1 var(--font-sans)', letterSpacing: '.2em',
              color: '#000', background: '#10b981', textTransform: 'uppercase',
              boxShadow: '0 0 60px rgba(16,185,129,.5)', cursor: 'pointer', border: 'none',
            }}
          >Acceso</button>
          <button style={{
            padding: '24px 56px', font: '900 12px/1 var(--font-sans)', letterSpacing: '.2em',
            color: '#fff', border: '1px solid #262626', textTransform: 'uppercase',
            cursor: 'pointer', background: 'transparent',
          }}>Ver Track Record</button>
        </div>

        <p style={{
          maxWidth: 640, margin: '0 auto',
          font: '400 16px/1.4 var(--font-mono)', letterSpacing: '.3em',
          color: '#a3a3a3', textTransform: 'uppercase', opacity: .8,
        }}>Deja de tradear con sistema minorista y convierte tu estrategia a Quantz</p>
      </div>
    </main>
  )
}
