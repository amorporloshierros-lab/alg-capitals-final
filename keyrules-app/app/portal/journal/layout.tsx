import PortalHeader from '../components/portal-header'

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f5f5f5' }}>
      <PortalHeader title="Journal" icon="◈" />
      <div style={{ padding: '28px 32px' }}>
        {children}
      </div>
    </div>
  )
}
