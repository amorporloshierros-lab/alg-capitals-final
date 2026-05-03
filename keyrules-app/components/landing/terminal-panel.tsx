export default function TerminalPanel() {
  return (
    <div style={{
      marginTop: 80, padding: 40, position: 'relative', overflow: 'hidden',
      border: '1px solid rgba(16,185,129,.2)', background: 'rgba(23,23,23,.1)',
      boxShadow: 'inset 0 0 40px rgba(16,185,129,.03)', backdropFilter: 'blur(6px)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 96, height: 1, background: 'rgba(16,185,129,.5)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 96, background: 'rgba(16,185,129,.5)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        <div>
          <div style={{
            font: '900 italic 28px/1 var(--font-sans)', letterSpacing: '.3em',
            color: '#10b981', textTransform: 'uppercase',
            filter: 'drop-shadow(0 0 10px rgba(16,185,129,.3))',
          }}>ACEPTAMOS</div>
          <div style={{ width: 64, height: 3, background: '#10b981', marginTop: 8, opacity: .5 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            font: '900 11px/1.6 var(--font-mono)', letterSpacing: '.25em',
            color: '#d4d4d4', textTransform: 'uppercase', marginBottom: 8,
          }}>
            CRIPTOS: BTC, ETH, USDT <span style={{ color: '#404040' }}>|</span>{' '}
            PAYPAL <span style={{ color: '#404040' }}>|</span> MERCADO PAGO
          </div>
          <div style={{
            font: '400 italic 11px/1.6 var(--font-mono)', letterSpacing: '.2em',
            color: '#737373', opacity: .8, textTransform: 'uppercase',
          }}>Consultanos por nuestro Financiamiento Personalizado para planes Elite</div>
        </div>
      </div>
    </div>
  )
}
