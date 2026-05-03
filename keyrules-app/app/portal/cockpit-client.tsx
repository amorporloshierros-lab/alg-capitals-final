'use client'

import { useState, useEffect, useCallback } from 'react'

// ── TYPES ──────────────────────────────────────────────────────────────────
interface Tick { symbol: string; price: number; delta: number; bias: string }
interface Stats { total: number; winRate: number; pnlPct: number }
interface Bias { pair: string; direction: string; analysis_md: string | null; session: string | null }
interface Meet { title: string | null; date_iso: string | null; url: string | null }

interface Props {
  userName: string
  userInitials: string
  plan: string
  stats: Stats
  todayBias: Bias | null
  nextMeet: Meet | null
}

// ── INITIAL TICKS ──────────────────────────────────────────────────────────
const INIT_TICKS: Tick[] = [
  { symbol: 'XAU/USD', price: 2318.45, delta: 0.42,  bias: 'BULL' },
  { symbol: 'EUR/USD', price: 1.0832,  delta: -0.18, bias: 'BEAR' },
  { symbol: 'GBP/JPY', price: 195.22,  delta: 0.88,  bias: 'BULL' },
  { symbol: 'NAS100',  price: 18241.7, delta: 1.12,  bias: 'BULL' },
  { symbol: 'US30',    price: 39412.5, delta: 0.35,  bias: 'BULL' },
  { symbol: 'BTC/USD', price: 67420.1, delta: -0.62, bias: 'BEAR' },
  { symbol: 'GBP/USD', price: 1.2688,  delta: 0.21,  bias: 'BULL' },
  { symbol: 'DXY',     price: 104.28,  delta: 0.09,  bias: 'NEUTRAL' },
]

const BIAS_COLOR: Record<string, string> = {
  alcista: '#10b981', bajista: '#ef4444', neutral: '#fbbf24', range: '#a3a3a3',
  BULL: '#10b981', BEAR: '#ef4444', NEUTRAL: '#fbbf24',
}
const BIAS_LABEL: Record<string, string> = {
  alcista: '▲ ALCISTA', bajista: '▼ BAJISTA', neutral: '◇ NEUTRAL', range: '◎ RANGE',
}

function getSession(h: number) {
  if (h >= 7  && h < 12) return { name: 'LONDON',   color: '#10b981' }
  if (h >= 12 && h < 17) return { name: 'NEW YORK', color: '#f59e0b' }
  if (h >= 17 && h < 22) return { name: 'OVERLAP',  color: '#34d399' }
  return { name: 'ASIA', color: '#737373' }
}

function fmt2(n: number) { return String(n).padStart(2, '0') }

