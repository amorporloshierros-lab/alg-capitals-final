// Hero, plan cards, terminal panel, footer, landing sections

function Chip({ children }) {
  return (
    <div style={{
      display: 'inline-block', padding: '6px 16px', marginBottom: 32,
      font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.4em',
      color: '#10b981', background: 'rgba(16,185,129,.05)',
      border: '1px solid rgba(16,185,129,.2)', textTransform: 'uppercase',
      boxShadow: '0 0 20px rgba(16,185,129,.1)'
    }}>{children}</div>
  );
}

function Hero({ onAccess }) {
  return (
    <main style={{
      position: 'relative', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '140px 16px', maxWidth: 1280, margin: '0 auto',
      overflow: 'hidden', minHeight: '95vh'
    }}>
      <LiveChart />
      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <Chip>Institutional Liquidity Protocol v4.0</Chip>
        <h1 className="hero-title-reveal" style={{
          font: '900 italic clamp(3.5rem, 10vw, 9rem)/0.8 var(--font-sans)',
          letterSpacing: '-0.04em', color: '#fff', marginBottom: 120,
          textTransform: 'uppercase', marginTop: 0
        }}>
          Domina el<br />
          <span style={{
            background: 'linear-gradient(to bottom, #34d399, #064e3b)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            filter: 'drop-shadow(0 0 45px rgba(16,185,129,.4))'
          }}>Algoritmo.</span>
        </h1>
        <style>{`
          .hero-title-reveal {
            animation: heroBurst 1400ms cubic-bezier(.2,.7,.2,1) 0.2s both;
            transform-origin: 50% 50%;
          }
          @keyframes heroBurst {
            0%   { opacity: 0; transform: scale(0.05); filter: blur(20px) brightness(2.5); letter-spacing: -0.2em; }
            35%  { opacity: 1; filter: blur(6px) brightness(1.8); }
            70%  { transform: scale(1.04); filter: blur(0) brightness(1.2); letter-spacing: -0.02em; }
            100% { opacity: 1; transform: scale(1); filter: blur(0) brightness(1); letter-spacing: -0.04em; }
          }
        `}</style>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
          <a onClick={onAccess} style={{
            padding: '24px 56px', font: '900 12px/1 var(--font-sans)', letterSpacing: '.2em',
            color: '#000', background: '#10b981', textTransform: 'uppercase',
            boxShadow: '0 0 60px rgba(16,185,129,.5)', cursor: 'pointer', textDecoration: 'none'
          }}>Acceso</a>
          <a style={{
            padding: '24px 56px', font: '900 12px/1 var(--font-sans)', letterSpacing: '.2em',
            color: '#fff', border: '1px solid #262626', textTransform: 'uppercase',
            cursor: 'pointer', textDecoration: 'none'
          }}>Ver Track Record</a>
        </div>
        <p style={{
          maxWidth: 640, margin: '0 auto',
          font: '400 16px/1.4 var(--font-mono)', letterSpacing: '.3em',
          color: '#a3a3a3', textTransform: 'uppercase', opacity: .8
        }}>Deja de tradear con sistema minorista y convierte tu estrategia a Quantz</p>
      </div>
    </main>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      font: '900 italic 24px/1 var(--font-sans)', letterSpacing: '.2em',
      color: '#fff', textTransform: 'uppercase',
      borderLeft: '4px solid #10b981', paddingLeft: 14, display: 'inline-block',
      margin: '0 0 48px 0'
    }}>{children}</h2>
  );
}

