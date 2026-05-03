'use client'

import { useEffect, useRef, useState } from 'react'
import type { Database } from '@/types/database'

type MeetConfig = Database['public']['Tables']['meet_config']['Row'] | null

// ---------- price action simulator ----------
let trendRegime = (Math.random() - 0.5) * 0.6
let volRegime   = 0.08
let regimeTicks = 0

interface Candle { close: number; fastEma: number; slowEma: number }
function genCandle(prev: Candle | null): Candle {
  regimeTicks++
  if (regimeTicks > 20 + Math.random() * 20) {
    regimeTicks = 0
    trendRegime = (Math.random() - 0.5) * 0.7
    volRegime   = 0.05 + Math.random() * 0.12
  }
  const news  = Math.random() > 0.96
  const vol   = news ? 0.35 : volRegime + (Math.random() - 0.5) * 0.04
  const drift = trendRegime * 0.006
  const mr    = prev ? (prev.slowEma - prev.close) * 0.03 : 0
  const noise = (Math.random() - 0.5) * vol
  const last  = prev ? prev.close : 100
  const close = Math.max(last * 0.85, last + last * (drift + mr + noise))
  const fastEma = prev ? close * 0.22 + prev.fastEma * 0.78 : close
  const slowEma = prev ? close * 0.06 + prev.slowEma * 0.94 : close
  return { close, fastEma, slowEma }
}

