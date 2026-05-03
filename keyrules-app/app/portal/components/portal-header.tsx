export default function PortalHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 28px', background: 'rgba(10,10,10,.9)',
      borderBottom: '1px solid #171717', borderLeft: '3px solid #10b981',
      marginBottom: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <a href="/portal" style={{
          font: '900 8px/1 var(--font-sans)', letterSpacing: '.3em', color: '#525252',
          textTransform: 'uppercase', padding: '7px 12px', border: '1px solid #262626',
          textDecoration: 'none',
        }}>← Cockpit</a>
        <div>
          <div style={{ font: '900 italic 7px/1 var(--font-sans)', letterSpacing: '.4em', color: '#10b981', textTransform: 'uppercase', marginBottom: 4 }}>{icon} KeyRules × ALG</div>
          <div style={{ font: '900 italic 18px/1 var(--font-sans)', color: '#f5f5f5', textTransform: 'uppercase', letterSpacing: '.04em' }}>{title}</div>
        </div>
      </div>
    </div>
  )
}
