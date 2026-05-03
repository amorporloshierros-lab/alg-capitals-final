import { requireProfile } from '@/lib/auth'
import PortalSidebar from './components/sidebar'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      fontFamily: 'var(--font-sans, Geist, sans-serif)',
    }}>
      <PortalSidebar profile={profile} />
      <main style={{
        padding: 32,
        overflowY: 'auto',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  )
}
