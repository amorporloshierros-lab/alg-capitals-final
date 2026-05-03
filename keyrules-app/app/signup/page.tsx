'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans, Geist, sans-serif)',
      }}>
        <div style={{ maxWidth: 400, padding: '0 24px', textAlign: 'center' }}>
          <div style={{ font: '900 italic 32px/1 var(--font-sans)', color: '#10b981', marginBottom: 16 }}>✦</div>
          <div style={{ font: '900 italic 18px/1.2 var(--font-sans)', color: '#f5f5f5', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
            Revisá tu email
          </div>
          <div style={{ font: '400 13px/1.6 var(--font-sans)', color: '#a3a3a3' }}>
            Enviamos un link de confirmación a <span style={{ color: '#f5f5f5' }}>{email}</span>.
            Una vez confirmado podés ingresar.
          </div>
          <a href="/login" style={{
            display: 'inline-block',
            marginTop: 24,
            padding: '11px 24px',
            background: '#10b981',
            color: '#000',
            font: '900 italic 10px/1 var(--font-sans)',
            letterSpacing: '.4em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            Ir al login
          </a>
        </div>
      </div>
    )
  }

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
            Crear cuenta
          </div>
        </div>

        <form onSubmit={handleSignup} style={{
          background: 'rgba(23,23,23,.6)',
          border: '1px solid rgba(16,185,129,.18)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Tu nombre"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
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
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '13px 0',
              background: loading ? 'rgba(16,185,129,.4)' : '#10b981',
              color: '#000',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              font: '900 italic 11px/1 var(--font-sans)',
              letterSpacing: '.4em',
              textTransform: 'uppercase',
              transition: 'background .2s',
            }}
          >
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <a href="/login" style={{
              font: '400 11px/1 var(--font-sans)',
              color: '#737373',
              textDecoration: 'none',
              letterSpacing: '.1em',
            }}>
              ¿Ya tenés cuenta?{' '}
              <span style={{ color: '#10b981' }}>Ingresar</span>
            </a>
          </div>
        </form>
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
