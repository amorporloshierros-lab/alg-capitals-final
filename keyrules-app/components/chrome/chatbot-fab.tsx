'use client'

import { useState, useEffect, useRef } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_CHATBOT_URL?.replace('/api/chat', '') || ''

export default function ChatBotFab() {
  const [open, setOpen]       = useState(false)
  const [greet, setGreet]     = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola, soy el asistente Quantz. Preguntame por planes, bias o cómo entrar al Portal Alumnos.' }
  ])
  const [input, setInput]     = useState('')
  const [sending, setSending] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [scrollP, setScrollP] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Crear sesión al abrir
  useEffect(() => {
    if (!open || sessionId) return
    fetch(`${BACKEND}/api/session/new`, {
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
      .then(r => r.json())
      .then(d => setSessionId(d.session_id || d.sessionId))
      .catch(() => {})
  }, [open, sessionId])

  // Scroll detection para candle state
  useEffect(() => {
    const onScroll = () => {
      const y   = window.scrollY || 0
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      setScrollP(Math.min(1, y / max))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Greeting periódico
  useEffect(() => {
    if (open) return
    const t0 = setTimeout(() => setGreet(true), 3500)
    const t1 = setTimeout(() => setGreet(false), 8500)
    const iv = setInterval(() => {
      setGreet(true)
      setTimeout(() => setGreet(false), 5000)
    }, 18000)
    return () => { clearTimeout(t0); clearTimeout(t1); clearInterval(iv) }
  }, [open])

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, sending, open])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    setMessages(m => [...m, { role: 'user', content: text }])
    setInput('')
    setSending(true)
    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ session_id: sessionId, message: text }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.response || data.reply || data.message || 'Sin respuesta.' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'No pude conectar con el asistente. Verificá que el backend esté activo.' }])
    } finally {
      setSending(false)
    }
  }

  // Candle geometry
  const t       = scrollP
  const bearish = t > 0.55
  const color      = bearish ? '#ef4444' : '#10b981'
  const colorDark  = bearish ? '#991b1b' : '#047857'
  const colorLight = bearish ? '#fca5a5' : '#34d399'
  const glow       = bearish ? 'rgba(239,68,68,.55)' : 'rgba(16,185,129,.55)'
  const pct        = bearish
    ? `-${((t - 0.55) / 0.45 * 100).toFixed(1)}%`
    : `+${((1 - t / 0.55) * 100).toFixed(1)}%`

  const dojiY = 56
  let bodyTop: number, bodyBottom: number
  if (!bearish) {
    const k = 1 - Math.min(1, t / 0.55)
    bodyTop    = dojiY - 32 * k
    bodyBottom = dojiY + 32 * k
  } else {
    const k = Math.min(1, (t - 0.55) / 0.45)
    bodyTop    = dojiY - 32 * k
    bodyBottom = dojiY + 32 * k
  }
  const isDoji        = Math.abs(bodyBottom - bodyTop) < 2
  const bodyHeight    = Math.max(2, bodyBottom - bodyTop)
  const upperWickEnd  = bodyTop + 1
  const lowerWickStart = bodyBottom - 1

  return (
    <>
      {/* Greeting bubble */}
      <div style={{
        position: 'fixed', bottom: 62, right: 110, zIndex: 201,
        padding: '10px 14px',
        background: 'rgba(10,10,10,.96)',
        border: `1px solid ${color}`,
        boxShadow: `0 0 22px ${glow}, 0 8px 20px rgba(0,0,0,.6)`,
        maxWidth: 230,
        opacity: greet && !open ? 1 : 0,
        transform: greet && !open ? 'translateY(0) scale(1)' : 'translateY(8px) scale(.92)',
        transformOrigin: '100% 50%',
        transition: 'opacity 380ms cubic-bezier(.2,.7,.2,1), transform 380ms cubic-bezier(.2,.7,.2,1)',
        pointerEvents: greet && !open ? 'auto' : 'none',
      }}>
        <div style={{ font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.35em', color, textTransform: 'uppercase', marginBottom: 6 }}>
          ◉ Asistente Quantz
        </div>
        <div style={{ font: '500 12px/1.45 var(--font-sans)', color: '#f5f5f5' }}>
          ¡Hola! Soy tu asistente.<br />
          <span style={{ color: '#a3a3a3', fontSize: 11 }}>Preguntame por planes o bias del día.</span>
        </div>
        <div style={{ position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: `7px solid ${color}` }} />
        <button onClick={() => setGreet(false)} aria-label="Cerrar" style={{ position: 'absolute', top: 2, right: 4, background: 'none', border: 'none', color: '#525252', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</button>
      </div>

      {/* Candle FAB */}
      <button
        onClick={() => { setOpen(o => !o); setGreet(false) }}
        aria-label="Chat"
        className={greet && !open ? 'candle-fab greeting' : 'candle-fab'}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          width: 72, height: 112,
          background: 'transparent', border: 'none', padding: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          filter: `drop-shadow(0 0 22px ${glow}) drop-shadow(0 8px 16px rgba(0,0,0,.6))`,
          transition: 'filter 400ms ease',
        }}
      >
        {/* Price chip */}
        <div style={{
          position: 'absolute', top: -4, left: '50%', transform: 'translate(-50%,-100%)',
          padding: '4px 10px',
          font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.2em', textTransform: 'uppercase',
          color: isDoji ? '#fbbf24' : color,
          background: 'rgba(0,0,0,.85)',
          border: `1px solid ${isDoji ? '#fbbf24' : color}`,
          whiteSpace: 'nowrap', transition: 'color 400ms, border-color 400ms',
        }}>
          {isDoji ? '◇ DOJI' : (bearish ? '▼' : '▲') + ' ' + pct}
        </div>

        <svg width="120" height="112" viewBox="-24 0 120 112" style={{ overflow: 'visible' }}>
          <rect x="34.8" y="6" width="2.4" height={Math.max(0, upperWickEnd - 6)} fill={color} style={{ transition: 'fill 400ms, height 280ms cubic-bezier(.4,0,.2,1)' }} />
          <rect x="34.8" y={lowerWickStart} width="2.4" height={Math.max(0, 106 - lowerWickStart)} fill={color} style={{ transition: 'fill 400ms, y 280ms cubic-bezier(.4,0,.2,1), height 280ms cubic-bezier(.4,0,.2,1)' }} />

          {greet && !open && (
            <g>
              <g style={{ transformOrigin: '52px 46px', animation: 'armSwing 1.2s cubic-bezier(.4,0,.4,1) infinite' }}>
                <line x1="52" y1="46" x2="70" y2="22" stroke={color} strokeWidth="3" strokeLinecap="round" />
                <g style={{ transformOrigin: '70px 22px', animation: 'forearmWave 0.6s ease-in-out infinite' }}>
                  <line x1="70" y1="22" x2="78" y2="2" stroke={color} strokeWidth="3" strokeLinecap="round" />
                  <g transform="translate(78,2)">
                    <ellipse cx="0" cy="-4" rx="5" ry="6" fill={colorLight} stroke={color} strokeWidth="1.3" />
                    <line x1="-3" y1="-8" x2="-4" y2="-13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
                    <line x1="-1" y1="-9" x2="-1.5" y2="-14" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
                    <line x1="1.5" y1="-9" x2="1.5" y2="-14" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
                    <line x1="4" y1="-8" x2="4" y2="-13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
                    <line x1="-4" y1="-3" x2="-7" y2="-5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
                  </g>
                </g>
              </g>
              <line x1="20" y1="56" x2="-4" y2="52" stroke={color} strokeWidth="3" strokeLinecap="round" />
              <circle cx="-6" cy="52" r="5" fill={colorLight} stroke={color} strokeWidth="1.5" />
            </g>
          )}

          <rect x="20" y={bodyTop} width="32" height={bodyHeight} rx="2"
            fill={isDoji ? color : 'url(#candle-body-grad)'}
            stroke={color} strokeWidth="1.5"
            style={{ transition: 'stroke 400ms, fill 400ms, y 280ms cubic-bezier(.4,0,.2,1), height 280ms cubic-bezier(.4,0,.2,1)' }}
          />
          {!isDoji && bodyHeight > 10 && (
            <rect x="22" y={bodyTop + 2} width="4" height={Math.max(1, bodyHeight - 4)} rx="1" fill="rgba(255,255,255,.25)" style={{ transition: 'y 280ms cubic-bezier(.4,0,.2,1), height 280ms cubic-bezier(.4,0,.2,1)' }} />
          )}
          <defs>
            <linearGradient id="candle-body-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={colorLight} />
              <stop offset="55%" stopColor={color} />
              <stop offset="100%" stopColor={colorDark} />
            </linearGradient>
          </defs>
        </svg>

        <span style={{
          position: 'absolute', top: 26, right: 10,
          width: 10, height: 10, borderRadius: '50%',
          background: '#fff', border: '2px solid #050505', boxShadow: '0 0 6px #fff',
          animation: greet && !open ? 'unreadPulse 1.2s ease-in-out infinite' : 'none',
        }} />

        <style>{`
          .candle-fab.greeting { animation: candleWave 1.6s cubic-bezier(.4,0,.2,1) infinite; }
          @keyframes candleWave { 0%,100%{transform:rotate(0deg) translateY(0)} 15%{transform:rotate(-3deg) translateY(-3px)} 30%{transform:rotate(2deg) translateY(-1px)} 60%{transform:rotate(-2deg) translateY(-2px)} }
          @keyframes armSwing { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(12deg)} }
          @keyframes forearmWave { 0%,100%{transform:rotate(-25deg)} 50%{transform:rotate(28deg)} }
          @keyframes unreadPulse { 0%,100%{transform:scale(1);box-shadow:0 0 6px #fff} 50%{transform:scale(1.4);box-shadow:0 0 14px #fff,0 0 24px ${color}} }
        `}</style>
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 150, right: 24,
          width: 360, maxWidth: 'calc(100vw - 32px)',
          height: 480, maxHeight: 'calc(100vh - 180px)',
          zIndex: 200,
          background: 'rgba(10,10,10,.97)', border: '1px solid rgba(16,185,129,.35)',
          boxShadow: '0 20px 60px rgba(0,0,0,.8), 0 0 40px rgba(16,185,129,.18)',
          backdropFilter: 'blur(10px)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid rgba(16,185,129,.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulseDot 1.6s ease-in-out infinite' }} />
              <span style={{ font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.3em', color: '#10b981', textTransform: 'uppercase' }}>Asistente Quantz</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar" style={{ background: 'none', border: 'none', color: '#737373', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'thin', scrollbarColor: 'rgba(16,185,129,.3) transparent' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '8px 11px',
                background: m.role === 'user' ? 'rgba(16,185,129,.12)' : 'rgba(38,38,38,.7)',
                border: m.role === 'user' ? '1px solid rgba(16,185,129,.3)' : '1px solid rgba(64,64,64,.5)',
                borderLeft: m.role === 'assistant' ? '3px solid #10b981' : '1px solid rgba(16,185,129,.3)',
                font: '400 12.5px/1.5 var(--font-sans)', color: '#f5f5f5',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>{m.content}</div>
            ))}
            {sending && (
              <div style={{ alignSelf: 'flex-start', padding: '8px 11px', background: 'rgba(38,38,38,.7)', borderLeft: '3px solid #10b981', font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.3em', color: '#10b981', textTransform: 'uppercase', display: 'flex', gap: 4, alignItems: 'center' }}>
                <span>Pensando</span>
                <span className="qz-dots"><span>.</span><span>.</span><span>.</span></span>
              </div>
            )}
          </div>

          <form onSubmit={e => { e.preventDefault(); send() }} style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid rgba(16,185,129,.18)', background: 'rgba(0,0,0,.4)' }}>
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Escribí tu pregunta..." disabled={sending}
              style={{ flex: 1, background: 'rgba(23,23,23,.8)', border: '1px solid rgba(64,64,64,.6)', color: '#f5f5f5', padding: '9px 11px', font: '400 12.5px/1 var(--font-sans)', outline: 'none' }}
              onFocus={e => (e.target.style.borderColor = '#10b981')}
              onBlur={e => (e.target.style.borderColor = 'rgba(64,64,64,.6)')}
            />
            <button type="submit" disabled={sending || !input.trim()} style={{ padding: '0 14px', background: input.trim() && !sending ? '#10b981' : '#262626', color: input.trim() && !sending ? '#000' : '#525252', border: 'none', cursor: input.trim() && !sending ? 'pointer' : 'not-allowed', font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.25em', textTransform: 'uppercase', transition: 'background 200ms, color 200ms' }}>
              Enviar
            </button>
          </form>
          <style>{`
            @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.7)}}
            .qz-dots span{animation:qzDot 1.2s infinite;opacity:0}
            .qz-dots span:nth-child(2){animation-delay:.2s}
            .qz-dots span:nth-child(3){animation-delay:.4s}
            @keyframes qzDot{0%,80%,100%{opacity:0}40%{opacity:1}}
          `}</style>
        </div>
      )}
    </>
  )
}
