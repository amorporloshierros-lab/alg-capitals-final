export default function Auditoria() {
  return (
    <section style={{
      padding: '96px 24px', maxWidth: 960, margin: '0 auto',
      textAlign: 'center', position: 'relative', zIndex: 10,
    }}>
      <h2 style={{
        font: '900 italic 24px/1 var(--font-sans)', letterSpacing: '.2em',
        color: '#fff', textTransform: 'uppercase',
        borderLeft: '4px solid #10b981', paddingLeft: 14,
        display: 'inline-block', margin: '0 0 48px 0',
      }}>Track Record Auditado</h2>
      <div style={{
        width: '100%', aspectRatio: '16/9', overflow: 'hidden',
        boxShadow: '0 0 80px rgba(16,185,129,.1)',
        border: '1px solid #262626',
        background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          font: '900 italic 12px/1 var(--font-sans)', letterSpacing: '.5em',
          color: '#525252', textTransform: 'uppercase',
        }}>
          ▶ Auditoría YouTube Player
        </div>
      </div>
    </section>
  )
}
