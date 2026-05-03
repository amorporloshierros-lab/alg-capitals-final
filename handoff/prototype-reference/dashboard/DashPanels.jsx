// Main panels for Elite Dashboard

const { useState: useStateW, useEffect: useEffectW, useMemo: useMemoW } = React;

// ---------- HEADER ----------
function EliteHeader({ name = 'Lucas T.', onBack }) {
  const [time, setTime] = useStateW(new Date());
  useEffectW(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (n) => String(n).padStart(2, '0');
  const session = (() => {
    const h = time.getUTCHours();
    if (h >= 7 && h < 12) return { name: 'LONDON', color: '#10b981' };
    if (h >= 12 && h < 17) return { name: 'NEW YORK', color: '#f59e0b' };
    if (h >= 22 || h < 7) return { name: 'ASIA', color: '#737373' };
    return { name: 'OVERLAP', color: '#34d399' };
  })();
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 24px', background: 'rgba(10,10,10,.9)',
      border: '1px solid #171717', borderLeft: '3px solid #10b981',
      marginBottom: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {onBack && (
          <a onClick={onBack} style={{
            font: '900 9px/1 var(--font-sans)', letterSpacing: '.3em',
            color: '#737373', textTransform: 'uppercase', cursor: 'pointer',
            padding: '8px 14px', border: '1px solid #262626',
          }}>← Salir</a>
        )}
        <div>
          <div style={{ font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.4em', color: '#10b981', textTransform: 'uppercase', marginBottom: 6 }}>
            ⬢ Elite Program · Terminal v4.0
          </div>
          <h1 style={{ font: '900 italic 22px/1 var(--font-sans)', color: '#fff', margin: 0, letterSpacing: '-.01em', textTransform: 'uppercase' }}>
            Cockpit de <span style={{ color: '#10b981', textShadow: '0 0 12px rgba(16,185,129,.5)' }}>{name}</span>
          </h1>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ font: '700 8px/1 var(--font-mono)', letterSpacing: '.3em', color: '#525252', textTransform: 'uppercase' }}>Sesión activa</div>
          <div style={{ font: '900 italic 14px/1 var(--font-sans)', color: session.color, letterSpacing: '.15em', textTransform: 'uppercase', marginTop: 4 }}>
            {session.name}
          </div>
        </div>
        <div style={{ height: 34, width: 1, background: '#262626' }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ font: '700 8px/1 var(--font-mono)', letterSpacing: '.3em', color: '#525252', textTransform: 'uppercase' }}>UTC</div>
          <div style={{ font: '700 16px/1 var(--font-mono)', color: '#d4d4d4', marginTop: 4 }}>
            {fmt(time.getUTCHours())}:{fmt(time.getUTCMinutes())}:{fmt(time.getUTCSeconds())}
          </div>
        </div>
        <div style={{ height: 34, width: 1, background: '#262626' }} />
        <Pill status="live">Oracle Conectado</Pill>
        <div style={{
          width: 42, height: 42, border: '1px solid rgba(16,185,129,.4)',
          background: '#10b981', color: '#000', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          font: '900 italic 14px/1 var(--font-sans)', letterSpacing: '.02em',
          boxShadow: '0 0 20px rgba(16,185,129,.4)',
        }}>LT</div>
      </div>
    </header>
  );
}

// ---------- TICKER STRIP ----------
function TickerStrip() {
  const ticks = useLiveTicks();
  const doubled = [...ticks, ...ticks];
  return (
    <div style={{
      marginBottom: 18, overflow: 'hidden',
      border: '1px solid #171717', background: 'rgba(10,10,10,.7)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2,
        padding: '8px 14px', background: '#10b981', color: '#000',
        font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.3em', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center',
      }}>◉ LIVE · FEED</div>
      <div className="dash-marquee" style={{ display: 'flex', paddingLeft: 140, width: 'max-content' }}>
        {doubled.map((t, i) => <PriceRow key={i} {...t} />)}
      </div>
    </div>
  );
}

// ---------- EQUITY CURVE PANEL ----------
function EquityPanel() {
  const data = useEquityCurve(10000, 120);
  const start = data[0], now = data[data.length - 1];
  const pnl = now - start;
  const pct = ((now - start) / start) * 100;
  const high = Math.max(...data);
  const low = Math.min(...data);
  const dd = ((low - high) / high) * 100;

  return (
    <Panel eyebrow="Master Account · $100K" title="Equity Curve · Live" glow
      action={<Pill status="live">Streaming · Oracle MT5</Pill>}>
      <div style={{ display: 'flex', gap: 28, marginBottom: 16, flexWrap: 'wrap' }}>
        <Stat label="Balance actual" value={now.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} prefix="$" big color="#10b981"/>
        <Stat label="P&L Total" value={pnl.toFixed(0)} prefix="$" delta={pct} color={pnl >= 0 ? '#fff' : '#ef4444'}/>
        <Stat label="Max Drawdown" value={Math.abs(dd).toFixed(2)} suffix="%" color="#f59e0b"/>
        <Stat label="Profit Factor" value="2.84" color="#34d399"/>
        <Stat label="Win Rate" value="68" suffix="%"/>
        <Stat label="Trades" value="247"/>
      </div>
      <div style={{
        position: 'relative', height: 180, background: 'rgba(0,0,0,.4)',
        border: '1px solid #171717', padding: 12,
      }}>
        <EquitySVG data={data} />
        {/* crosshair labels */}
        <div style={{ position: 'absolute', top: 6, left: 10, font: '700 8px/1 var(--font-mono)', color: '#525252', letterSpacing: '.2em' }}>${Math.max(...data).toFixed(0)}</div>
        <div style={{ position: 'absolute', bottom: 6, left: 10, font: '700 8px/1 var(--font-mono)', color: '#525252', letterSpacing: '.2em' }}>${Math.min(...data).toFixed(0)}</div>
        <div style={{ position: 'absolute', bottom: 6, right: 10, font: '700 8px/1 var(--font-mono)', color: '#10b981', letterSpacing: '.2em' }}>{new Date().toLocaleDateString('es-AR')}</div>
      </div>
    </Panel>
  );
}

