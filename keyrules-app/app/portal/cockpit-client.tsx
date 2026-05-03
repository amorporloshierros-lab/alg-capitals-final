'use client'

import { useState, useEffect, useCallback } from 'react'

// ── TYPES ──────────────────────────────────────────────────────────────────
interface Trade { result_pct: number|null; pair: string|null; direction: string|null; notes: string|null; taken_at: string }
interface Signal { id: string; pair: string; direction: string; entry: number; sl: number; tp: number; status: string; posted_at: string }
interface Bias { pair: string; direction: string; analysis_md: string|null; session: string|null; video_url: string|null }
interface Meet { title: string|null; date_iso: string|null; url: string|null }
interface Stats { total: number; winRate: number; pnlPct: number }

interface Props {
  userName: string; userInitials: string; plan: string; stats: Stats
  trades: Trade[]; todayBias: Bias|null; nextMeet: Meet|null
  signals: Signal[]; academyPct: number; completedClasses: number; totalClasses: number
}

// ── INIT TICKS ─────────────────────────────────────────────────────────────
const INIT_TICKS = [
  { symbol:'XAU/USD', price:2318.45, delta:0.42,  bias:'BULL' },
  { symbol:'EUR/USD', price:1.0832,  delta:-0.18, bias:'BEAR' },
  { symbol:'GBP/JPY', price:195.22,  delta:0.88,  bias:'BULL' },
  { symbol:'NAS100',  price:18241.7, delta:1.12,  bias:'BULL' },
  { symbol:'US30',    price:39412.5, delta:0.35,  bias:'BULL' },
  { symbol:'BTC/USD', price:67420.1, delta:-0.62, bias:'BEAR' },
  { symbol:'GBP/USD', price:1.2688,  delta:0.21,  bias:'BULL' },
  { symbol:'DXY',     price:104.28,  delta:0.09,  bias:'NEUTRAL' },
]

const BC: Record<string,string> = { alcista:'#10b981',bajista:'#ef4444',neutral:'#fbbf24',range:'#a3a3a3',LONG:'#10b981',SHORT:'#ef4444',BULL:'#10b981',BEAR:'#ef4444',NEUTRAL:'#fbbf24' }
const BL: Record<string,string> = { alcista:'▲ ALCISTA',bajista:'▼ BAJISTA',neutral:'◇ NEUTRAL',range:'◎ RANGE' }
const f2 = (n: number) => String(n).padStart(2,'0')

function getSession(h: number) {
  if (h>=7&&h<12) return { name:'LONDON',   color:'#10b981' }
  if (h>=12&&h<17) return { name:'NEW YORK', color:'#f59e0b' }
  if (h>=17&&h<22) return { name:'OVERLAP',  color:'#34d399' }
  return { name:'ASIA', color:'#737373' }
}

function genEquity(seed=10000, pts=80) {
  const a=[seed]
  for(let i=1;i<pts;i++) a.push(Math.max(seed*.88, a[i-1]+15+Math.random()*25+(Math.random()-.3)*70))
  return a
}

