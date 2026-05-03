import { requireProfile } from '@/lib/auth'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await requireProfile()
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      fontFamily: 'var(--font-sans, Geist, sans-serif)',
    }}>
      {children}
    </div>
  )
}