function EquitySVG({ data }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 100, H = 100;
  const pts = data.map((v, i) => [i / (data.length - 1) * W, H - ((v - min) / range) * H]);
  const path = 'M ' + pts.map(p => p.join(' ')).join(' L ');
  const fillPath = path + ` L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="eq-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1="0" y1={H * p} x2={W} y2={H * p} stroke="#171717" strokeWidth="0.3" vectorEffect="non-scaling-stroke"/>
      ))}
      <path d={fillPath} fill="url(#eq-fill)"/>
      <path d={path} stroke="#10b981" strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke"
            style={{ filter: 'drop-shadow(0 0 3px rgba(16,185,129,.6))' }}/>
      {/* end dot */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.2" fill="#34d399"/>
    </svg>
  );
}

// ---------- CHALLENGES ----------
function ChallengePanel() {
  const challenges = useChallengeProgress();
  return (
    <Panel eyebrow="Prop Firms · Funder Sync" title="Challenges Activos"
      action={<span style={{ font: '700 9px/1 var(--font-mono)', color: '#737373', letterSpacing: '.2em' }}>{challenges.length} activos</span>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {challenges.map((c, i) => <ChallengeRow key={i} {...c}/>)}
      </div>
    </Panel>
  );
}

function ChallengeRow({ firm, logo, account, stage, target, current, drawdown, maxDd, dailyDd, daysLeft, status, trades, winrate }) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 100;
  const ddPct = (drawdown / maxDd) * 100;
  const funded = status === 'funded';
  return (
    <div style={{
      padding: 14, background: 'rgba(5,5,5,.5)', border: '1px solid #171717',
      display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 14, alignItems: 'center',
    }}>
      <div style={{
        width: 48, height: 48, background: '#000', border: '1px solid #262626',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6,
      }}>
        <img src={logo} style={{ maxWidth: '100%', maxHeight: '100%', filter: 'brightness(1.1)' }} alt={firm}/>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ font: '900 italic 12px/1 var(--font-sans)', color: '#fff', letterSpacing: '.02em' }}>{firm}</span>
          <span style={{ font: '700 9px/1 var(--font-mono)', color: '#737373', letterSpacing: '.2em' }}>· {account} · {stage}</span>
          <Pill status={funded ? 'live' : 'live'}>{funded ? 'FUNDED' : 'EN CURSO'}</Pill>
        </div>
        {/* target bar */}
        {!funded && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: '700 8px/1 var(--font-mono)', color: '#a3a3a3', letterSpacing: '.2em', marginBottom: 4, textTransform: 'uppercase' }}>
              <span>Target {target}%</span>
              <span style={{ color: '#10b981' }}>{current.toFixed(2)}% · {pct.toFixed(0)}%</span>
            </div>
            <Bar pct={pct} color="#10b981"/>
          </div>
        )}
        {/* dd bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', font: '700 8px/1 var(--font-mono)', color: '#a3a3a3', letterSpacing: '.2em', marginBottom: 4, textTransform: 'uppercase' }}>
            <span>Drawdown {drawdown.toFixed(2)}% / {maxDd}%</span>
            <span style={{ color: ddPct > 70 ? '#ef4444' : ddPct > 40 ? '#f59e0b' : '#737373' }}>Daily cap {dailyDd}%</span>
          </div>
          <Bar pct={ddPct} color={ddPct > 70 ? '#ef4444' : ddPct > 40 ? '#f59e0b' : '#525252'} glow={false}/>
        </div>
      </div>
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ font: '900 italic 16px/1 var(--font-sans)', color: funded ? '#10b981' : '#fff' }}>
          {funded ? '+' + current.toFixed(2) + '%' : (daysLeft ? daysLeft + 'd' : '—')}
        </div>
        <div style={{ font: '700 8px/1 var(--font-mono)', color: '#737373', letterSpacing: '.2em', textTransform: 'uppercase' }}>
          {funded ? 'payout' : 'restantes'}
        </div>
        <div style={{ font: '700 9px/1 var(--font-mono)', color: '#a3a3a3', marginTop: 4 }}>
          {trades}t · {winrate}% WR
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EliteHeader, TickerStrip, EquityPanel, ChallengePanel });
