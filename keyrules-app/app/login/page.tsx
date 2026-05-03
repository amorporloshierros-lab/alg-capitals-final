import { loginAction } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <LoginForm searchParams={searchParams} />
  )
}

async function LoginForm({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  const error = params?.error

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans, Geist, sans-serif)',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            font: '900 italic 11px/1 var(--font-sans)',
            letterSpacing: '.5em',
            textTransform: 'uppercase',
            color: '#10b981',
            marginBottom: 8,
          }}>
            ◉ KeyRules × ALG
          </div>
          <div style={{
            font: '900 italic 28px/1 var(--font-sans)',
            letterSpacing: '.05em',
            textTransform: 'uppercase',
            color: '#f5f5f5',
          }}>
            Acceso
          </div>
        </div>

        <form action={loginAction} style={{
          background: 'rgba(23,23,23,.6)',
          border: '1px solid rgba(16,185,129,.18)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle} htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,.1)',
              border: '1px solid rgba(239,68,68,.3)',
              borderLeft: '3px solid #ef4444',
              padding: '10px 14px',
              font: '400 12px/1.4 var(--font-sans)',
              color: '#ef4444',
            }}>
              {decodeURIComponent(error)}
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: '13px 0',
              background: '#10b981',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              font: '900 italic 11px/1 var(--font-sans)',
              letterSpacing: '.4em',
              textTransform: 'uppercase',
            }}
          >
            Ingresar
          </button>

          <div style={{ textAlign: 'center' }}>
            <a href="/signup" style={{
              font: '400 11px/1 var(--font-sans)',
              color: '#737373',
              textDecoration: 'none',
              letterSpacing: '.1em',
            }}>
              ¿No tenés cuenta?{' '}
              <span style={{ color: '#10b981' }}>Registrate</span>
            </a>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{
            font: '400 10px/1 var(--font-mono)',
            color: '#525252',
            textDecoration: 'none',
            letterSpacing: '.2em',
            textTransform: 'uppercase',
          }}>
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  font: '900 italic 9px/1 var(--font-sans)',
  letterSpacing: '.3em',
  textTransform: 'uppercase',
  color: '#10b981',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(10,10,10,.7)',
  border: '1px solid rgba(64,64,64,.6)',
  color: '#f5f5f5',
  padding: '11px 14px',
  font: '400 14px/1 var(--font-sans)',
  outline: 'none',
  boxSizing: 'border-box',
}