export default function LiveChart({ meetConfig }: { meetConfig: MeetConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, dpr = window.devicePixelRatio || 1

    const resize = () => {
      W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let x = 0
    const SPEED = 0.65, TRAIL = 280
    const pts: { x: number; y: number }[] = Array(2000).fill(null).map(() => ({ x: -1, y: 0 }))
    let head = 0
    const samples: { x: number; y: number }[] = []
    let price = 0, baseline = 0, trendDir = -1, trendStepsLeft = 0, vol = 7, volTarget = 7
    let priceMin = 0, priceMax = 0

    const pickNewTrend = () => {
      const r = Math.random()
      if (r < 0.4)       { trendDir = -1; trendStepsLeft = 120 + Math.random() * 180 }
      else if (r < 0.75) { trendDir =  1; trendStepsLeft = 100 + Math.random() * 160 }
      else               { trendDir =  0; trendStepsLeft =  60 + Math.random() * 100 }
    }

    const init = () => {
      priceMin = H * 0.02; priceMax = H * 0.98
      price = H * 0.5; baseline = H * 0.5
      pickNewTrend()
      samples.length = 0
      for (let i = 0; i <= 20; i++) samples.push({ x: i, y: stepPrice() })
      for (const p of pts) { p.x = -1 }
      head = 0; x = 0
    }

    const stepPrice = (): number => {
      if (trendStepsLeft-- <= 0) pickNewTrend()
      baseline += trendDir * (1.1 + Math.random() * 0.9)
      baseline  = Math.max(priceMin + 20, Math.min(priceMax - 20, baseline))
      if (Math.random() < 0.02) volTarget = 4 + Math.random() * 9
      vol += (volTarget - vol) * 0.04
      const revert   = (baseline - price) * 0.004
      const shock    = (Math.random() + Math.random() + Math.random() - 1.5) * vol * 5
      const newsJump = Math.random() < 0.025 ? (Math.random() - 0.5) * 120 : 0
      price = Math.max(priceMin, Math.min(priceMax, price + revert + shock + newsJump))
      return price
    }

    const valueAt = (xPos: number): number => {
      while (samples.length <= xPos + 2) samples.push({ x: samples.length, y: stepPrice() })
      return samples[Math.floor(xPos)].y
    }

    init()

    let raf: number
    const frame = () => {
      ctx.fillStyle = 'rgba(5,5,5,0.16)'
      ctx.fillRect(0, 0, W, H)

      for (let s = 0; s < SPEED; s++) {
        x++
        if (x > W + 20) {
          ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, W, H)
          init()
        }
        const y = valueAt(x)
        pts[head] = { x, y }
        head = (head + 1) % pts.length
      }

      for (let layer = 0; layer < 2; layer++) {
        ctx.strokeStyle = layer === 0 ? 'rgba(16,185,129,0.4)' : '#34d399'
        ctx.lineWidth   = layer === 0 ? 5 : 1.6
        ctx.shadowColor = '#10b981'
        ctx.shadowBlur  = layer === 0 ? 18 : 6
        ctx.lineJoin = 'round'; ctx.lineCap = 'round'
        ctx.beginPath()
        let started = false
        for (let i = 0; i < pts.length; i++) {
          const idx = (head - 1 - i + pts.length) % pts.length
          const p   = pts[idx]
          if (!p || p.x < 0) break
          const distFromHead = x - p.x
          if (distFromHead > TRAIL) break
          if (p.x > x) continue
          if (!started) { ctx.moveTo(p.x, p.y); started = true }
          else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      }
      ctx.shadowBlur = 0

      const hp = pts[(head - 1 + pts.length) % pts.length]
      if (hp && hp.x >= 0) {
        ctx.fillStyle  = '#d1fae5'
        ctx.shadowColor = '#10b981'; ctx.shadowBlur = 22
        ctx.beginPath(); ctx.arc(hp.x, hp.y, 3.4, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', background: '#050505' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 55%, rgba(16,185,129,.18) 0%, rgba(16,185,129,.04) 28%, transparent 62%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(16,185,129,.08) 1px,transparent 1px),' +
          'linear-gradient(90deg,rgba(16,185,129,.08) 1px,transparent 1px),' +
          'linear-gradient(rgba(16,185,129,.18) 1px,transparent 1px),' +
          'linear-gradient(90deg,rgba(16,185,129,.18) 1px,transparent 1px)',
        backgroundSize: '20px 20px,20px 20px,100px 100px,100px 100px',
        maskImage: 'radial-gradient(ellipse at 50% 55%, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, black 20%, transparent 80%)',
        opacity: .7,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(16,185,129,.025) 4px)',
      }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
      <MeetBanner meetConfig={meetConfig} />
      <style>{`@keyframes ecgBlink{0%,100%{opacity:1}50%{opacity:.25}}`}</style>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#050505,transparent 50%,#050505)', opacity: .9 }} />
    </div>
  )
}

function MeetBanner({ meetConfig }: { meetConfig: MeetConfig }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [])

  if (!meetConfig?.date_iso || !meetConfig.active) return null

  const meetDate = new Date(meetConfig.date_iso)
  const diff     = meetDate.getTime() - now
  const isLive   = diff <= 0 && diff > -2 * 60 * 60 * 1000
  const isPast   = diff <= -2 * 60 * 60 * 1000

  const dd = String(meetDate.getDate()).padStart(2, '0')
  const mm = String(meetDate.getMonth() + 1).padStart(2, '0')
  const hh = String(meetDate.getHours()).padStart(2, '0')
  const mn = String(meetDate.getMinutes()).padStart(2, '0')
  const dateLabel = `${dd}/${mm} · ${hh}:${mn}HS`

  let countdown = ''
  if (!isPast && !isLive) {
    const s    = Math.floor(diff / 1000)
    const days = Math.floor(s / 86400)
    const hrs  = Math.floor((s % 86400) / 3600)
    const mins = Math.floor((s % 3600) / 60)
    const secs = s % 60
    countdown = days > 0
      ? `${days}D ${hrs}H ${mins}M`
      : `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
  }

  const dotColor   = isLive ? '#ef4444' : (isPast ? '#737373' : '#10b981')
  const borderColor = isLive ? 'rgba(239,68,68,.5)' : 'rgba(16,185,129,.3)'
  const accentColor = isLive ? '#ef4444' : '#10b981'
  const shadow      = isLive ? '0 0 24px rgba(239,68,68,.35)' : '0 0 18px rgba(16,185,129,.15)'

  return (
    <a
      href={meetConfig.url || '#'} target="_blank" rel="noopener noreferrer"
      style={{
        position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 14, alignItems: 'center',
        padding: '10px 20px', border: `1px solid ${borderColor}`,
        background: 'rgba(5,5,5,.82)', backdropFilter: 'blur(6px)',
        textDecoration: 'none', cursor: 'pointer',
        boxShadow: shadow, transition: 'all 280ms', pointerEvents: 'auto',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, boxShadow: `0 0 10px ${dotColor}`, animation: 'ecgBlink 1.1s infinite', flexShrink: 0 }} />
      <span style={{ font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.35em', color: accentColor, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {isLive ? '● EN VIVO AHORA' : (isPast ? 'Próximo meet' : 'Próx. Meet')}
      </span>
      {!isLive && !isPast && (
        <>
          <span style={{ color: '#404040' }}>·</span>
          <span style={{ font: '700 11px/1 var(--font-mono)', color: '#d4d4d4', letterSpacing: '.15em', whiteSpace: 'nowrap' }}>{dateLabel}</span>
          <span style={{ color: '#404040' }}>·</span>
          <span style={{ font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.25em', color: '#fbbf24', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{countdown}</span>
        </>
      )}
      {isLive && <span style={{ font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.25em', color: '#f5f5f5', textTransform: 'uppercase' }}>Entrar →</span>}
      {isPast && (
        <>
          <span style={{ color: '#404040' }}>·</span>
          <span style={{ font: '700 10px/1 var(--font-mono)', color: '#737373', letterSpacing: '.15em' }}>Próximamente</span>
        </>
      )}
    </a>
  )
}
