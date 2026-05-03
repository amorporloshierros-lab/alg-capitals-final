// Certificados + ADN screens

function ProofChip() {
  return (
    <div style={{
      display: 'inline-block', padding: '6px 16px', marginBottom: 24,
      font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.4em',
      color: '#10b981', background: 'rgba(16,185,129,.05)',
      border: '1px solid rgba(16,185,129,.2)', textTransform: 'uppercase'
    }}>Verified Track Record & Student Results</div>
  );
}

function CertCard({ src, alt }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${hover ? '#10b981' : '#262626'}`, padding: 8,
        background: 'rgba(23,23,23,.1)',
        transform: hover ? 'scale(1.04)' : 'scale(1)',
        transition: 'all 300ms',
        boxShadow: hover ? '0 0 50px rgba(16,185,129,.1)' : '0 0 40px rgba(16,185,129,.02)',
        cursor: 'pointer'
      }}>
      <img src={src} alt={alt} style={{
        width: '100%', display: 'block',
        filter: hover ? 'none' : 'grayscale(1)', transition: 'filter 500ms'
      }} />
    </div>
  );
}

function PartnersRow() {
  const [hover, setHover] = useState(false);
  return (
    <section style={{ padding: '64px 24px', maxWidth: 1280, margin: '0 auto', borderTop: '1px solid rgba(23,23,23,.5)', borderBottom: '1px solid rgba(23,23,23,.5)', background: 'rgba(23,23,23,.05)' }}>
      <h2 style={{ font: '900 9px/1 var(--font-sans)', letterSpacing: '.6em', color: '#525252', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 40px 0' }}>
        Institutional Partners & Audited Platforms
      </h2>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 96, flexWrap: 'wrap',
          filter: hover ? 'grayscale(0)' : 'grayscale(1)', opacity: hover ? 1 : .4,
          transition: 'all 700ms'
        }}>
        <img src="../../assets/ftmo.png" alt="FTMO" style={{ height: 48 }} />
        <img src="../../assets/alpha.png" alt="Alpha" style={{ height: 48 }} />
        <img src="../../assets/fundednext.png" alt="FundedNext" style={{ height: 48 }} />
      </div>
    </section>
  );
}

function Certificados() {
  return (
    <div>
      <header style={{ padding: '96px 24px 32px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <ProofChip />
        <h1 style={{
          font: '900 italic clamp(2.5rem, 5vw, 4rem)/1.05 var(--font-sans)',
          letterSpacing: '-0.02em', color: '#fff', textTransform: 'uppercase', margin: '0 0 24px 0'
        }}>Prueba de <span style={{ color: '#10b981' }}>Fondeo.</span></h1>
        <p style={{
          font: '400 12px/1.6 var(--font-mono)', letterSpacing: '.3em', color: '#737373',
          textTransform: 'uppercase', margin: 0
        }}>No operamos con promesas. Operamos con resultados estadísticos validados por las firmas de fondeo más exigentes del mercado.</p>
      </header>

      <section style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto', borderTop: '1px solid rgba(23,23,23,.5)' }}>
        <h2 style={{ font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.5em', color: '#a3a3a3', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 48px 0' }}>
          Prop Firm Funding Certificates
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          <CertCard src="../../assets/certificado-1.jpg" alt="Certificado 1" />
          <CertCard src="../../assets/certificado-2.jpg" alt="Certificado 2" />
          <CertCard src="../../assets/certificado-3.jpg" alt="Certificado 3" />
        </div>
      </section>

      <PartnersRow />

      <section style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.5em', color: '#a3a3a3', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 48px 0' }}>
          Community Social Proof (Live Results)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[1,2,3,4].map((n) => (
            <CertCard key={n} src={`../../assets/comentario-${n}.jpg`} alt={`Chat ${n}`} />
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 24px', maxWidth: 1024, margin: '0 auto', borderTop: '1px solid rgba(23,23,23,.5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <TestimonialCard quote="7 meses operando con KeyRules y la claridad es absoluta. Las entradas se volvieron milimétricas. Fundé mi confianza en la estadística pura de Lucas." author="Gastón M. (Gestor)" />
          <TestimonialCard quote="El Elite Program es un antes y un después. No solo es trading, es entender la física del mercado. Mi cuenta fondeada es el resultado." author="Valentina R. (Elite Student)" />
        </div>
      </section>
    </div>
  );
}

function TestimonialCard({ quote, author }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      padding: 32, border: `1px solid ${hover ? '#10b981' : '#262626'}`,
      background: hover ? 'rgba(23,23,23,.3)' : 'rgba(23,23,23,.1)',
      transform: hover ? 'scale(1.03)' : 'scale(1)',
      transition: 'all 300ms', cursor: 'pointer',
      boxShadow: hover ? '0 0 30px rgba(16,185,129,.2)' : '0 0 20px rgba(0,0,0,.3)'
    }}>
      <p style={{
        font: '400 italic 11px/1.8 var(--font-mono)', letterSpacing: '.2em',
        color: hover ? '#f1f5f9' : '#a3a3a3', textTransform: 'uppercase',
        margin: 0, transition: 'color 300ms'
      }}>"{quote}"</p>
      <div style={{
        marginTop: 24, font: '900 9px/1 var(--font-sans)', letterSpacing: '.4em',
        color: '#10b981', textTransform: 'uppercase',
        filter: 'drop-shadow(0 0 5px rgba(16,185,129,.5))'
      }}>— {author}</div>
    </div>
  );
}

function ADN() {
  return (
    <section style={{ padding: '128px 24px', maxWidth: 1024, margin: '0 auto' }}>
      <h2 style={{
        font: '900 italic clamp(2.5rem, 5vw, 3.5rem)/1 var(--font-sans)',
        letterSpacing: '-0.02em', color: '#fff', textTransform: 'uppercase', margin: '0 0 48px 0',
        filter: 'drop-shadow(0 0 15px rgba(16,185,129,.3))'
      }}>Quant Research<br />Division</h2>
      <div style={{ width: 96, height: 3, background: '#10b981', marginBottom: 48, boxShadow: '0 0 15px rgba(16,185,129,.5)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        <div>
          <p style={{
            font: '400 13px/2 var(--font-mono)', letterSpacing: '.2em',
            color: '#a3a3a3', textTransform: 'uppercase', marginBottom: 32
          }}>
            ALG Capitals es la síntesis de 7 años de inmersión total en los mercados financieros. Forjado bajo el estudio riguroso de referentes como Larry Williams, Chris Lory, ICT e influencias cuánticas como De Prado.
          </p>
          <p style={{
            font: '400 13px/2 var(--font-mono)', letterSpacing: '.2em',
            color: '#a3a3a3', textTransform: 'uppercase'
          }}>
            Entendemos el mercado a través de Machine Learning, Microestructura y Stock Price Delivery Liquidity. No operamos con esperanza, operamos con física de mercados aplicada a la estadística pura.
          </p>
        </div>
        <div style={{
          border: '1px solid #262626', padding: 24, background: 'rgba(23,23,23,.1)',
          boxShadow: '0 0 50px rgba(16,185,129,.05)',
          aspectRatio: '5/7', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ font: '900 italic 10px/1.8 var(--font-sans)', letterSpacing: '.4em', color: '#404040', textAlign: 'center', textTransform: 'uppercase' }}>
            [ Founder Portrait<br />adn-lucas.jpg<br />— 500 × 700 ]
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Certificados, ADN, TestimonialCard, PartnersRow });
