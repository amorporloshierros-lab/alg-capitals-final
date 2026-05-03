function NavCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 style={{
        font: '900 10px/1 var(--font-sans)', letterSpacing: '.2em', color: '#fff',
        textTransform: 'uppercase', margin: '0 0 24px 0',
        borderBottom: '1px solid rgba(16,185,129,.2)', paddingBottom: 8,
      }}>{title}</h4>
      {items.map((it, i) => (
        <div key={i} style={{
          font: '900 10px/1 var(--font-sans)', letterSpacing: '.2em',
          color: '#737373', textTransform: 'uppercase', padding: '10px 0', cursor: 'pointer',
        }}>{it}</div>
      ))}
    </div>
  )
}

export default function Footer() {
  return (
    <footer style={{
      paddingTop: 96, paddingBottom: 48,
      borderTop: '1px solid #171717', background: '#000',
      textAlign: 'center', position: 'relative', zIndex: 10,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 32px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 64, marginBottom: 80, textAlign: 'left',
      }}>
        <div>
          <span style={{
            font: '900 italic 20px/1 var(--font-sans)', color: '#fff',
            textTransform: 'uppercase', letterSpacing: '-0.02em',
          }}>
            Keyrules <span style={{ color: '#10b981' }}>Alg</span>
          </span>
          <p style={{
            marginTop: 24, font: '700 10px/1.8 var(--font-sans)',
            color: '#525252', letterSpacing: '.2em', textTransform: 'uppercase',
          }}>
            Research Division dedicada a la explotación estadística de ineficiencias de mercado.
          </p>
        </div>
        <NavCol title="Navegación" items={['ADN Institucional', 'Testimonios', 'Protocolos']} />
        <NavCol title="Contacto" items={['Tigre / Nordelta, AR', 'contact@algcapitals.com']} />
        <NavCol title="Social" items={['Telegram Feed', 'YouTube Channel']} />
      </div>
      <div style={{
        font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.6em',
        color: '#404040', textTransform: 'uppercase', marginBottom: 24,
      }}>
        © 2026 KEYRULES x ALG CAPITALS | QUANT DIVISION
      </div>
      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '20px 40px',
        border: '1px solid rgba(23,23,23,.5)',
        font: '900 italic 8px/1.8 var(--font-sans)', letterSpacing: '.2em',
        color: '#262626', textTransform: 'uppercase',
      }}>
        AVISO: EL TRADING CONLLEVA RIESGO DE PÉRDIDA. RESULTADOS PASADOS NO GARANTIZAN BENEFICIOS FUTUROS.
      </div>
    </footer>
  )
}
