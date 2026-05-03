// Primitives, tokens, mini atoms used across the Elite Dashboard

const { useState, useEffect, useMemo, useRef } = React;

// ---------- PANEL ----------
function Panel({ title, eyebrow, action, children, glow, dense, span, color = 'emerald' }) {
  const accent = color === 'amber' ? '#f59e0b' : '#10b981';
  return (
    <section style={{
      gridColumn: span || 'auto',
      background: 'rgba(10,10,10,.72)',
      border: `1px solid ${glow ? 'rgba(16,185,129,.35)' : '#171717'}`,
      padding: dense ? 16 : 22,
      position: 'relative',
      boxShadow: glow ? 'inset 0 0 40px rgba(16,185,129,.04), 0 0 40px rgba(16,185,129,.08)' : 'inset 0 0 40px rgba(16,185,129,.02)',
      display: 'flex', flexDirection: 'column', minHeight: 0,
    }}>
      {/* corner ticks */}
      <span style={{ position:'absolute', top:-1, left:-1, width:10, height:10, borderTop:`1px solid ${accent}`, borderLeft:`1px solid ${accent}` }}/>
      <span style={{ position:'absolute', top:-1, right:-1, width:10, height:10, borderTop:`1px solid ${accent}`, borderRight:`1px solid ${accent}` }}/>
      <span style={{ position:'absolute', bottom:-1, left:-1, width:10, height:10, borderBottom:`1px solid ${accent}`, borderLeft:`1px solid ${accent}` }}/>
      <span style={{ position:'absolute', bottom:-1, right:-1, width:10, height:10, borderBottom:`1px solid ${accent}`, borderRight:`1px solid ${accent}` }}/>

      {(title || eyebrow) && (
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: dense ? 12 : 18, gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            {eyebrow && (
              <div style={{
                font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.4em',
                color: accent, textTransform: 'uppercase', marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 6, height: 6, background: accent, boxShadow: `0 0 8px ${accent}` }}/>
                {eyebrow}
              </div>
            )}
            {title && (
              <h3 style={{
                font: '900 13px/1.1 var(--font-sans)', letterSpacing: '-.01em',
                color: '#fff', textTransform: 'none', margin: 0,
              }}>{title}</h3>
            )}
          </div>
          {action}
        </header>
      )}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </section>
  );
}

// ---------- STAT ----------
function Stat({ label, value, delta, suffix, prefix, big, color }) {
  const up = typeof delta === 'number' ? delta >= 0 : null;
  const deltaColor = up === null ? '#737373' : up ? '#10b981' : '#ef4444';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <div style={{
        font: '700 8px/1 var(--font-mono)', letterSpacing: '.3em',
        color: '#737373', textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        font: `900 italic ${big ? 28 : 20}px/1 var(--font-sans)`,
        letterSpacing: '-.02em',
        color: color || '#fff',
        display: 'flex', alignItems: 'baseline', gap: 4,
      }}>
        {prefix && <span style={{ fontSize: big ? 16 : 12, color: '#737373', fontStyle: 'normal', fontWeight: 700 }}>{prefix}</span>}
        {value}
        {suffix && <span style={{ fontSize: big ? 14 : 10, color: '#a3a3a3', fontStyle: 'normal', fontWeight: 700 }}>{suffix}</span>}
      </div>
      {delta !== undefined && delta !== null && (
        <div style={{ font: '700 9px/1 var(--font-mono)', letterSpacing: '.2em', color: deltaColor, textTransform: 'uppercase' }}>
          {up ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}{suffix?.includes('%') || label.includes('PCT') ? '%' : ''}
        </div>
      )}
    </div>
  );
}

// ---------- BAR / PROGRESS ----------
function Bar({ pct, color = '#10b981', height = 4, glow = true }) {
  return (
    <div style={{ width: '100%', height, background: '#171717', overflow: 'hidden', position: 'relative' }}>
      <div style={{
        height: '100%', width: `${Math.max(0, Math.min(100, pct))}%`,
        background: color, transition: 'width 600ms ease',
        boxShadow: glow ? `0 0 8px ${color}` : 'none',
      }} />
    </div>
  );
}

