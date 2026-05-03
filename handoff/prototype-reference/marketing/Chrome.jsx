const { useState, useEffect, useMemo, useRef } = React;

// ---------- LIVE QUANTZ CHART (signature brand motif) ----------
const CANDLE_W = 22;
const MAX_CANDLES = 80;
const TICK_MS = 1000;

// More realistic price-action simulator: persistent trend regime, volatility clustering,
// news spikes, wick/body proportions that mimic real instruments
let trendRegime = (Math.random() - 0.5) * 0.6; // drift
let volRegime = 0.08;
let regimeTicks = 0;

const genCandle = (prev) => {
  regimeTicks++;
  // regime shift every ~20-40 candles
  if (regimeTicks > 20 + Math.random() * 20) {
    regimeTicks = 0;
    trendRegime = (Math.random() - 0.5) * 0.7;
    volRegime = 0.05 + Math.random() * 0.12;
  }
  // occasional news spike
  const news = Math.random() > 0.96;
  const vol = news ? 0.35 : volRegime + (Math.random() - 0.5) * 0.04;
  const drift = trendRegime * 0.006;
  // mean reversion pull if price strays too far from slowEma
  const mr = prev ? (prev.slowEma - prev.close) * 0.03 : 0;
  const noise = (Math.random() - 0.5) * vol;
  const lastClose = prev ? prev.close : 100;
  const change = lastClose * (drift + mr + noise);
  const open = lastClose;
  const close = Math.max(lastClose * 0.85, open + change);
  // asymmetric wicks — long side has more exploration
  const bull = close >= open;
  const body = Math.abs(close - open);
  const wickMul = news ? 2.5 : 0.6 + Math.random() * 1.4;
  const upperWick = body * wickMul * (bull ? 0.4 : 1);
  const lowerWick = body * wickMul * (bull ? 1 : 0.4);
  const high = Math.max(open, close) + upperWick + Math.random() * lastClose * 0.004;
  const low = Math.min(open, close) - lowerWick - Math.random() * lastClose * 0.004;
  const fastEma = prev ? close * 0.22 + prev.fastEma * 0.78 : close;
  const slowEma = prev ? close * 0.06 + prev.slowEma * 0.94 : close;
  return { open, close, high, low, fastEma, slowEma, news, id: Math.random().toString(36).slice(2) };
};