// ── PANEL WRAPPER ─────────────────────────────────────────────────────────
function Panel({ eyebrow, title, children, action, glow=false }: { eyebrow:string; title:string; children:React.ReactNode; action?:React.ReactNode; glow?:boolean }) {
  return (
    <div style={{ background:'rgba(23,23,23,.6)', border:`1px solid ${glow?'rgba(16,185,129,.25)':'#1f1f1f'}`, marginBottom:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 16px', borderBottom:'1px solid #171717' }}>
        <div>
          <div style={{ font:'900 italic 7px/1 var(--font-sans)', letterSpacing:'.4em', color:'#525252', textTransform:'uppercase', marginBottom:4 }}>{eyebrow}</div>
          <div style={{ font:'900 italic 13px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.03em' }}>{title}</div>
        </div>
        {action}
      </div>
      <div style={{ padding:'14px 16px' }}>{children}</div>
    </div>
  )
}

function Pill({ children, status='live' }: { children:React.ReactNode; status?:string }) {
  const c = status==='live'?'#10b981':status==='warn'?'#f59e0b':'#ef4444'
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', background:`${c}15`, border:`1px solid ${c}40` }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:c, display:'inline-block' }}/>
      <span style={{ font:'700 7px/1 var(--font-mono)', color:c, letterSpacing:'.2em', textTransform:'uppercase' }}>{children}</span>
    </span>
  )
}

function Bar({ pct, color='#10b981' }: { pct:number; color?:string }) {
  return (
    <div style={{ height:3, background:'#1a1a1a', borderRadius:2 }}>
      <div style={{ height:'100%', width:`${Math.min(100,pct)}%`, background:color, borderRadius:2, transition:'width .4s' }}/>
    </div>
  )
}

function Stat({ label, value, prefix='', suffix='', color='#f5f5f5', big=false }: { label:string; value:string; prefix?:string; suffix?:string; color?:string; big?:boolean }) {
  return (
    <div>
      <div style={{ font:'700 7px/1 var(--font-mono)', color:'#525252', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:5 }}>{label}</div>
      <div style={{ font:`900 italic ${big?20:13}px/1 var(--font-mono)`, color }}>{prefix}{value}{suffix}</div>
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────
export default function CockpitClient({ userName, userInitials, plan, stats, trades, todayBias, nextMeet, signals, academyPct, completedClasses, totalClasses }: Props) {
  const [time, setTime] = useState(new Date())
  const [ticks, setTicks] = useState(INIT_TICKS)
  const [equity, setEquity] = useState<number[]>(() => genEquity())
  const [countdown, setCountdown] = useState('')
  const [risk, setRisk] = useState({ balance:100000, riskPct:0.5, stop:42, rr:3 })
  const [checklist, setChecklist] = useState([
    { label:'HTF bias definido (D1/H4)', done:true },
    { label:'Zona PD premium/discount',  done:true },
    { label:'Liquidez barrida',          done:true },
    { label:'Confluencia SMT / DXY',     done:true },
    { label:'Kill zone activa',          done:false },
    { label:'CHoCH confirmado M5',       done:false },
    { label:'Riesgo ≤ 0.5% cuenta',     done:true },
    { label:'R:R mínimo 1:2.5',         done:false },
  ])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setTicks(prev => prev.map(tk => {
        const v = tk.price*.0006
        const np = +(tk.price+(Math.random()-.5)*v*2).toFixed(tk.price<10?5:2)
        const nd = +(tk.delta+(Math.random()-.5)*.06).toFixed(2)
        return {...tk, price:np, delta:nd}
      }))
    }, 1800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setEquity(prev => {
        const last = prev[prev.length-1]
        return [...prev.slice(1), Math.max(8800, last+(Math.random()-.35)*55)]
      })
    }, 2400)
    return () => clearInterval(t)
  }, [])

  const updateCountdown = useCallback(() => {
    if (!nextMeet?.date_iso) return
    const diff = new Date(nextMeet.date_iso).getTime() - Date.now()
    if (diff<=0) { setCountdown('¡EN VIVO!'); return }
    const d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000), m=Math.floor((diff%3600000)/60000)
    setCountdown(d>0?`${d}d ${f2(h)}h ${f2(m)}m`:`${f2(h)}h ${f2(m)}m`)
  }, [nextMeet])

  useEffect(() => { updateCountdown(); const t=setInterval(updateCountdown,60000); return ()=>clearInterval(t) }, [updateCountdown])

  const session = getSession(time.getUTCHours())
  const bal = equity[equity.length-1]
  const pnlAbs = bal-equity[0]
  const pnlPctEq = ((pnlAbs/equity[0])*100)
  const maxEq = Math.max(...equity), minEq = Math.min(...equity)
  const dd = ((minEq-maxEq)/maxEq*100)
  const W=100,H=100
  const pts = equity.map((v,i)=>[i/(equity.length-1)*W, H-((v-minEq)/((maxEq-minEq)||1))*H])
  const linePath = 'M '+pts.map(p=>p.join(' ')).join(' L ')
  const fillPath = linePath+` L ${W} ${H} L 0 ${H} Z`

  const riskUsd = risk.balance*(risk.riskPct/100)
  const lots = (riskUsd/(risk.stop*10)).toFixed(2)
  const targetUsd = (riskUsd*risk.rr).toFixed(0)
  const doneCount = checklist.filter(i=>i.done).length
  const clReady = doneCount>=6

  const CHALLENGES = [
    { firm:'FTMO', acct:'250K', stage:'Stage 2', target:5, current:3.82, dd:1.2, maxDd:10, dailyDd:5, days:14, trades:47, wr:62, funded:false },
    { firm:'Alpha Capital', acct:'100K', stage:'Stage 1', target:8, current:7.41, dd:2.4, maxDd:8, dailyDd:4, days:6, trades:32, wr:71, funded:false },
    { firm:'FundedNext', acct:'200K', stage:'Funded', target:0, current:4.52, dd:0.8, maxDd:6, dailyDd:3, days:0, trades:18, wr:77, funded:true },
  ]

  const LICENSES = [
    { name:'Oracle MT5 · Full', key:'ORCL-8492-ALG', exp:'24 Dic 2026', status:'live', glow:true },
    { name:'Indicador Keywick Pro', key:'KWCK-1177-ELT', exp:'24 Dic 2026', status:'live' },
    { name:'Bias Channel · Telegram', key:'TG-@keyrules-vip', exp:'Lifetime', status:'live' },
    { name:'Discord Elite', key:'DSC-elite-2026', exp:'Lifetime', status:'live' },
    { name:'Libro KEYWICK · Digital', key:'BK-e-0042', exp:'Lifetime', status:'live' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#050505', color:'#f5f5f5' }}>

      {/* HEADER */}
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 24px', background:'rgba(10,10,10,.95)', borderBottom:'1px solid #171717', borderLeft:'3px solid #10b981' }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <a href="/" style={{ font:'900 8px/1 var(--font-sans)', letterSpacing:'.3em', color:'#525252', textTransform:'uppercase', padding:'6px 12px', border:'1px solid #262626', textDecoration:'none' }}>← SALIR</a>
          <div>
            <div style={{ font:'900 italic 7px/1 var(--font-sans)', letterSpacing:'.4em', color:'#10b981', textTransform:'uppercase', marginBottom:4 }}>⬢ Elite Program · Terminal v4.0</div>
            <h1 style={{ font:'900 italic 20px/1 var(--font-sans)', color:'#fff', margin:0, textTransform:'uppercase' }}>
              Cockpit de <span style={{ color:'#10b981', textShadow:'0 0 12px rgba(16,185,129,.5)' }}>{userName}</span>
            </h1>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ font:'700 7px/1 var(--font-mono)', letterSpacing:'.3em', color:'#525252', textTransform:'uppercase', marginBottom:3 }}>Sesión activa</div>
            <div style={{ font:'900 italic 12px/1 var(--font-sans)', color:session.color, letterSpacing:'.15em', textTransform:'uppercase' }}>{session.name}</div>
          </div>
          <div style={{ width:1, height:30, background:'#262626' }}/>
          <div style={{ textAlign:'right' }}>
            <div style={{ font:'700 7px/1 var(--font-mono)', letterSpacing:'.3em', color:'#525252', textTransform:'uppercase', marginBottom:3 }}>UTC</div>
            <div style={{ font:'700 14px/1 var(--font-mono)', color:'#d4d4d4' }}>{f2(time.getUTCHours())}:{f2(time.getUTCMinutes())}:{f2(time.getUTCSeconds())}</div>
          </div>
          <div style={{ width:1, height:30, background:'#262626' }}/>
          <Pill status="live">Oracle Conectado</Pill>
          <div style={{ width:36, height:36, background:'#10b981', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', font:'900 italic 13px/1 var(--font-sans)', boxShadow:'0 0 14px rgba(16,185,129,.4)' }}>{userInitials}</div>
        </div>
      </header>

      {/* TICKER */}
      <div style={{ overflow:'hidden', borderBottom:'1px solid #171717', background:'rgba(10,10,10,.7)', position:'relative', height:36 }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, zIndex:2, padding:'0 14px', background:'#10b981', color:'#000', font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase', display:'flex', alignItems:'center' }}>◉ LIVE · FEED</div>
        <div style={{ display:'flex', paddingLeft:128, alignItems:'center', height:'100%', animation:'marquee 28s linear infinite', whiteSpace:'nowrap' }}>
          {[...ticks,...ticks].map((tk,i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'0 20px', borderRight:'1px solid #1a1a1a' }}>
              <span style={{ font:'900 italic 9px/1 var(--font-sans)', color:'#f5f5f5', letterSpacing:'.06em' }}>{tk.symbol}</span>
              <span style={{ font:'700 10px/1 var(--font-mono)', color:'#f5f5f5' }}>{tk.price.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:tk.price<10?5:2})}</span>
              <span style={{ font:'700 8px/1 var(--font-mono)', color:tk.delta>=0?'#10b981':'#ef4444' }}>{tk.delta>=0?'+':''}{tk.delta.toFixed(2)}%</span>
              <span style={{ font:'700 7px/1 var(--font-sans)', color:BC[tk.bias]??'#737373', letterSpacing:'.15em' }}>{tk.bias}</span>
            </span>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:18, padding:'18px 20px', maxWidth:1600, margin:'0 auto' }}>

        {/* LEFT */}
        <div>
          {/* EQUITY */}
          <Panel eyebrow="Master Account · $100K" title="Equity Curve · Live" glow
            action={<Pill status="live">Streaming · Oracle MT5</Pill>}>
            <div style={{ display:'flex', gap:20, marginBottom:14, flexWrap:'wrap' }}>
              <Stat label="Balance actual" value={Math.round(bal).toLocaleString('en-US')} prefix="$" color="#10b981" big/>
              <Stat label="P&L Total" value={`${pnlPctEq>=0?'+':''}${pnlPctEq.toFixed(2)}`} suffix="%" color={pnlPctEq>=0?'#fff':'#ef4444'}/>
              <Stat label="Max Drawdown" value={Math.abs(dd).toFixed(2)} suffix="%" color="#f59e0b"/>
              <Stat label="Profit Factor" value="2.84" color="#34d399"/>
              <Stat label="Win Rate" value={String(stats.winRate||68)} suffix="%"/>
              <Stat label="Trades" value={String(stats.total||247)}/>
            </div>
            <div style={{ position:'relative', height:160, background:'rgba(0,0,0,.4)', border:'1px solid #171717', padding:10 }}>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width:'100%', height:'100%', display:'block' }}>
                <defs>
                  <linearGradient id="eq-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {[0.25,0.5,0.75].map(p=><line key={p} x1="0" y1={H*p} x2={W} y2={H*p} stroke="#1a1a1a" strokeWidth="0.4" vectorEffect="non-scaling-stroke"/>)}
                <path d={fillPath} fill="url(#eq-fill)"/>
                <path d={linePath} stroke="#10b981" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" style={{ filter:'drop-shadow(0 0 3px rgba(16,185,129,.5))' }}/>
                <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="1.5" fill="#34d399"/>
              </svg>
              <div style={{ position:'absolute', top:4, left:8, font:'700 7px/1 var(--font-mono)', color:'#404040' }}>${Math.round(maxEq).toLocaleString()}</div>
              <div style={{ position:'absolute', bottom:4, left:8, font:'700 7px/1 var(--font-mono)', color:'#404040' }}>${Math.round(minEq).toLocaleString()}</div>
              <div style={{ position:'absolute', bottom:4, right:8, font:'700 7px/1 var(--font-mono)', color:'#10b981' }}>{new Date().toLocaleDateString('es-AR')}</div>
            </div>
          </Panel>

          {/* BIAS */}
          <Panel eyebrow={`Daily Bias · ${new Date().toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'numeric'})}`} title={todayBias?`Proyección Institucional · ${todayBias.pair}`:'Sin Bias Publicado'} glow={!!todayBias}
            action={<a href="/portal/bias" style={{ font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.25em', color:'#10b981', textTransform:'uppercase', textDecoration:'none' }}>Historial →</a>}>
            {todayBias ? (
              <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:16 }}>
                <div style={{ aspectRatio:'16/10', background:'#000', border:'1px solid #171717', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(16,185,129,.08),transparent 60%)' }}/>
                  {todayBias.video_url ? (
                    <iframe src={todayBias.video_url.replace('watch?v=','embed/')} style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }} allowFullScreen/>
                  ) : (
                    <>
                      <div style={{ width:52, height:52, borderRadius:'50%', border:'2px solid #10b981', background:'rgba(16,185,129,.15)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(16,185,129,.4)', zIndex:2 }}>
                        <div style={{ width:0, height:0, borderTop:'9px solid transparent', borderBottom:'9px solid transparent', borderLeft:'14px solid #10b981', marginLeft:4 }}/>
                      </div>
                      <div style={{ position:'absolute', bottom:8, left:10, font:'900 italic 7px/1 var(--font-sans)', letterSpacing:'.3em', color:'#10b981', textTransform:'uppercase' }}>◉ Daily Bias</div>
                    </>
                  )}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div>
                    <div style={{ font:'700 7px/1 var(--font-mono)', letterSpacing:'.3em', color:'#525252', textTransform:'uppercase', marginBottom:4 }}>Dirección</div>
                    <div style={{ font:'900 italic 32px/1 var(--font-sans)', color:BC[todayBias.direction]??'#fff', textShadow:'0 0 16px currentColor', textTransform:'uppercase' }}>
                      {todayBias.direction==='alcista'?'LONG':todayBias.direction==='bajista'?'SHORT':todayBias.direction.toUpperCase()}
                    </div>
                  </div>
                  {todayBias.session && (
                    <div style={{ padding:'8px 10px', background:'rgba(16,185,129,.04)', borderLeft:'3px solid #10b981' }}>
                      <div style={{ font:'700 7px/1 var(--font-mono)', color:'#737373', letterSpacing:'.3em', textTransform:'uppercase', marginBottom:3 }}>Kill Zone</div>
                      <div style={{ font:'700 11px/1 var(--font-mono)', color:'#d4d4d4' }}>{todayBias.session}</div>
                    </div>
                  )}
                  {todayBias.analysis_md && (
                    <div style={{ padding:'8px 10px', background:'rgba(16,185,129,.04)', borderTop:'1px solid rgba(16,185,129,.15)' }}>
                      <p style={{ margin:0, font:'400 italic 11px/1.5 var(--font-sans)', color:'rgba(209,250,229,.8)' }}>
                        {todayBias.analysis_md.slice(0,200)}{todayBias.analysis_md.length>200?'...':''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding:'24px 0', textAlign:'center', color:'#404040', font:'400 12px/1 var(--font-sans)' }}>El bias de hoy aún no fue publicado</div>
            )}
          </Panel>

          {/* JOURNAL + CHECKLIST */}
          <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:16 }}>
            <Panel eyebrow="Trade Journal · Auto-sync" title="Operaciones Recientes"
              action={trades.filter(t=>(t.result_pct??0)>0).length>0?<Pill status="live">{trades.filter(t=>(t.result_pct??0)>0).length}/{trades.length} W</Pill>:undefined}>
              {trades.length>0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:4, maxHeight:280, overflowY:'auto' }}>
                  {trades.map((t,i) => {
                    const win=(t.result_pct??0)>0, be=t.result_pct===0||t.result_pct===null
                    const col=be?'#a3a3a3':win?'#10b981':'#ef4444'
                    return (
                      <div key={i} style={{ display:'grid', gridTemplateColumns:'64px 64px 1fr 60px', gap:8, alignItems:'center', padding:'8px 10px', background:'rgba(5,5,5,.3)', border:'1px solid #171717' }}>
                        <span style={{ font:'900 italic 10px/1 var(--font-sans)', color:'#fff' }}>{t.pair??'—'}</span>
                        <span style={{ font:'900 italic 7px/1 var(--font-sans)', letterSpacing:'.2em', padding:'2px 5px', color:t.direction==='LONG'?'#10b981':'#ef4444', background:t.direction==='LONG'?'rgba(16,185,129,.1)':'rgba(239,68,68,.1)', border:`1px solid ${t.direction==='LONG'?'rgba(16,185,129,.3)':'rgba(239,68,68,.3)'}`, textAlign:'center' }}>{t.direction??'—'}</span>
                        <span style={{ font:'400 italic 10px/1.3 var(--font-sans)', color:'#a3a3a3', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.notes??'—'}</span>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ font:'900 italic 11px/1 var(--font-sans)', color:col }}>{t.result_pct!=null?`${t.result_pct>=0?'+':''}${t.result_pct.toFixed(2)}%`:'BE'}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ padding:'20px 0', textAlign:'center', color:'#404040', font:'400 11px/1 var(--font-sans)' }}>Sin operaciones. <a href="/portal/journal" style={{ color:'#10b981', textDecoration:'none' }}>Registrar →</a></div>
              )}
            </Panel>

            <Panel eyebrow="Pre-entrada · A+ Setup" title="Checklist"
              action={<Pill status={clReady?'live':'warn'}>{doneCount}/{checklist.length}</Pill>}>
              <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                {checklist.map((it,i) => (
                  <label key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 6px', cursor:'pointer' }}>
                    <span onClick={()=>setChecklist(prev=>prev.map((x,j)=>j===i?{...x,done:!x.done}:x))} style={{ width:13, height:13, flexShrink:0, border:`1px solid ${it.done?'#10b981':'#262626'}`, background:it.done?'#10b981':'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#000', fontWeight:900, cursor:'pointer' }}>{it.done?'✓':''}</span>
                    <span style={{ font:'700 10px/1.2 var(--font-sans)', color:it.done?'#d4d4d4':'#737373', textDecoration:it.done?'line-through':'none' }}>{it.label}</span>
                  </label>
                ))}
              </div>
              <div style={{ marginTop:10, padding:'8px 10px', textAlign:'center', background:clReady?'rgba(16,185,129,.1)':'rgba(245,158,11,.08)', border:`1px solid ${clReady?'rgba(16,185,129,.4)':'rgba(245,158,11,.3)'}`, font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.25em', color:clReady?'#10b981':'#f59e0b', textTransform:'uppercase' }}>
                {clReady?'⬢ Ejecutar Entrada':'⌛ Esperar Confluencia'}
              </div>
            </Panel>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* CHALLENGES */}
          <Panel eyebrow="Prop Firms · Funder Sync" title="Challenges Activos"
            action={<span style={{ font:'700 8px/1 var(--font-mono)', color:'#737373', letterSpacing:'.2em' }}>3 activos</span>}>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {CHALLENGES.map((c) => {
                const pct=c.target>0?Math.min(100,(c.current/c.target)*100):100
                const ddPct=(c.dd/c.maxDd)*100
                const ddc=ddPct>70?'#ef4444':ddPct>40?'#f59e0b':'#525252'
                return (
                  <div key={c.firm} style={{ padding:12, background:'rgba(5,5,5,.5)', border:'1px solid #171717' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                          <span style={{ font:'900 italic 11px/1 var(--font-sans)', color:'#fff' }}>{c.firm}</span>
                          <span style={{ font:'700 7px/1 var(--font-mono)', color:'#737373', letterSpacing:'.15em' }}>{c.acct} · {c.stage}</span>
                        </div>
                        <Pill status="live">{c.funded?'FUNDED':'EN CURSO'}</Pill>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ font:'900 italic 14px/1 var(--font-sans)', color:c.funded?'#10b981':'#fff' }}>{c.funded?`+${c.current.toFixed(2)}%`:`${c.days}d`}</div>
                        <div style={{ font:'700 7px/1 var(--font-mono)', color:'#737373', letterSpacing:'.15em', textTransform:'uppercase', marginTop:3 }}>{c.funded?'payout':'restantes'}</div>
                      </div>
                    </div>
                    {!c.funded && (
                      <div style={{ marginBottom:6 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', font:'700 7px/1 var(--font-mono)', color:'#737373', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:3 }}>
                          <span>Target {c.target}%</span>
                          <span style={{ color:'#10b981' }}>{c.current.toFixed(2)}% · {pct.toFixed(0)}%</span>
                        </div>
                        <Bar pct={pct}/>
                      </div>
                    )}
                    <div>
                      <div style={{ display:'flex', justifyContent:'space-between', font:'700 7px/1 var(--font-mono)', color:'#737373', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:3 }}>
                        <span>DD {c.dd.toFixed(2)}% / {c.maxDd}%</span>
                        <span style={{ color:ddc }}>Daily {c.dailyDd}%</span>
                      </div>
                      <Bar pct={ddPct} color={ddc}/>
                    </div>
                    <div style={{ font:'700 8px/1 var(--font-mono)', color:'#525252', marginTop:6 }}>{c.trades}t · {c.wr}% WR</div>
                  </div>
                )
              })}
            </div>
          </Panel>

          {/* LICENSES */}
          <Panel eyebrow="Accesos · Activos" title="Licencias & Membresías">
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {LICENSES.map((l,i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'12px 1fr auto', gap:10, alignItems:'center', padding:'9px 10px', background:l.glow?'rgba(16,185,129,.04)':'rgba(5,5,5,.4)', border:`1px solid ${l.glow?'rgba(16,185,129,.25)':'#171717'}` }}>
                  <span style={{ width:7, height:7, background:'#10b981', boxShadow:'0 0 6px #10b981', borderRadius:'50%', display:'inline-block' }}/>
                  <div>
                    <div style={{ font:'700 11px/1.2 var(--font-sans)', color:'#fff' }}>{l.name}</div>
                    <div style={{ font:'400 8px/1 var(--font-mono)', color:'#525252', letterSpacing:'.15em', marginTop:2 }}>{l.key}</div>
                  </div>
                  <Pill status={l.status}>Activa</Pill>
                </div>
              ))}
            </div>
          </Panel>

          {/* ACADEMY */}
          <Panel eyebrow="Academia · KeyRules" title="Progreso Curricular"
            action={<a href="/portal/academia" style={{ font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.25em', color:'#10b981', textTransform:'uppercase', textDecoration:'none' }}>Ver clases →</a>}>
            <div style={{ marginBottom:12, padding:10, background:'rgba(16,185,129,.04)', border:'1px solid rgba(16,185,129,.15)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ font:'900 italic 9px/1 var(--font-sans)', color:'#fff', textTransform:'uppercase', letterSpacing:'.2em' }}>Avance General</span>
                <span style={{ font:'900 italic 13px/1 var(--font-sans)', color:'#10b981' }}>{academyPct}%</span>
              </div>
              <Bar pct={academyPct}/>
              <div style={{ font:'700 8px/1 var(--font-mono)', color:'#737373', letterSpacing:'.2em', marginTop:6, textTransform:'uppercase' }}>
                {completedClasses} / {totalClasses} clases completadas
              </div>
            </div>
          </Panel>

          {/* RISK CALC */}
          <Panel eyebrow="Quantz · Position Sizing" title="Calculadora de Riesgo">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              {([
                { label:'Balance', field:'balance' as const, suffix:'USD', step:1000 },
                { label:'Riesgo %', field:'riskPct' as const, suffix:'%', step:0.1 },
                { label:'Stop Loss', field:'stop' as const, suffix:'pips', step:1 },
                { label:'R:R Target', field:'rr' as const, suffix:':1', step:0.5 },
              ] as const).map(({ label, field, suffix, step }) => (
                <div key={field}>
                  <div style={{ font:'700 7px/1 var(--font-mono)', color:'#737373', letterSpacing:'.3em', textTransform:'uppercase', marginBottom:5 }}>{label}</div>
                  <div style={{ display:'flex', alignItems:'center', border:'1px solid #171717', background:'#050505' }}>
                    <input type="number" value={risk[field]} step={step} onChange={e=>setRisk(prev=>({...prev,[field]:parseFloat(e.target.value)||0}))}
                      style={{ flex:1, padding:'8px 10px', background:'transparent', border:'none', outline:'none', font:'900 italic 13px/1 var(--font-sans)', color:'#fff', width:'100%' }}/>
                    <span style={{ padding:'0 10px', font:'700 8px/1 var(--font-mono)', color:'#525252', letterSpacing:'.15em' }}>{suffix}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:12, background:'rgba(16,185,129,.06)', border:'1px solid rgba(16,185,129,.3)', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              <Stat label="Riesgo $" value={riskUsd.toFixed(0)} prefix="$" color="#ef4444"/>
              <Stat label="Tamaño" value={lots} suffix=" lots" color="#fff"/>
              <Stat label="Target" value={targetUsd} prefix="$" color="#10b981"/>
            </div>
          </Panel>

          {/* SIGNALS / DISCORD */}
          <Panel eyebrow="Señales · Live" title="Feed de Señales"
            action={<a href="/portal/signals" style={{ font:'900 italic 8px/1 var(--font-sans)', letterSpacing:'.25em', color:'#10b981', textTransform:'uppercase', textDecoration:'none' }}>Ver todas →</a>}>
            {signals.length>0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {signals.map(s => {
                  const rr = Math.abs((s.tp-s.entry)/(s.entry-s.sl)).toFixed(1)
                  const col = s.direction==='LONG'?'#10b981':'#ef4444'
                  return (
                    <div key={s.id} style={{ padding:'8px 10px', borderLeft:`2px solid ${col}40`, background:'rgba(5,5,5,.4)' }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                        <span style={{ font:'900 italic 10px/1 var(--font-sans)', color:'#fff' }}>{s.pair}</span>
                        <span style={{ font:'900 italic 7px/1 var(--font-sans)', color:col, letterSpacing:'.2em', padding:'2px 5px', background:`${col}15`, border:`1px solid ${col}30` }}>{s.direction}</span>
                        <span style={{ font:'700 8px/1 var(--font-mono)', color:'#737373', marginLeft:'auto' }}>{rr}R</span>
                      </div>
                      <div style={{ font:'400 10px/1.4 var(--font-sans)', color:'#d4d4d4' }}>
                        Entry {s.entry} · SL {s.sl} · TP {s.tp}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ padding:'16px 0', textAlign:'center', color:'#404040', font:'400 11px/1 var(--font-sans)' }}>Sin señales activas por el momento</div>
            )}
            {nextMeet && (
              <div style={{ marginTop:12, padding:'10px 12px', background:'rgba(16,185,129,.05)', border:'1px solid rgba(16,185,129,.15)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ font:'700 7px/1 var(--font-mono)', color:'#525252', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:4 }}>Próximo Meet</div>
                  <div style={{ font:'900 italic 11px/1 var(--font-sans)', color:'#f5f5f5' }}>{nextMeet.title??'Meet en vivo'}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  {countdown && <div style={{ font:'700 14px/1 var(--font-mono)', color:'#10b981' }}>{countdown}</div>}
                  {nextMeet.url && <a href={nextMeet.url} target="_blank" rel="noopener noreferrer" style={{ font:'900 italic 7px/1 var(--font-sans)', color:'#10b981', letterSpacing:'.25em', textTransform:'uppercase', textDecoration:'none' }}>→ Unirse</a>}
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>

      <style>{`
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      `}</style>
    </div>
  )
}