function PlanCard({ label, price, priceSuffix, features, cta, recommended, bookImg }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: 40, display: 'flex', flexDirection: 'column', cursor: 'pointer',
        background: recommended ? 'rgba(23,23,23,.6)' : 'rgba(23,23,23,.4)',
        border: recommended ? '2px solid #10b981' : `1px solid ${hover ? '#10b981' : '#262626'}`,
        backdropFilter: 'blur(6px)', position: 'relative',
        transform: hover ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 500ms',
        boxShadow: recommended
          ? '0 0 100px rgba(16,185,129,.25)'
          : hover ? '0 0 70px rgba(16,185,129,.15)' : 'none'
      }}>
      {recommended && (
        <div style={{
          position: 'absolute', top: 0, right: 0, padding: '8px 20px',
          background: '#10b981', color: '#000',
          font: '900 9px/1 var(--font-sans)', letterSpacing: '-0.01em', textTransform: 'uppercase'
        }}>Recommended</div>
      )}
      <h3 style={{
        font: `900 italic 10px/1 var(--font-sans)`, letterSpacing: '.3em',
        color: recommended ? '#10b981' : (hover ? '#10b981' : '#737373'),
        textTransform: 'uppercase', margin: '0 0 32px 0', transition: 'color 300ms'
      }}>{label}</h3>
      {bookImg && (
        <div style={{ margin: '0 0 32px 0', display: 'flex', justifyContent: 'center' }}>
          <img src={bookImg} width="110" height="150" style={{ boxShadow: '0 20px 40px rgba(0,0,0,.6)' }} />
        </div>
      )}
      <div style={{
        font: '900 italic 48px/1 var(--font-sans)', color: '#fff',
        marginBottom: 32, letterSpacing: '-0.02em'
      }}>${price}{priceSuffix && <span style={{ fontSize: 12 }}>{priceSuffix}</span>}</div>
      <ul style={{
        font: '900 9px/1.7 var(--font-sans)', letterSpacing: '.15em', color: '#a3a3a3',
        textTransform: 'uppercase', flexGrow: 1, marginBottom: 48, padding: 0, listStyle: 'none'
      }}>{features.map((f, i) => (
        <li key={i} style={{ color: f.accent ? '#34d399' : undefined, fontStyle: f.accent === 'italic' ? 'italic' : undefined, textDecoration: f.accent === 'u' ? 'underline' : undefined, textUnderlineOffset: 4 }}>• {f.text || f}</li>
      ))}</ul>
      <a style={{
        width: '100%', padding: recommended ? '20px 0' : '16px 0', boxSizing: 'border-box',
        font: `900 ${recommended ? '11' : '10'}px/1 var(--font-sans)`, letterSpacing: '.15em',
        textAlign: 'center', textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none',
        ...(recommended
          ? { background: '#10b981', color: '#000' }
          : { border: '1px solid rgba(16,185,129,.3)', color: '#10b981' })
      }}>{cta}</a>
    </div>
  );
}

