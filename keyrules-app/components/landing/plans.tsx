'use client'

import { useState } from 'react'
import Image from 'next/image'
import TerminalPanel from './terminal-panel'

interface Feature { text: string; accent?: true | 'italic' | 'u' }

interface PlanCardProps {
  label: string
  price: string
  priceSuffix?: string
  features: (Feature | string)[]
  cta: string
  recommended?: boolean
  bookImg?: string
}

function PlanCard({ label, price, priceSuffix, features, cta, recommended, bookImg }: PlanCardProps) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 40, display: 'flex', flexDirection: 'column', cursor: 'pointer',
        background: recommended ? 'rgba(23,23,23,.6)' : 'rgba(23,23,23,.4)',
        border: recommended ? '2px solid #10b981' : `1px solid ${hover ? '#10b981' : '#262626'}`,
        backdropFilter: 'blur(6px)', position: 'relative',
        transform: hover ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 500ms',
        boxShadow: recommended
          ? '0 0 100px rgba(16,185,129,.25)'
          : hover ? '0 0 70px rgba(16,185,129,.15)' : 'none',
      }}
    >
      {recommended && (
        <div style={{
          position: 'absolute', top: 0, right: 0, padding: '8px 20px',
          background: '#10b981', color: '#000',
          font: '900 9px/1 var(--font-sans)', letterSpacing: '-0.01em', textTransform: 'uppercase',
        }}>Recommended</div>
      )}
      <h3 style={{
        font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.3em',
        color: recommended ? '#10b981' : (hover ? '#10b981' : '#737373'),
        textTransform: 'uppercase', margin: '0 0 32px 0', transition: 'color 300ms',
      }}>{label}</h3>
      {bookImg && (
        <div style={{ margin: '0 0 32px 0', display: 'flex', justifyContent: 'center' }}>
          <Image src={bookImg} alt="KeyWick" width={110} height={150} style={{ boxShadow: '0 20px 40px rgba(0,0,0,.6)' }} />
        </div>
      )}
      <div style={{ font: '900 italic 48px/1 var(--font-sans)', color: '#fff', marginBottom: 32, letterSpacing: '-0.02em' }}>
        ${price}{priceSuffix && <span style={{ fontSize: 12 }}>{priceSuffix}</span>}
      </div>
      <ul style={{
        font: '900 9px/1.7 var(--font-sans)', letterSpacing: '.15em', color: '#a3a3a3',
        textTransform: 'uppercase', flexGrow: 1, marginBottom: 48, padding: 0, listStyle: 'none',
      }}>
        {features.map((f, i) => {
          const feat = typeof f === 'string' ? { text: f } : f
          return (
            <li key={i} style={{
              color: feat.accent ? '#34d399' : undefined,
              fontStyle: feat.accent === 'italic' ? 'italic' : undefined,
              textDecoration: feat.accent === 'u' ? 'underline' : undefined,
              textUnderlineOffset: 4,
            }}>• {feat.text}</li>
          )
        })}
      </ul>
      <a style={{
        width: '100%', padding: recommended ? '20px 0' : '16px 0', boxSizing: 'border-box',
        font: `900 ${recommended ? '11' : '10'}px/1 var(--font-sans)`, letterSpacing: '.15em',
        textAlign: 'center', textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none',
        display: 'block',
        ...(recommended
          ? { background: '#10b981', color: '#000' }
          : { border: '1px solid rgba(16,185,129,.3)', color: '#10b981' }),
      }}>{cta}</a>
    </div>
  )
}

export default function Plans() {
  return (
    <section id="planes" style={{ padding: '128px 24px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
        <PlanCard
          label="Software Base" price="120" bookImg="/assets/libro-keywick.jpg"
          features={[
            { text: 'Libro Oficial "KEYWICK"' },
            { text: 'Licencia Oracle MT5 Lite' },
            { text: 'Indicador Keywick Pro' },
            { text: '2 Meses Canal Bias', accent: true },
          ]}
          cta="Reservar"
        />
        <PlanCard
          label="Subscription" price="40" priceSuffix="/mo"
          features={[
            { text: 'Proyección Bias Semanal' },
            { text: 'Sesiones Live Trading' },
            { text: 'Oracle + MT5 Access' },
            { text: 'Revisiones de Setups' },
          ]}
          cta="Unirse"
        />
        <PlanCard
          label="Academia Grupal" price="550" recommended
          features={[
            { text: 'Programa 10 Semanas' },
            { text: '25 Clases en Vivo' },
            { text: 'Oracle MT5 Full' },
            { text: 'Auditoría & Track Record' },
            { text: 'Mentoría Directa', accent: 'italic' },
          ]}
          cta="Inicia Mentoría"
        />
        <PlanCard
          label="Elite Program" price="750"
          features={[
            { text: 'Mentoría 1-a-1 Directa' },
            { text: 'Acceso Directo 24/7' },
            { text: 'Psicotrading Avanzado' },
            { text: 'Gestor de Riesgo Cuántico', accent: 'u' },
          ]}
          cta="Aplicar"
        />
      </div>
      <TerminalPanel />
    </section>
  )
}
