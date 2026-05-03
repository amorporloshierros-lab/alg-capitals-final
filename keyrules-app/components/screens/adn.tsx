export default function ADN() {
  return (
    <section style={{ padding: '128px 24px', maxWidth: 1024, margin: '0 auto' }}>
      <h2 style={{
        font: '900 italic clamp(2.5rem, 5vw, 3.5rem)/1 var(--font-sans)',
        letterSpacing: '-0.02em', color: '#fff', textTransform: 'uppercase',
        margin: '0 0 48px 0',
        filter: 'drop-shadow(0 0 15px rgba(16,185,129,.3))',
      }}>Quant Research<br />Division</h2>
      <div style={{ width: 96, height: 3, background: '#10b981', marginBottom: 48, boxShadow: '0 0 15px rgba(16,185,129,.5)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        <div>
          <p style={{
            font: '400 13px/2 var(--font-mono)', letterSpacing: '.2em',
            color: '#a3a3a3', textTransform: 'uppercase', marginBottom: 32,
          }}>
            ALG Capitals es la síntesis de 7 años de inmersión total en los mercados financieros.
            Forjado bajo el estudio riguroso de referentes como Larry Williams, Chris Lory, ICT e influencias
            cuánticas como De Prado.
          </p>
          <p style={{
            font: '400 13px/2 var(--font-mono)', letterSpacing: '.2em',
            color: '#a3a3a3', textTransform: 'uppercase',
          }}>
            Entendemos el mercado a través de Machine Learning, Microestructura y Stock Price Delivery Liquidity.
            No operamos con esperanza, operamos con física de mercados aplicada a la estadística pura.
          </p>
        </div>
        <div style={{
          border: '1px solid #262626', padding: 24, background: 'rgba(23,23,23,.1)',
          boxShadow: '0 0 50px rgba(16,185,129,.05)',
          aspectRatio: '5/7', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            font: '900 italic 10px/1.8 var(--font-sans)', letterSpacing: '.4em',
            color: '#404040', textAlign: 'center', textTransform: 'uppercase',
          }}>
            [ Founder Portrait<br />adn-lucas.jpg<br />— 500 × 700 ]
          </div>
        </div>
      </div>
    </section>
  )
}
