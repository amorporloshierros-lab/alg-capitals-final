import PortalHeader from '../components/portal-header'

export default function SignalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f5f5f5' }}>
      <PortalHeader title="Señales" icon="◎" />
      <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}
