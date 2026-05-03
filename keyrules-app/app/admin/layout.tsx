import { requireAdmin } from '@/lib/auth'
import AdminSidebar from './components/sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      fontFamily: 'var(--font-sans, Geist, sans-serif)',
    }}>
      <AdminSidebar />
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
