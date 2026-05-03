import PortalHeader from '../components/portal-header'

export default function BiasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f5f5f5' }}>
      <PortalHeader title="Bias Diario" icon="▲" />
      <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}