// ---------- PILL ----------
function Pill({ children, status = 'live', color }) {
  const map = {
    live: { bg: 'rgba(16,185,129,.15)', border: 'rgba(16,185,129,.5)', fg: '#34d399', dot: '#10b981' },
    warn: { bg: 'rgba(245,158,11,.12)', border: 'rgba(245,158,11,.5)', fg: '#fbbf24', dot: '#f59e0b' },
    off:  { bg: 'rgba(115,115,115,.1)', border: '#262626', fg: '#737373', dot: '#525252' },
    bear: { bg: 'rgba(239,68,68,.1)', border: 'rgba(239,68,68,.5)', fg: '#f87171', dot: '#ef4444' },
  };
  const c = map[status] || map.live;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
      background: color || c.bg, border: `1px solid ${c.border}`,
      font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.3em',
      color: c.fg, textTransform: 'uppercase',
    }}>
      {status !== 'off' && (
        <span style={{
          width: 5, height: 5, background: c.dot, borderRadius: '50%',
          animation: status === 'live' ? 'blink 1.4s infinite' : 'none',
        }}/>
      )}
      {children}
    </span>
  );
}

// ---------- SPARKLINE ----------
function Sparkline({ data, color = '#10b981', height = 40, fill = true }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [i / (data.length - 1) * 100, 100 - ((v - min) / range) * 100]);
  const path = 'M ' + pts.map(p => p.join(' ')).join(' L ');
  const fillPath = path + ` L 100 100 L 0 100 Z`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      {fill && <path d={fillPath} fill={color} opacity={0.12}/>}
      <path d={path} stroke={color} strokeWidth={1.5} fill="none" vectorEffect="non-scaling-stroke"
            style={{ filter: `drop-shadow(0 0 2px ${color})` }}/>
    </svg>
  );
}

// ---------- TICKER ROW (horizontal scrolling prices) ----------
function PriceRow({ symbol, price, delta, bias }) {
  const up = delta >= 0;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px',
      borderRight: '1px solid #171717', minWidth: 200, flexShrink: 0,
    }}>
      <span style={{ font: '900 italic 11px/1 var(--font-sans)', letterSpacing: '.08em', color: '#fff' }}>{symbol}</span>
      <span style={{ font: '700 11px/1 var(--font-mono)', color: '#d4d4d4', marginLeft: 'auto' }}>
        {typeof price === 'number' ? price.toFixed(price > 100 ? 2 : 4) : price}
      </span>
      <span style={{
        font: '700 9px/1 var(--font-mono)', color: up ? '#10b981' : '#ef4444',
        padding: '2px 6px', background: up ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)',
      }}>{up ? '+' : ''}{delta.toFixed(2)}%</span>
      <span style={{
        font: '900 italic 7px/1 var(--font-sans)', letterSpacing: '.3em',
        color: bias === 'BULL' ? '#10b981' : bias === 'BEAR' ? '#ef4444' : '#737373',
      }}>{bias}</span>
    </div>
  );
}

// ---------- animation CSS ----------
const dashGlobalCSS = `
  @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:.3 } }
  @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
  @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
  @keyframes flicker { 0%,100% { opacity: 1 } 50% { opacity: .85 } }
  .dash-marquee { animation: marquee 40s linear infinite; }
  .dash-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .dash-scroll::-webkit-scrollbar-track { background: #0a0a0a; }
  .dash-scroll::-webkit-scrollbar-thumb { background: #171717; border: 1px solid rgba(16,185,129,.2); }
  .dash-scroll::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,.3); }
  .dash-row-hover:hover { background: rgba(16,185,129,.04) !important; }
`;

Object.assign(window, { Panel, Stat, Bar, Pill, Sparkline, PriceRow, dashGlobalCSS });