function generateEquity(seed: number, points = 80) {
  const arr = [seed]
  for (let i = 1; i < points; i++) {
    const drift = 15 + Math.random() * 25
    const vol = (Math.random() - 0.3) * 70
    arr.push(Math.max(seed * 0.88, arr[i-1] + drift + vol))
  }
  return arr
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function CockpitClient({ userName, userInitials, plan, stats, todayBias, nextMeet }: Props) {
  const [time, setTime] = useState(new Date())
  const [ticks, setTicks] = useState<Tick[]>(INIT_TICKS)
  const [equity, setEquity] = useState<number[]>(() => generateEquity(10000))
  const [meetCountdown, setMeetCountdown] = useState('')

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Live ticks
  useEffect(() => {
    const t = setInterval(() => {
      setTicks(prev => prev.map(tk => {
        const vol = tk.price * 0.0006
        const np = +(tk.price + (Math.random() - 0.5) * vol * 2).toFixed(tk.price < 10 ? 5 : 2)
        const nd = +(tk.delta + (Math.random() - 0.5) * 0.06).toFixed(2)
        return { ...tk, price: np, delta: nd }
      }))
    }, 1800)
    return () => clearInterval(t)
  }, [])

  // Live equity curve
  useEffect(() => {
    const t = setInterval(() => {
      setEquity(prev => {
        const last = prev[prev.length - 1]
        const next = Math.max(8800, last + (Math.random() - 0.35) * 55)
        return [...prev.slice(1), +next.toFixed(2)]
      })
    }, 2400)
    return () => clearInterval(t)
  }, [])

  // Meet countdown
  const updateCountdown = useCallback(() => {
    if (!nextMeet?.date_iso) return
    const diff = new Date(nextMeet.date_iso).getTime() - Date.now()
    if (diff <= 0) { setMeetCountdown('¡EN VIVO!'); return }
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    setMeetCountdown(d > 0 ? `${d}d ${fmt2(h)}h ${fmt2(m)}m` : `${fmt2(h)}h ${fmt2(m)}m`)
  }, [nextMeet])

  useEffect(() => {
    updateCountdown()
    const t = setInterval(updateCountdown, 60000)
    return () => clearInterval(t)
  }, [updateCountdown])

  const session = getSession(time.getUTCHours())
  const balance = equity[equity.length - 1]
  const pnlAbs = balance - equity[0]
  const pnlPct = ((pnlAbs / equity[0]) * 100)
  const maxEq = Math.max(...equity)
  const minEq = Math.min(...equity)
  const dd = ((minEq - maxEq) / maxEq * 100)

  // SVG equity curve
  const W = 100, H = 100
  const pts = equity.map((v, i) => [i / (equity.length - 1) * W, H - ((v - minEq) / ((maxEq - minEq) || 1)) * H])
  const linePath = 'M ' + pts.map(p => p.join(' ')).join(' L ')
  const fillPath = linePath + ` L ${W} ${H} L 0 ${H} Z`

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f5f5f5', overflow: 'hidden' }}>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 28px', background: 'rgba(10,10,10,.95)',
        borderBottom: '1px solid #171717', borderLeft: '3px solid #10b981',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="/" style={{
            font: '900 8px/1 var(--font-sans)', letterSpacing: '.3em', color: '#525252',
            textTransform: 'uppercase', cursor: 'pointer', padding: '7px 12px',
            border: '1px solid #262626', textDecoration: 'none',
          }}>← SALIR</a>
          <div>
            <div style={{ font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.4em', color: '#10b981', textTransform: 'uppercase', marginBottom: 5 }}>
              ⬢ KeyRules × ALG · Terminal
            </div>
            <h1 style={{ font: '900 italic 20px/1 var(--font-sans)', color: '#fff', margin: 0, letterSpacing: '-.01em', textTransform: 'uppercase' }}>
              Cockpit de <span style={{ color: '#10b981', textShadow: '0 0 12px rgba(16,185,129,.5)' }}>{userName}</span>
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ font: '700 7px/1 var(--font-mono)', letterSpacing: '.3em', color: '#525252', textTransform: 'uppercase', marginBottom: 4 }}>Sesión activa</div>
            <div style={{ font: '900 italic 13px/1 var(--font-sans)', color: session.color, letterSpacing: '.15em', textTransform: 'uppercase' }}>{session.name}</div>
          </div>
          <div style={{ width: 1, height: 32, background: '#262626' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ font: '700 7px/1 var(--font-mono)', letterSpacing: '.3em', color: '#525252', textTransform: 'uppercase', marginBottom: 4 }}>UTC</div>
            <div style={{ font: '700 15px/1 var(--font-mono)', color: '#d4d4d4' }}>
              {fmt2(time.getUTCHours())}:{fmt2(time.getUTCMinutes())}:{fmt2(time.getUTCSeconds())}
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: '#262626' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }} />
            <span style={{ font: '700 8px/1 var(--font-mono)', letterSpacing: '.2em', color: '#10b981', textTransform: 'uppercase' }}>Oracle Conectado</span>
          </div>
          <div style={{
            width: 38, height: 38, border: '1px solid rgba(16,185,129,.4)',
            background: '#10b981', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
            font: '900 italic 13px/1 var(--font-sans)', boxShadow: '0 0 16px rgba(16,185,129,.35)',
          }}>{userInitials}</div>
        </div>
      </header>

      {/* ── TICKER ────────────────────────────────────────────────────── */}
      <div style={{ overflow: 'hidden', borderBottom: '1px solid #171717', background: 'rgba(10,10,10,.7)', position: 'relative', height: 38 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2, padding: '0 14px',
          background: '#10b981', color: '#000', font: '900 italic 8px/1 var(--font-sans)',
          letterSpacing: '.3em', textTransform: 'uppercase', display: 'flex', alignItems: 'center',
        }}>◉ LIVE · FEED</div>
        <div style={{
          display: 'flex', paddingLeft: 130, alignItems: 'center', height: '100%',
          animation: 'marquee 30s linear infinite', whiteSpace: 'nowrap',
        }}>
          {[...ticks, ...ticks].map((tk, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 24px', borderRight: '1px solid #1a1a1a' }}>
              <span style={{ font: '900 italic 10px/1 var(--font-sans)', color: '#f5f5f5', letterSpacing: '.08em' }}>{tk.symbol}</span>
              <span style={{ font: '700 11px/1 var(--font-mono)', color: '#f5f5f5' }}>{tk.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: tk.price < 10 ? 5 : 2 })}</span>
              <span style={{ font: '700 9px/1 var(--font-mono)', color: tk.delta >= 0 ? '#10b981' : '#ef4444' }}>
                {tk.delta >= 0 ? '+' : ''}{tk.delta.toFixed(2)}%
              </span>
              <span style={{ font: '700 7px/1 var(--font-sans)', color: BIAS_COLOR[tk.bias] ?? '#737373', letterSpacing: '.2em' }}>{tk.bias}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 0, height: 'calc(100vh - 112px)' }}>

        {/* LEFT COLUMN */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', borderRight: '1px solid #171717' }}>

          {/* Master Account panel */}
          <div style={{ background: 'rgba(23,23,23,.6)', border: '1px solid rgba(16,185,129,.2)', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #171717' }}>
              <div>
                <div style={{ font: '900 italic 7px/1 var(--font-sans)', letterSpacing: '.4em', color: '#525252', textTransform: 'uppercase', marginBottom: 5 }}>Master Account · $100K</div>
                <div style={{ font: '900 italic 15px/1 var(--font-sans)', color: '#f5f5f5', textTransform: 'uppercase', letterSpacing: '.03em' }}>Equity Curve · Live</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ font: '700 7px/1 var(--font-mono)', color: '#10b981', letterSpacing: '.2em', textTransform: 'uppercase' }}>Streaming · Oracle MT5</span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 0, borderBottom: '1px solid #171717' }}>
              {[
                { l: 'Balance actual', v: `$${Math.round(balance).toLocaleString('en-US')}`, c: '#10b981', big: true },
                { l: 'P&L Total', v: `${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%`, c: pnlPct >= 0 ? '#10b981' : '#ef4444' },
                { l: 'Max Drawdown', v: `${Math.abs(dd).toFixed(2)}%`, c: '#f59e0b' },
                { l: 'Win Rate', v: `${stats.winRate || 68}%`, c: '#34d399' },
                { l: 'Trades', v: String(stats.total || 247) },
                { l: 'P&L Journal', v: `${stats.pnlPct >= 0 ? '+' : ''}${stats.pnlPct.toFixed(2)}%`, c: stats.pnlPct >= 0 ? '#10b981' : '#ef4444' },
              ].map(({ l, v, c, big }) => (
                <div key={l} style={{ padding: '12px 14px', borderRight: '1px solid #171717' }}>
                  <div style={{ font: '700 7px/1 var(--font-mono)', color: '#525252', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 6 }}>{l}</div>
                  <div style={{ font: `900 italic ${big ? 18 : 14}px/1 var(--font-mono)`, color: c ?? '#f5f5f5' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Equity SVG */}
            <div style={{ padding: 14, position: 'relative', background: 'rgba(0,0,0,.3)' }}>
              <div style={{ position: 'relative', height: 150 }}>
                <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
                  <defs>
                    <linearGradient id="eq-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map(p => (
                    <line key={p} x1="0" y1={H*p} x2={W} y2={H*p} stroke="#1a1a1a" strokeWidth="0.4" vectorEffect="non-scaling-stroke"/>
                  ))}
                  <path d={fillPath} fill="url(#eq-fill)"/>
                  <path d={linePath} stroke="#10b981" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" style={{ filter: 'drop-shadow(0 0 3px rgba(16,185,129,.5))' }}/>
                  <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="1.5" fill="#34d399"/>
                </svg>
                <div style={{ position: 'absolute', top: 4, left: 6, font: '700 7px/1 var(--font-mono)', color: '#404040', letterSpacing: '.15em' }}>${Math.round(maxEq).toLocaleString()}</div>
                <div style={{ position: 'absolute', bottom: 4, left: 6, font: '700 7px/1 var(--font-mono)', color: '#404040', letterSpacing: '.15em' }}>${Math.round(minEq).toLocaleString()}</div>
                <div style={{ position: 'absolute', bottom: 4, right: 6, font: '700 7px/1 var(--font-mono)', color: '#10b981', letterSpacing: '.15em' }}>{new Date().toLocaleDateString('es-AR')}</div>
              </div>
            </div>
          </div>

          {/* Bias del día */}
          <div style={{ background: 'rgba(23,23,23,.6)', border: `1px solid ${todayBias ? (BIAS_COLOR[todayBias.direction] + '30') : '#262626'}`, borderLeft: `3px solid ${todayBias ? BIAS_COLOR[todayBias.direction] : '#262626'}` }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #171717', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.4em', color: '#525252', textTransform: 'uppercase' }}>▲ Bias del Día</div>
              <a href="/portal/bias" style={{ font: '700 7px/1 var(--font-mono)', color: '#10b981', letterSpacing: '.2em', textTransform: 'uppercase', textDecoration: 'none' }}>Ver historial →</a>
            </div>
            {todayBias ? (
              <div style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                  <span style={{ font: '900 italic 22px/1 var(--font-sans)', color: '#f5f5f5', letterSpacing: '.05em', textTransform: 'uppercase' }}>{todayBias.pair}</span>
                  <span style={{ font: '900 italic 11px/1 var(--font-sans)', color: BIAS_COLOR[todayBias.direction], letterSpacing: '.2em', textTransform: 'uppercase' }}>
                    {BIAS_LABEL[todayBias.direction] ?? todayBias.direction}
                  </span>
                  {todayBias.session && <span style={{ font: '700 8px/1 var(--font-mono)', color: '#525252', letterSpacing: '.2em', textTransform: 'uppercase' }}>◉ {todayBias.session}</span>}
                </div>
                {todayBias.analysis_md && (
                  <div style={{ font: '400 12px/1.6 var(--font-sans)', color: '#a3a3a3', background: 'rgba(0,0,0,.3)', padding: '10px 14px', borderTop: '1px solid #1a1a1a', whiteSpace: 'pre-line' }}>
                    {todayBias.analysis_md.slice(0, 280)}{todayBias.analysis_md.length > 280 ? '...' : ''}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: '#404040', font: '400 12px/1 var(--font-sans)' }}>
                El bias de hoy aún no fue publicado
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ overflowY: 'auto', background: 'rgba(5,5,5,.5)' }}>

          {/* Prop Firms */}
          <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #171717' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ font: '900 italic 7px/1 var(--font-sans)', letterSpacing: '.4em', color: '#525252', textTransform: 'uppercase', marginBottom: 5 }}>Prop Firms · Funder Sync</div>
                <div style={{ font: '900 italic 14px/1 var(--font-sans)', color: '#f5f5f5', textTransform: 'uppercase', letterSpacing: '.03em' }}>Challenges Activos</div>
              </div>
              <span style={{ font: '700 8px/1 var(--font-mono)', color: '#737373', letterSpacing: '.2em' }}>3 activos</span>
            </div>
            {[
              { firm: 'FTMO', acct: '250K', stage: 'Stage 2', target: 5, current: 3.82, dd: 1.2, maxDd: 10, dailyDd: 5, days: 14, trades: 47, wr: 62, status: 'EN CURSO' },
              { firm: 'Alpha Capital', acct: '100K', stage: 'Stage 1', target: 8, current: 7.41, dd: 2.4, maxDd: 8, dailyDd: 4, days: 6, trades: 32, wr: 71, status: 'EN CURSO' },
              { firm: 'FundedNext', acct: '200K', stage: 'Funded', target: 0, current: 4.52, dd: 0.8, maxDd: 6, dailyDd: 3, days: 0, trades: 18, wr: 77, status: 'FUNDED' },
            ].map((c) => {
              const pct = c.target > 0 ? Math.min(100, (c.current / c.target) * 100) : 100
              const ddPct = (c.dd / c.maxDd) * 100
              const ddColor = ddPct > 70 ? '#ef4444' : ddPct > 40 ? '#f59e0b' : '#525252'
              const funded = c.status === 'FUNDED'
              return (
                <div key={c.firm} style={{ padding: 12, background: 'rgba(5,5,5,.5)', border: '1px solid #171717', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ font: '900 italic 12px/1 var(--font-sans)', color: '#fff' }}>{c.firm}</span>
                        <span style={{ font: '700 7px/1 var(--font-mono)', color: '#737373', letterSpacing: '.15em' }}>{c.acct} · {c.stage}</span>
                      </div>
                      <span style={{ padding: '2px 8px', background: funded ? 'rgba(16,185,129,.15)' : 'rgba(16,185,129,.08)', color: '#10b981', font: '700 7px/1 var(--font-sans)', letterSpacing: '.2em', textTransform: 'uppercase' }}>
                        ● {c.status}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ font: '900 italic 14px/1 var(--font-sans)', color: funded ? '#10b981' : '#fff' }}>
                        {funded ? `+${c.current.toFixed(2)}%` : `${c.days}d`}
                      </div>
                      <div style={{ font: '700 7px/1 var(--font-mono)', color: '#737373', letterSpacing: '.15em', textTransform: 'uppercase', marginTop: 3 }}>
                        {funded ? 'payout' : 'restantes'}
                      </div>
                    </div>
                  </div>
                  {!funded && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', font: '700 7px/1 var(--font-mono)', color: '#737373', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                        <span>Target {c.target}%</span>
                        <span style={{ color: '#10b981' }}>{c.current.toFixed(2)}% · {pct.toFixed(0)}%</span>
                      </div>
                      <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,.5)', borderRadius: 2, transition: 'width .3s' }} />
                      </div>
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', font: '700 7px/1 var(--font-mono)', color: '#737373', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                      <span>DD {c.dd.toFixed(2)}% / {c.maxDd}%</span>
                      <span style={{ color: ddColor }}>Daily {c.dailyDd}%</span>
                    </div>
                    <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${ddPct}%`, background: ddColor, borderRadius: 2, transition: 'width .3s' }} />
                    </div>
                  </div>
                  <div style={{ font: '700 8px/1 var(--font-mono)', color: '#525252', marginTop: 8 }}>{c.trades}t · {c.wr}% WR</div>
                </div>
              )
            })}
          </div>

          {/* Próximo Meet */}
          {nextMeet && (
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #171717' }}>
              <div style={{ font: '900 italic 7px/1 var(--font-sans)', letterSpacing: '.4em', color: '#525252', textTransform: 'uppercase', marginBottom: 10 }}>◈ Próximo Meet</div>
              <div style={{ font: '900 italic 13px/1 var(--font-sans)', color: '#f5f5f5', marginBottom: 6 }}>{nextMeet.title ?? 'Meet en vivo'}</div>
              {meetCountdown && (
                <div style={{ font: '700 18px/1 var(--font-mono)', color: '#10b981', marginBottom: 10 }}>{meetCountdown}</div>
              )}
              {nextMeet.url && (
                <a href={nextMeet.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block', padding: '8px 16px', background: '#10b981', color: '#000',
                  font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.3em', textTransform: 'uppercase', textDecoration: 'none',
                }}>→ Unirse</a>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ font: '900 italic 7px/1 var(--font-sans)', letterSpacing: '.4em', color: '#525252', textTransform: 'uppercase', marginBottom: 12 }}>◇ Secciones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { href: '/portal/bias',    icon: '▲', label: 'Bias Diario',    sub: 'Sesgo del mercado' },
                { href: '/portal/signals', icon: '◎', label: 'Señales',        sub: 'Trading en vivo' },
                { href: '/portal/academia',icon: '▶', label: 'Academia',       sub: 'Clases & replays' },
                { href: '/portal/journal', icon: '◈', label: 'Journal',        sub: 'Registro de operaciones' },
              ].map(({ href, icon, label, sub }) => (
                <a key={href} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                  background: 'rgba(23,23,23,.4)', border: '1px solid #1a1a1a',
                  textDecoration: 'none', transition: 'border-color .2s',
                }}>
                  <span style={{ font: '900 italic 16px/1 var(--font-sans)', color: '#10b981', width: 20, textAlign: 'center' }}>{icon}</span>
                  <div>
                    <div style={{ font: '900 italic 11px/1 var(--font-sans)', color: '#f5f5f5', letterSpacing: '.05em', marginBottom: 3 }}>{label}</div>
                    <div style={{ font: '400 9px/1 var(--font-mono)', color: '#525252', letterSpacing: '.1em' }}>{sub}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', font: '700 9px/1 var(--font-mono)', color: '#404040' }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Plan badge */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #171717', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ font: '700 8px/1 var(--font-mono)', color: '#404040', letterSpacing: '.2em', textTransform: 'uppercase' }}>Plan activo</span>
            <span style={{ padding: '3px 10px', background: 'rgba(16,185,129,.08)', color: '#10b981', font: '700 8px/1 var(--font-sans)', letterSpacing: '.25em', textTransform: 'uppercase' }}>
              {plan.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .4 } }
      `}</style>
    </div>
  )
}