function Plans({ bookImg }) {
  return (
    <section id="planes" style={{ padding: '128px 24px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        <PlanCard
          label="Software Base" price="120" bookImg={bookImg}
          features={[
            { text: 'Libro Oficial "KEYWICK"' },
            { text: 'Licencia Oracle MT5 Lite' },
            { text: 'Indicador Keywick Pro' },
            { text: '2 Meses Canal Bias', accent: true }
          ]}
          cta="Reservar" />
        <PlanCard
          label="Subscription" price="40" priceSuffix="/mo"
          features={[
            { text: 'Proyección Bias Semanal' },
            { text: 'Sesiones Live Trading' },
            { text: 'Oracle + MT5 Access' },
            { text: 'Revisiones de Setups' }
          ]}
          cta="Unirse" />
        <PlanCard
          label="Academia Grupal" price="550" recommended
          features={[
            { text: 'Programa 10 Semanas' },
            { text: '25 Clases en Vivo' },
            { text: 'Oracle MT5 Full' },
            { text: 'Auditoría & Track Record' },
            { text: 'Mentoría Directa', accent: 'italic' }
          ]}
          cta="Inicia Mentoría" />
        <PlanCard
          label="Elite Program" price="750"
          features={[
            { text: 'Mentoría 1-a-1 Directa' },
            { text: 'Acceso Directo 24/7' },
            { text: 'Psicotrading Avanzado' },
            { text: 'Gestor de Riesgo Cuántico', accent: 'u' }
          ]}
          cta="Aplicar" />
      </div>
      <TerminalPanel />
    </section>
  );
}

function TerminalPanel() {
  return (
    <div style={{
      marginTop: 80, padding: 40, position: 'relative', overflow: 'hidden',
      border: '1px solid rgba(16,185,129,.2)', background: 'rgba(23,23,23,.1)',
      boxShadow: 'inset 0 0 40px rgba(16,185,129,.03)', backdropFilter: 'blur(6px)'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 96, height: 1, background: 'rgba(16,185,129,.5)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 96, background: 'rgba(16,185,129,.5)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        <div>
          <div style={{
            font: '900 italic 28px/1 var(--font-sans)', letterSpacing: '.3em',
            color: '#10b981', textTransform: 'uppercase',
            filter: 'drop-shadow(0 0 10px rgba(16,185,129,.3))'
          }}>ACEPTAMOS</div>
          <div style={{ width: 64, height: 3, background: '#10b981', marginTop: 8, opacity: .5 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            font: '900 11px/1.6 var(--font-mono)', letterSpacing: '.25em',
            color: '#d4d4d4', textTransform: 'uppercase', marginBottom: 8
          }}>
            CRIPTOS: BTC, ETH, USDT <span style={{ color: '#404040' }}>|</span>{' '}
            PAYPAL <span style={{ color: '#404040' }}>|</span> MERCADO PAGO
          </div>
          <div style={{
            font: '400 italic 11px/1.6 var(--font-mono)', letterSpacing: '.2em',
            color: '#737373', opacity: .8, textTransform: 'uppercase'
          }}>Consultanos por nuestro Financiamiento Personalizado para planes Elite</div>
        </div>
      </div>
    </div>
  );
}

function Auditoria() {
  return (
    <section style={{ padding: '96px 24px', maxWidth: 960, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
      <SectionHeading>Track Record Auditado</SectionHeading>
      <div style={{
        width: '100%', aspectRatio: '16/9', overflow: 'hidden',
        boxShadow: '0 0 80px rgba(16,185,129,.1)',
        border: '1px solid #262626',
        background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ font: '900 italic 12px/1 var(--font-sans)', letterSpacing: '.5em', color: '#525252', textTransform: 'uppercase' }}>
          ▶ Auditoría YouTube Player
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const col = (title, items) => (
    <div>
      <h4 style={{
        font: '900 10px/1 var(--font-sans)', letterSpacing: '.2em', color: '#fff',
        textTransform: 'uppercase', margin: '0 0 24px 0',
        borderBottom: '1px solid rgba(16,185,129,.2)', paddingBottom: 8
      }}>{title}</h4>
      {items.map((it, i) => (
        <div key={i} style={{ font: '900 10px/1 var(--font-sans)', letterSpacing: '.2em', color: '#737373', textTransform: 'uppercase', padding: '10px 0', cursor: 'pointer' }}>{it}</div>
      ))}
    </div>
  );
  return (
    <footer style={{ paddingTop: 96, paddingBottom: 48, borderTop: '1px solid #171717', background: '#000', textAlign: 'center', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 64, marginBottom: 80, textAlign: 'left' }}>
        <div>
          <span style={{ font: '900 italic 20px/1 var(--font-sans)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Keyrules <span style={{ color: '#10b981' }}>Alg</span>
          </span>
          <p style={{ marginTop: 24, font: '700 10px/1.8 var(--font-sans)', color: '#525252', letterSpacing: '.2em', textTransform: 'uppercase' }}>
            Research Division dedicada a la explotación estadística de ineficiencias de mercado.
          </p>
        </div>
        {col('Navegación', ['ADN Institucional', 'Testimonios', 'Protocolos'])}
        {col('Contacto', ['Tigre / Nordelta, AR', 'contact@algcapitals.com'])}
        {col('Social', ['Telegram Feed', 'YouTube Channel'])}
      </div>
      <div style={{ font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.6em', color: '#404040', textTransform: 'uppercase', marginBottom: 24 }}>
        © 2026 KEYRULES x ALG CAPITALS | QUANT DIVISION
      </div>
      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '20px 40px',
        border: '1px solid rgba(23,23,23,.5)',
        font: '900 italic 8px/1.8 var(--font-sans)', letterSpacing: '.2em',
        color: '#262626', textTransform: 'uppercase'
      }}>
        AVISO: EL TRADING CONLLEVA RIESGO DE PÉRDIDA. RESULTADOS PASADOS NO GARANTIZAN BENEFICIOS FUTUROS.
      </div>
    </footer>
  );
}

Object.assign(window, { Hero, Plans, PlanCard, TerminalPanel, Auditoria, Footer, SectionHeading, Chip });