function LiveChart() {
  const canvasRef = React.useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = window.devicePixelRatio || 1;
    const resize = () => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Beam settings — head advances, leaves glowing trail, wipes at edge
    let x = 0;
    const SPEED = 0.65;
    const TRAIL = 280;
    const pts = new Array(2000).fill(null).map(() => ({ x: -1, y: 0 }));
    let head = 0;

    // Realistic TradingView-style line: dense random walk with drift,
    // mean-reversion to a slow-moving baseline, volatility clusters, occasional
    // shock candles. Sampled per-pixel so every x has a value.
    const samples = []; // { x, y }
    let price = H * 0.5;         // current price (inverted: low y = high price)
    let baseline = H * 0.5;      // slow target (macro trend)
    let trendDir = -1;
    let trendStepsLeft = 0;
    let vol = 7;
    let volTarget = 7;
    // HUGE vertical range — peaks reach near top (title area), valleys near bottom (below CTA)
    const priceMin = H * 0.02;   // top
    const priceMax = H * 0.98;   // bottom

    const pickNewTrend = () => {
      const r = Math.random();
      if (r < 0.4) { trendDir = -1; trendStepsLeft = 120 + Math.random()*180; } // bull
      else if (r < 0.75) { trendDir = 1; trendStepsLeft = 100 + Math.random()*160; } // bear
      else { trendDir = 0; trendStepsLeft = 60 + Math.random()*100; } // sideways
    };
    pickNewTrend();

    const stepPrice = () => {
      if (trendStepsLeft-- <= 0) pickNewTrend();
      const drift = trendDir * (1.1 + Math.random()*0.9);
      baseline += drift;
      baseline = Math.max(priceMin+20, Math.min(priceMax-20, baseline));
      if (Math.random() < 0.02) volTarget = 4 + Math.random()*9;
      vol += (volTarget - vol) * 0.04;
      // much weaker mean reversion → huge swings
      const revert = (baseline - price) * 0.004;
      const shock = (Math.random()+Math.random()+Math.random()-1.5) * vol * 5;
      // frequent + very large news jumps
      const newsJump = Math.random() < 0.025 ? (Math.random()-0.5) * 120 : 0;
      price += revert + shock + newsJump;
      price = Math.max(priceMin, Math.min(priceMax, price));
      return price;
    };

    // Prefill some samples so first pixels aren't flat
    for (let i=0; i<=20; i++) samples.push({ x: i, y: stepPrice() });

    const valueAt = (xPos) => {
      while (samples.length <= xPos + 2) samples.push({ x: samples.length, y: stepPrice() });
      return samples[Math.floor(xPos)].y;
    };

    const frame = () => {
      // fade trail
      ctx.fillStyle = 'rgba(5,5,5,0.16)';
      ctx.fillRect(0,0,W,H);

      // advance head
      for (let s=0; s<SPEED; s++) {
        x += 1;
        if (x > W + 20) {
          // wipe and regenerate samples
          ctx.fillStyle = '#050505';
          ctx.fillRect(0,0,W,H);
          x = 0;
          samples.length = 0;
          price = H * 0.5; baseline = H * 0.5; pickNewTrend();
          for (let i=0; i<=20; i++) samples.push({ x: i, y: stepPrice() });
          for (let i=0; i<pts.length; i++) pts[i].x = -1;
          head = 0;
        }
        const y = valueAt(x);
        pts[head] = { x, y };
        head = (head+1) % pts.length;
      }

      // draw trail — two layers (glow + sharp)
      for (let layer=0; layer<2; layer++) {
        ctx.strokeStyle = layer===0 ? 'rgba(16,185,129,0.4)' : '#34d399';
        ctx.lineWidth = layer===0 ? 5 : 1.6;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = layer===0 ? 18 : 6;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        let started = false;
        for (let i=0; i<pts.length; i++) {
          const idx = (head - 1 - i + pts.length) % pts.length;
          const p = pts[idx];
          if (!p || p.x < 0) break;
          const distFromHead = x - p.x;
          if (distFromHead > TRAIL) break;
          if (p.x > x) continue;
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // head dot
      const hp = pts[(head-1+pts.length)%pts.length];
      if (hp && hp.x >= 0) {
        ctx.fillStyle = '#d1fae5';
        ctx.shadowColor = '#10b981'; ctx.shadowBlur = 22;
        ctx.beginPath(); ctx.arc(hp.x, hp.y, 3.4, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(frame);
    };
    let raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', background: '#050505' }}>
      {/* deep ambient halo */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 55%, rgba(16,185,129,.18) 0%, rgba(16,185,129,.04) 28%, transparent 62%)' }} />
      {/* ECG grid */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:
          'linear-gradient(rgba(16,185,129,.08) 1px, transparent 1px),'+
          'linear-gradient(90deg, rgba(16,185,129,.08) 1px, transparent 1px),'+
          'linear-gradient(rgba(16,185,129,.18) 1px, transparent 1px),'+
          'linear-gradient(90deg, rgba(16,185,129,.18) 1px, transparent 1px)',
        backgroundSize:'20px 20px, 20px 20px, 100px 100px, 100px 100px',
        maskImage:'radial-gradient(ellipse at 50% 55%, black 20%, transparent 80%)',
        WebkitMaskImage:'radial-gradient(ellipse at 50% 55%, black 20%, transparent 80%)',
        opacity:.7,
      }}/>
      {/* scan lines */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(16,185,129,.025) 4px)',
      }}/>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block' }}/>
      {/* Next Meet banner — replaces the GBP/USD chip. Clickable. */}
      <NextMeetBanner />
      <style>{`@keyframes ecgBlink { 0%,100%{opacity:1} 50%{opacity:.25} }`}</style>
      {/* vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050505, transparent 50%, #050505)', opacity: .9 }} />
    </div>
  );
}

// ---------- NEXT MEET BANNER ----------
// Edit MEET_CONFIG below to change date/link — single source of truth.
const MEET_CONFIG = {
  // ISO format: YYYY-MM-DDTHH:MM (local time). Edit this for each session.
  // Ex: '2025-04-21T22:00' = 21 de abril, 22hs
  dateISO: '2025-04-21T22:00',
  // Displayed label (short & punchy)
  label: 'Meet Live Trading',
  // Destination: telegram channel, youtube live, zoom link, etc
  url: 'https://t.me/keyrules_alg',
};

function NextMeetBanner() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const meetDate = new Date(MEET_CONFIG.dateISO);
  const diff = meetDate.getTime() - now;
  const isLive = diff <= 0 && diff > -2 * 60 * 60 * 1000; // live for 2h window
  const isPast = diff <= -2 * 60 * 60 * 1000;

  // Format date display: "21/04 · 22:00"
  const dd = String(meetDate.getDate()).padStart(2, '0');
  const mm = String(meetDate.getMonth() + 1).padStart(2, '0');
  const hh = String(meetDate.getHours()).padStart(2, '0');
  const mn = String(meetDate.getMinutes()).padStart(2, '0');
  const dateLabel = `${dd}/${mm} · ${hh}:${mn}HS`;

  // Countdown
  let countdown = '';
  if (!isPast && !isLive) {
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hrs = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    countdown = days > 0
      ? `${days}D ${hrs}H ${mins}M`
      : `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }

  const dotColor = isLive ? '#ef4444' : (isPast ? '#737373' : '#10b981');
  const borderColor = isLive ? 'rgba(239,68,68,.5)' : 'rgba(16,185,129,.3)';
  const accentColor = isLive ? '#ef4444' : '#10b981';

  return (
    <a href={MEET_CONFIG.url} target="_blank" rel="noopener noreferrer" style={{
      position:'absolute', top:24, left:'50%', transform:'translateX(-50%)',
      display:'flex', gap:14, alignItems:'center',
      padding:'10px 20px', border:`1px solid ${borderColor}`,
      background:'rgba(5,5,5,.82)', backdropFilter:'blur(6px)',
      textDecoration:'none', cursor:'pointer',
      boxShadow: isLive ? '0 0 24px rgba(239,68,68,.35)' : '0 0 18px rgba(16,185,129,.15)',
      transition:'all 280ms',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-50%) translateY(-1px)'; e.currentTarget.style.boxShadow = isLive ? '0 0 34px rgba(239,68,68,.55)' : '0 0 28px rgba(16,185,129,.3)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(-50%)'; e.currentTarget.style.boxShadow = isLive ? '0 0 24px rgba(239,68,68,.35)' : '0 0 18px rgba(16,185,129,.15)'; }}
    >
      <span style={{ width:8, height:8, borderRadius:'50%', background:dotColor, boxShadow:`0 0 10px ${dotColor}`, animation:'ecgBlink 1.1s infinite' }}/>
      <span style={{ font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.35em', color:accentColor, textTransform:'uppercase' }}>
        {isLive ? '● EN VIVO AHORA' : (isPast ? 'Próximo meet' : 'Próx. Meet')}
      </span>
      {!isLive && !isPast && (
        <>
          <span style={{ color: '#404040' }}>·</span>
          <span style={{ font:'700 11px/1 var(--font-mono)', color:'#d4d4d4', letterSpacing:'.15em' }}>{dateLabel}</span>
          <span style={{ color: '#404040' }}>·</span>
          <span style={{ font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.25em', color:'#fbbf24', textTransform:'uppercase' }}>{countdown}</span>
        </>
      )}
      {isLive && (
        <span style={{ font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.25em', color:'#f5f5f5', textTransform:'uppercase' }}>Entrar →</span>
      )}
      {isPast && (
        <>
          <span style={{ color: '#404040' }}>·</span>
          <span style={{ font:'700 10px/1 var(--font-mono)', color:'#737373', letterSpacing:'.15em' }}>Próximamente</span>
        </>
      )}
    </a>
  );
}

// ---------- NAVBAR ----------
function Navbar({ onNav, current }) {
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      document.documentElement.style.setProperty('--scroll-rot', (y * 0.8) + 'deg');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const link = (k, label) => (
    <a onClick={() => onNav(k)} style={{
      font: '900 10px/1 var(--font-sans)', letterSpacing: '.2em', textTransform: 'uppercase',
      color: current === k ? '#10b981' : '#737373', cursor: 'pointer', textDecoration: 'none',
      transition: 'color 150ms'
    }}>{label}</a>
  );
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 32px', maxWidth: 1280, margin: '0 auto',
      borderBottom: '1px solid #171717', position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(5,5,5,.95)', backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }} onClick={() => onNav('home')}>
          <div style={{
          width: 54, height: 54, borderRadius: 9999, padding: 2,
          border: '1px solid rgba(16,185,129,.2)', boxShadow: '0 0 25px rgba(16,185,129,.35)',
          cursor: 'pointer', perspective: 800,
          transformStyle: 'preserve-3d',
          transform: 'rotateY(var(--scroll-rot, 0deg))',
          transition: 'transform 120ms linear',
        }}>
          <div style={{
            width: '100%', height:'100%', position:'relative',
          }}>
            <img src="../../assets/logo-sello.jpg" style={{
              width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9999,
              display: 'block', backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
            }} />
            <img src="../../assets/logo-sello.jpg" style={{
              position:'absolute', inset:0,
              width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9999,
              transform:'rotateY(180deg)', filter:'brightness(.75) contrast(1.1)',
              backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: .95, cursor: 'pointer' }}>
          <span style={{
            font: '900 italic 22px/1 var(--font-sans)', letterSpacing: '.1em', color: '#fff', textTransform: 'uppercase',
            textShadow: '0 0 12px rgba(103,232,249,.45), 0 0 24px rgba(103,232,249,.25)',
          }}>Keyrules</span>
          <span style={{
            font: '900 italic 22px/1 var(--font-sans)', letterSpacing: '.1em', color: '#10b981', textTransform: 'uppercase',
            textShadow: '0 0 14px rgba(103,232,249,.4), 0 0 28px rgba(16,185,129,.35)',
          }}>Alg Capitals</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {link('adn', 'ADN')}
        {link('cert', 'Testimonios')}
        {link('planes', 'Acceder')}
        <span style={{ color: '#262626' }}>|</span>
        <a style={{ font: '900 10px/1 var(--font-sans)', letterSpacing: '.2em', color: 'rgba(16,185,129,.5)', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer' }}>Telegram</a>
        <a onClick={() => onNav('dashboard')} style={{
          marginLeft: 8, padding: '10px 20px', background: 'rgba(16,185,129,.1)',
          border: '1px solid rgba(16,185,129,.5)', color: '#10b981',
          font: '900 10px/1 var(--font-sans)', letterSpacing: '.1em', textTransform: 'uppercase',
          textDecoration: 'none', cursor: 'pointer'
        }}>Portal Alumnos</a>
      </div>
    </nav>
  );
}

Object.assign(window, { LiveChart, Navbar, ChatBotFab });

// ---------- CHATBOT FAB (candlestick) ----------
// Backend del bot de trading de Lucas
const QUANTZ_BACKEND = 'https://outsell-crimson-cheese.ngrok-free.dev';

function ChatBotFab() {
  const [open, setOpen] = useState(false);
  const [greet, setGreet] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola, soy el asistente Quantz. Preguntame por planes, bias o cómo entrar al Portal Alumnos.' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const scrollRef = useRef(null);

  // Crear sesión la primera vez que abre el chat
  useEffect(() => {
    if (!open || sessionId) return;
    fetch(`${QUANTZ_BACKEND}/api/session/new`, {
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
      .then(r => r.json())
      .then(data => setSessionId(data.session_id || data.sessionId))
      .catch(() => {});
  }, [open, sessionId]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setSending(true);
    try {
      const res = await fetch(`${QUANTZ_BACKEND}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ session_id: sessionId, message: text }),
      });
      const data = await res.json();
      const reply = data.response || data.reply || data.message || 'Sin respuesta.';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'No pude conectar con el asistente. Verificá que el backend esté activo.' }]);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending, open]);

  // 0 = idle (bullish green, full body)
  // rises with scroll, flips bearish (red) once we've scrolled far
  const [scrollP, setScrollP] = useState(0); // 0..1 normalized
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const max = Math.max(1, (document.documentElement.scrollHeight - window.innerHeight));
      setScrollP(Math.min(1, y / max));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // periodic greeting — show bubble + wave animation, first after 3.5s, then every ~18s
  useEffect(() => {
    if (open) return;
    const first = setTimeout(() => setGreet(true), 3500);
    const hide = setTimeout(() => setGreet(false), 3500 + 5000);
    const iv = setInterval(() => {
      setGreet(true);
      setTimeout(() => setGreet(false), 5000);
    }, 18000);
    return () => { clearTimeout(first); clearTimeout(hide); clearInterval(iv); };
  }, [open]);

  // thresholds: 0..0.55 bullish (compressing), 0.55..1 bearish
  const bearish = scrollP > 0.55;
  const t = scrollP;
  const color = bearish ? '#ef4444' : '#10b981';
  const colorDark = bearish ? '#991b1b' : '#047857';
  const colorLight = bearish ? '#fca5a5' : '#34d399';
  const glow = bearish ? 'rgba(239,68,68,.55)' : 'rgba(16,185,129,.55)';
  const pct = bearish
    ? `-${((t - 0.55) / 0.45 * 100).toFixed(1)}%`
    : `+${((1 - t / 0.55) * 100).toFixed(1)}%`;

  // Candle geometry — realistic market behavior:
  //  - Bullish (t=0): body from y=24 (open low) to y=88 (close high) → tall green
  //  - Compressing (t→0.55): body TOP rises toward close (y=56), bottom stays at open-ish → collapses into doji
  //  - Doji (t≈0.55): body is a thin line at y=56
  //  - Bearish (t=0.55→1): body TOP at y=56 (open), BOTTOM grows downward toward y=88 (close low)
  // t is scrollP.
  const dojiY = 56;
  let bodyTop, bodyBottom;
  if (!bearish) {
    // bullish: body top LOWERS as we scroll (56 - 32*k where k=1 full, 0 doji)
    const k = 1 - Math.min(1, t / 0.55); // 1 → 0
    bodyTop = dojiY - 32 * k;       // 24 → 56
    bodyBottom = dojiY + 32 * k;    // 88 → 56   (symmetric shrink toward close)
  } else {
    // bearish: body grows downward from doji
    const k = Math.min(1, (t - 0.55) / 0.45); // 0 → 1
    bodyTop = dojiY - 32 * k;       // 56 → 24  (opens at doji, grows up)
    bodyBottom = dojiY + 32 * k;    // 56 → 88  (closes down)
  }
  // At doji, draw a thin 2px line instead of zero-height rect
  const isDoji = Math.abs(bodyBottom - bodyTop) < 2;
  const bodyHeight = Math.max(2, bodyBottom - bodyTop);
  const upperWickEnd = bodyTop + 1;     // wick meets body top
  const lowerWickStart = bodyBottom - 1;

  return (
    <>
      {/* greeting bubble — connects to candle's left hand */}
      <div style={{
        position:'fixed', bottom: 62, right: 110, zIndex: 201,
        padding: '10px 14px',
        background: 'rgba(10,10,10,.96)',
        border: `1px solid ${color}`,
        boxShadow: `0 0 22px ${glow}, 0 8px 20px rgba(0,0,0,.6)`,
        maxWidth: 230,
        opacity: greet && !open ? 1 : 0,
        transform: greet && !open ? 'translateY(0) scale(1)' : 'translateY(8px) scale(.92)',
        transformOrigin: '100% 50%',
        transition: 'opacity 380ms cubic-bezier(.2,.7,.2,1), transform 380ms cubic-bezier(.2,.7,.2,1), border-color 400ms',
        pointerEvents: greet && !open ? 'auto' : 'none',
      }}>
        <div style={{
          font: '900 italic 8px/1 var(--font-sans)', letterSpacing:'.35em',
          color, textTransform:'uppercase', marginBottom: 6,
          transition: 'color 400ms',
        }}>◉ Asistente Quantz</div>
        <div style={{
          font: '500 12px/1.45 var(--font-sans)', color: '#f5f5f5',
        }}>
          ¡Hola! Soy tu asistente.<br/>
          <span style={{ color:'#a3a3a3', fontSize: 11 }}>Preguntame por planes o bias del día.</span>
        </div>
        {/* pointer/tail → towards left hand of candle */}
        <div style={{
          position:'absolute', right: -7, top: '50%', transform: 'translateY(-50%)',
          width: 0, height: 0,
          borderTop: '7px solid transparent',
          borderBottom: '7px solid transparent',
          borderLeft: `7px solid ${color}`,
          transition: 'border-left-color 400ms',
        }}/>
        <button onClick={() => setGreet(false)} aria-label="Cerrar" style={{
          position:'absolute', top: 2, right: 4, background:'none', border:'none',
          color:'#525252', cursor:'pointer', fontSize: 14, lineHeight: 1,
        }}>×</button>
      </div>

      <button
        onClick={() => { setOpen(o => !o); setGreet(false); }}
        aria-label="Chat"
        className={greet && !open ? 'candle-fab greeting' : 'candle-fab'}
        style={{
        position:'fixed', bottom: 24, right: 24, zIndex: 200,
        width: 72, height: 112,
        background:'transparent', border:'none', padding: 0,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        cursor:'pointer',
        filter: `drop-shadow(0 0 22px ${glow}) drop-shadow(0 8px 16px rgba(0,0,0,.6))`,
        transition:'filter 400ms ease',
      }}>
        {/* price chip above */}
        <div style={{
          position:'absolute', top: -4, left: '50%', transform: 'translate(-50%, -100%)',
          padding: '4px 10px',
          font: `900 italic 10px/1 var(--font-sans)`,
          letterSpacing: '.2em', textTransform: 'uppercase',
          color: isDoji ? '#fbbf24' : color,
          background: 'rgba(0,0,0,.85)',
          border: `1px solid ${isDoji ? '#fbbf24' : color}`,
          whiteSpace: 'nowrap',
          transition: 'color 400ms ease, border-color 400ms ease',
        }}>
          {isDoji ? '◇ DOJI' : (bearish ? '▼' : '▲') + ' ' + pct}
        </div>

        {/* candlestick SVG — wicks follow the body as it scales */}
        <svg width="120" height="112" viewBox="-24 0 120 112" style={{ overflow: 'visible' }}>
          {/* upper wick — rect transitions smoothly unlike <line y2>. 
              y = 6, height grows/shrinks to meet body top. */}
          <rect x="34.8" y="6" width="2.4" height={Math.max(0, upperWickEnd - 6)}
            fill={color}
            style={{ transition: 'fill 400ms ease, height 280ms cubic-bezier(.4,0,.2,1), width 280ms' }} />
          {/* lower wick */}
          <rect x="34.8" y={lowerWickStart} width="2.4" height={Math.max(0, 106 - lowerWickStart)}
            fill={color}
            style={{ transition: 'fill 400ms ease, y 280ms cubic-bezier(.4,0,.2,1), height 280ms cubic-bezier(.4,0,.2,1)' }} />

          {/* RIGHT ARM — waving from afar: shoulder pivot at body edge,
              upper arm + forearm rotate together like a real waving arm. */}
          {greet && !open && (
            <g className="candle-arm-right">
              {/* upper arm + forearm as one group that rotates from the shoulder */}
              <g style={{
                transformOrigin: '52px 46px',
                animation: 'armSwing 1.2s cubic-bezier(.4,0,.4,1) infinite',
              }}>
                {/* upper arm (shoulder → elbow) */}
                <line x1="52" y1="46" x2="70" y2="22"
                  stroke={color} strokeWidth="3" strokeLinecap="round" />
                {/* forearm + hand group — pivots at elbow for natural wave */}
                <g style={{
                  transformOrigin: '70px 22px',
                  animation: 'forearmWave 0.6s ease-in-out infinite',
                }}>
                  {/* forearm (elbow → wrist) */}
                  <line x1="70" y1="22" x2="78" y2="2"
                    stroke={color} strokeWidth="3" strokeLinecap="round" />
                  {/* open palm */}
                  <g transform="translate(78, 2)">
                    <ellipse cx="0" cy="-4" rx="5" ry="6"
                      fill={colorLight} stroke={color} strokeWidth="1.3" />
                    {/* fingers */}
                    <line x1="-3" y1="-8" x2="-4" y2="-13" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
                    <line x1="-1" y1="-9" x2="-1.5" y2="-14" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
                    <line x1="1.5" y1="-9" x2="1.5" y2="-14" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
                    <line x1="4" y1="-8" x2="4" y2="-13" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
                    {/* thumb */}
                    <line x1="-4" y1="-3" x2="-7" y2="-5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
                  </g>
                </g>
              </g>
            </g>
          )}

          {/* LEFT ARM — holds the sign. Static, extends to the bubble. */}
          {greet && !open && (
            <g>
              {/* forearm reaching out to the sign */}
              <line x1="20" y1="56" x2="-4" y2="52"
                stroke={color} strokeWidth="3" strokeLinecap="round" />
              {/* hand/fist holding the bubble */}
              <circle cx="-6" cy="52" r="5"
                fill={colorLight} stroke={color} strokeWidth="1.5" />
            </g>
          )}

          {/* body — rect with explicit y/height that tracks bodyTop/bodyBottom exactly.
              This way top AND bottom animate to meet at the doji. */}
          <rect
            x="20" y={bodyTop} width="32" height={bodyHeight} rx="2"
            fill={isDoji ? color : `url(#candle-body-grad)`}
            stroke={color} strokeWidth="1.5"
            style={{
              transition: 'stroke 400ms ease, fill 400ms ease, y 280ms cubic-bezier(.4,0,.2,1), height 280ms cubic-bezier(.4,0,.2,1)'
            }} />
          {/* inner highlight — only when body has enough height */}
          {!isDoji && bodyHeight > 10 && (
            <rect x="22" y={bodyTop + 2} width="4" height={Math.max(1, bodyHeight - 4)} rx="1"
              fill="rgba(255,255,255,.25)"
              style={{ transition: 'y 280ms cubic-bezier(.4,0,.2,1), height 280ms cubic-bezier(.4,0,.2,1)' }}/>
          )}

          <defs>
            <linearGradient id="candle-body-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={colorLight} />
              <stop offset="55%" stopColor={color} />
              <stop offset="100%" stopColor={colorDark} />
            </linearGradient>
          </defs>
        </svg>

        {/* unread dot */}
        <span style={{
          position:'absolute', top: 26, right: 10,
          width:10, height:10, borderRadius:'50%',
          background:'#fff', border:'2px solid #050505',
          boxShadow:'0 0 6px #fff',
          animation: greet && !open ? 'unreadPulse 1.2s ease-in-out infinite' : 'none',
        }}/>

        <style>{`
          .candle-fab.greeting { animation: candleWave 1.6s cubic-bezier(.4,0,.2,1) infinite; }
          @keyframes candleWave {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            15%      { transform: rotate(-3deg) translateY(-3px); }
            30%      { transform: rotate(2deg)  translateY(-1px); }
            60%      { transform: rotate(-2deg) translateY(-2px); }
          }
          /* Arm swings wide like someone waving from afar: shoulder rotates up/down in an arc */
          @keyframes armSwing {
            0%, 100% { transform: rotate(-8deg); }
            50%      { transform: rotate(12deg); }
          }
          /* Forearm wags side-to-side around the elbow — this is what makes it look like a wave */
          @keyframes forearmWave {
            0%, 100% { transform: rotate(-25deg); }
            50%      { transform: rotate(28deg); }
          }
          @keyframes unreadPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 6px #fff; }
            50%      { transform: scale(1.4); box-shadow: 0 0 14px #fff, 0 0 24px ${color}; }
          }
        `}</style>
      </button>
      {open && (
        <div style={{
          position:'fixed', bottom: 150, right: 24, width: 360, maxWidth: 'calc(100vw - 32px)', height: 480, maxHeight: 'calc(100vh - 180px)', zIndex: 200,
          background:'rgba(10,10,10,.97)', border:'1px solid rgba(16,185,129,.35)',
          boxShadow:'0 20px 60px rgba(0,0,0,.8), 0 0 40px rgba(16,185,129,.18)',
          backdropFilter:'blur(10px)',
          display:'flex', flexDirection:'column',
        }}>
          {/* header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding: '12px 14px', borderBottom: '1px solid rgba(16,185,129,.18)' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#10b981', boxShadow: '0 0 8px #10b981',
                animation: 'pulseDot 1.6s ease-in-out infinite',
              }}/>
              <span style={{ font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.3em', color:'#10b981', textTransform:'uppercase' }}>
                Asistente Quantz
              </span>
            </div>
            <button onClick={()=>setOpen(false)} aria-label="Cerrar" style={{ background:'none', border:'none', color:'#737373', cursor:'pointer', fontSize:18, lineHeight:1 }}>×</button>
          </div>

          {/* messages */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
            display: 'flex', flexDirection: 'column', gap: 10,
            scrollbarWidth: 'thin', scrollbarColor: 'rgba(16,185,129,.3) transparent',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '8px 11px',
                background: m.role === 'user' ? 'rgba(16,185,129,.12)' : 'rgba(38,38,38,.7)',
                border: m.role === 'user' ? '1px solid rgba(16,185,129,.3)' : '1px solid rgba(64,64,64,.5)',
                borderLeft: m.role === 'assistant' ? '3px solid #10b981' : '1px solid rgba(16,185,129,.3)',
                font: '400 12.5px/1.5 var(--font-sans)',
                color: '#f5f5f5', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>{m.content}</div>
            ))}
            {sending && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '8px 11px',
                background: 'rgba(38,38,38,.7)',
                borderLeft: '3px solid #10b981',
                font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.3em',
                color: '#10b981', textTransform: 'uppercase',
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                <span>Pensando</span>
                <span className="qz-dots"><span>.</span><span>.</span><span>.</span></span>
              </div>
            )}
          </div>

          {/* input */}
          <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{
            display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid rgba(16,185,129,.18)',
            background: 'rgba(0,0,0,.4)',
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu pregunta..."
              disabled={sending}
              style={{
                flex: 1, background: 'rgba(23,23,23,.8)', border: '1px solid rgba(64,64,64,.6)',
                color: '#f5f5f5', padding: '9px 11px',
                font: '400 12.5px/1 var(--font-sans)', outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(64,64,64,.6)'}
            />
            <button type="submit" disabled={sending || !input.trim()} style={{
              padding:'0 14px', background: input.trim() && !sending ? '#10b981' : '#262626',
              color: input.trim() && !sending ? '#000' : '#525252',
              border:'none', cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
              font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.25em', textTransform:'uppercase',
              transition: 'background 200ms, color 200ms',
            }}>Enviar</button>
          </form>

          <style>{`
            @keyframes pulseDot {
              0%, 100% { opacity: 1; transform: scale(1); }
              50%      { opacity: .5; transform: scale(.7); }
            }
            .qz-dots span { animation: qzDot 1.2s infinite; opacity: 0; }
            .qz-dots span:nth-child(2) { animation-delay: .2s; }
            .qz-dots span:nth-child(3) { animation-delay: .4s; }
            @keyframes qzDot { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
          `}</style>
        </div>
      )}
    </>
  );
}
