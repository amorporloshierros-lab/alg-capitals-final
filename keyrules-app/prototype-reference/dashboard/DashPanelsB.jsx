// More panels: Licenses, Bias, Journal, Academy, Checklist, Risk, Discord

const { useState: useStateP, useEffect: useEffectP } = React;

// ---------- LICENSES ----------
function LicensesPanel() {
  const lic = [
    { name: 'Oracle MT5 · Full',     key: 'ORCL-8492-ALG',  exp: '24 Dic 2026', uses: '∞',  status: 'live', glow: true },
    { name: 'Indicador Keywick Pro', key: 'KWCK-1177-ELT',  exp: '24 Dic 2026', uses: '∞',  status: 'live' },
    { name: 'Bias Channel · Telegram', key: 'TG-@keyrules-vip', exp: 'Lifetime',  uses: '—',  status: 'live' },
    { name: 'Discord Elite',         key: 'DSC-elite-2026',  exp: 'Lifetime',  uses: '—',  status: 'live' },
    { name: 'Libro KEYWICK · Digital', key: 'BK-e-0042',     exp: 'Lifetime',  uses: '—',  status: 'live' },
    { name: 'Risk Calculator Quantz', key: 'QZ-RISK-v2',     exp: '12 Ago 2026', uses: '∞', status: 'warn' },
  ];
  return (
    <Panel eyebrow="Accesos · Activos" title="Licencias & Membresías"
      action={<a style={{ font: '900 italic 9px/1 var(--font-sans)', letterSpacing: '.25em', color: '#10b981', textTransform: 'uppercase', cursor: 'pointer' }}>Gestionar →</a>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lic.map((l, i) => (
          <div key={i} className="dash-row-hover" style={{
            display: 'grid', gridTemplateColumns: '16px 1fr auto auto', gap: 12, alignItems: 'center',
            padding: '10px 12px', background: l.glow ? 'rgba(16,185,129,.04)' : 'rgba(5,5,5,.4)',
            border: `1px solid ${l.glow ? 'rgba(16,185,129,.3)' : '#171717'}`,
            transition: 'background 200ms',
          }}>
            <span style={{
              width: 8, height: 8, background: l.status === 'warn' ? '#f59e0b' : '#10b981',
              boxShadow: `0 0 8px ${l.status === 'warn' ? '#f59e0b' : '#10b981'}`,
              borderRadius: '50%',
            }}/>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: '700 12px/1.2 var(--font-sans)', color: '#fff' }}>{l.name}</div>
              <div style={{ font: '400 9px/1 var(--font-mono)', color: '#525252', letterSpacing: '.15em', marginTop: 3 }}>{l.key}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ font: '700 8px/1 var(--font-mono)', color: '#737373', letterSpacing: '.2em', textTransform: 'uppercase' }}>Vence</div>
              <div style={{ font: '700 10px/1 var(--font-mono)', color: l.status === 'warn' ? '#f59e0b' : '#d4d4d4', marginTop: 3 }}>{l.exp}</div>
            </div>
            <Pill status={l.status}>{l.status === 'warn' ? 'Renovar' : 'Activa'}</Pill>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ---------- BIAS DAILY ----------
function BiasPanel() {
  const [active, setActive] = useStateP('XAU');
  const assets = {
    XAU: { name: 'XAU/USD', bias: 'LONG', tgt: '2340', inv: '2298', kz: '13:30 UTC · NY Open' },
    NAS: { name: 'NAS100', bias: 'LONG', tgt: '18,400', inv: '18,100', kz: '14:30 UTC · NY AM' },
    US30: { name: 'US30', bias: 'NEUTRAL', tgt: '39,600', inv: '39,200', kz: '08:00 UTC · LDN' },
    EUR: { name: 'EUR/USD', bias: 'SHORT', tgt: '1.0770', inv: '1.0880', kz: '13:00 UTC · CPI' },
  };
  const a = assets[active];
  return (
    <Panel eyebrow="Daily Bias · 21 Abr 2026" title={`Proyección Institucional · ${a.name}`} glow
      action={
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.keys(assets).map(k => (
            <button key={k} onClick={() => setActive(k)} style={{
              padding: '6px 10px', font: '900 italic 8px/1 var(--font-sans)',
              letterSpacing: '.25em', textTransform: 'uppercase', cursor: 'pointer',
              background: active === k ? '#10b981' : 'transparent',
              color: active === k ? '#000' : '#737373',
              border: `1px solid ${active === k ? '#10b981' : '#262626'}`,
            }}>{k}</button>
          ))}
        </div>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* video player placeholder */}
        <div style={{
          aspectRatio: '16/10', background: '#000', border: '1px solid #171717',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16,185,129,.08), transparent 60%)' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(16,185,129,.03) 3px)' }}/>
          <div style={{
            width: 58, height: 58, borderRadius: '50%', border: '2px solid #10b981',
            background: 'rgba(16,185,129,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(16,185,129,.5)', cursor: 'pointer', zIndex: 2,
          }}>
            <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #10b981', marginLeft: 4 }}/>
          </div>
          <div style={{ position: 'absolute', bottom: 10, left: 12, font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.3em', color: '#10b981', textTransform: 'uppercase' }}>
            ◉ REC · 12:44 · Daily Bias
          </div>
          <div style={{ position: 'absolute', top: 10, right: 12, font: '700 8px/1 var(--font-mono)', letterSpacing: '.2em', color: '#737373' }}>HD · 1920×1080</div>
        </div>
        {/* bias meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ font: '700 8px/1 var(--font-mono)', letterSpacing: '.3em', color: '#525252', textTransform: 'uppercase' }}>Dirección</div>
            <div style={{
              font: '900 italic 36px/1 var(--font-sans)', letterSpacing: '-.02em',
              color: a.bias === 'LONG' ? '#10b981' : a.bias === 'SHORT' ? '#ef4444' : '#f59e0b',
              textShadow: '0 0 20px currentColor', textTransform: 'uppercase', marginTop: 6,
            }}>{a.bias}</div>
          </div>
          <div style={{ padding: 10, background: 'rgba(16,185,129,.04)', borderLeft: '3px solid #10b981' }}>
            <div style={{ font: '700 8px/1 var(--font-mono)', color: '#737373', letterSpacing: '.3em', textTransform: 'uppercase' }}>Target</div>
            <div style={{ font: '900 italic 18px/1 var(--font-sans)', color: '#fff', marginTop: 4 }}>{a.tgt}</div>
          </div>
          <div style={{ padding: 10, background: 'rgba(239,68,68,.04)', borderLeft: '3px solid #ef4444' }}>
            <div style={{ font: '700 8px/1 var(--font-mono)', color: '#737373', letterSpacing: '.3em', textTransform: 'uppercase' }}>Invalidación</div>
            <div style={{ font: '900 italic 18px/1 var(--font-sans)', color: '#fff', marginTop: 4 }}>{a.inv}</div>
          </div>
          <div>
            <div style={{ font: '700 8px/1 var(--font-mono)', color: '#525252', letterSpacing: '.3em', textTransform: 'uppercase' }}>Kill Zone</div>
            <div style={{ font: '700 11px/1.3 var(--font-mono)', color: '#d4d4d4', marginTop: 6 }}>{a.kz}</div>
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 14, padding: 12, background: 'rgba(16,185,129,.04)',
        borderTop: '1px solid rgba(16,185,129,.2)',
      }}>
        <p style={{ margin: 0, font: '400 italic 12px/1.5 var(--font-sans)', color: 'rgba(209,250,229,.85)' }}>
          "Esperamos sweep de mínimos asiáticos en 2308 → retorno a premium en sesión NY. <b>No operar antes del 13:30 UTC.</b> Stop estructural bajo 2298."
        </p>
      </div>
    </Panel>
  );
}

// ---------- JOURNAL ----------
function JournalPanel() {
  const trades = useTrades();
  const wins = trades.filter(t => t.result === 'win').length;
  return (
    <Panel eyebrow="Trade Journal · Auto-sync MT5" title="Operaciones Recientes"
      action={<Pill status="live">{wins}/{trades.length} W</Pill>}>
      <div className="dash-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 360, overflowY: 'auto' }}>
        {trades.map(t => (
          <div key={t.id} className="dash-row-hover" style={{
            display: 'grid', gridTemplateColumns: '48px 72px 52px 1fr 70px',
            gap: 10, alignItems: 'center', padding: '10px 12px',
            background: 'rgba(5,5,5,.3)', border: '1px solid #171717',
            transition: 'background 200ms',
          }}>
            <span style={{ font: '700 9px/1 var(--font-mono)', color: '#525252', letterSpacing: '.15em' }}>{t.time}</span>
            <span style={{ font: '900 italic 11px/1 var(--font-sans)', color: '#fff' }}>{t.symbol}</span>
            <span style={{
              font: '900 italic 8px/1 var(--font-sans)', letterSpacing: '.25em',
              padding: '3px 6px', textAlign: 'center',
              color: t.side === 'LONG' ? '#10b981' : '#ef4444',
              background: t.side === 'LONG' ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)',
              border: `1px solid ${t.side === 'LONG' ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.3)'}`,
            }}>{t.side}</span>
            <span style={{ font: '400 italic 10px/1.3 var(--font-sans)', color: '#a3a3a3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.note}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                font: '900 italic 12px/1 var(--font-sans)',
                color: t.result === 'win' ? '#10b981' : t.result === 'loss' ? '#ef4444' : '#a3a3a3',
              }}>{t.pips > 0 ? '+' : ''}{t.pips}p</div>
              <div style={{ font: '700 8px/1 var(--font-mono)', color: '#525252', letterSpacing: '.15em', marginTop: 3 }}>{t.rr > 0 ? t.rr.toFixed(1) + 'R' : 'BE'}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ---------- ACADEMY PROGRESS ----------
function AcademyPanel() {
  const modules = [
    { n: 1, name: 'Fundamentos & Mindset',   pct: 100, lessons: '8/8',  status: 'done' },
    { n: 2, name: 'Estructura de Mercado',   pct: 100, lessons: '12/12', status: 'done' },
    { n: 3, name: 'Liquidez & Manipulación', pct: 100, lessons: '10/10', status: 'done' },
    { n: 4, name: 'Order Blocks · FVG',       pct: 65,  lessons: '7/11', status: 'live' },
    { n: 5, name: 'Smart Money Concepts',    pct: 0,   lessons: '0/9',  status: 'lock' },
    { n: 6, name: 'Gestión Cuántica del Riesgo', pct: 0, lessons: '0/6', status: 'lock' },
  ];
  return (
    <Panel eyebrow="Academia · 10 Semanas" title="Progreso Curricular">
      <div style={{ marginBottom: 14, padding: 10, background: 'rgba(16,185,129,.04)', border: '1px solid rgba(16,185,129,.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.2em', color: '#fff', textTransform: 'uppercase' }}>Avance General</span>
          <span style={{ font: '900 italic 14px/1 var(--font-sans)', color: '#10b981' }}>44%</span>
        </div>
        <Bar pct={44}/>
        <div style={{ font: '700 9px/1 var(--font-mono)', color: '#737373', letterSpacing: '.2em', marginTop: 8, textTransform: 'uppercase' }}>
          37 / 56 lecciones · Semana 5 de 10
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {modules.map(m => (
          <div key={m.n} className="dash-row-hover" style={{
            display: 'grid', gridTemplateColumns: '28px 1fr auto 80px', gap: 10,
            alignItems: 'center', padding: '8px 10px',
            border: '1px solid #171717', background: 'rgba(5,5,5,.3)',
            opacity: m.status === 'lock' ? 0.5 : 1,
          }}>
            <span style={{
              font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '-.02em',
              color: m.status === 'done' ? '#10b981' : m.status === 'live' ? '#fff' : '#525252',
              textAlign: 'center',
            }}>
              {m.status === 'done' ? '✓' : m.status === 'lock' ? '🔒' : `0${m.n}`}
            </span>
            <div style={{ font: '700 11px/1.2 var(--font-sans)', color: m.status === 'lock' ? '#525252' : '#fff' }}>{m.name}</div>
            <span style={{ font: '700 9px/1 var(--font-mono)', color: '#737373', letterSpacing: '.2em' }}>{m.lessons}</span>
            <div style={{ width: 80 }}><Bar pct={m.pct} color={m.status === 'done' ? '#10b981' : m.status === 'live' ? '#34d399' : '#262626'} glow={false}/></div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ---------- CHECKLIST ----------
function ChecklistPanel() {
  const items = [
    { label: 'HTF bias definido (D1/H4)', done: true },
    { label: 'Zona PD premium/discount', done: true },
    { label: 'Liquidez barrida', done: true },
    { label: 'Confluencia SMT / DXY', done: true },
    { label: 'Kill zone activa', done: false },
    { label: 'CHoCH confirmado M5', done: false },
    { label: 'Riesgo ≤ 0.5% cuenta', done: true },
    { label: 'R:R mínimo 1:2.5', done: false },
  ];
  const done = items.filter(i => i.done).length;
  const ready = done >= 6;
  return (
    <Panel eyebrow="Pre-entrada · A+ Setup" title="Checklist de Alta Probabilidad"
      action={<Pill status={ready ? 'live' : 'warn'}>{done}/{items.length}</Pill>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((it, i) => (
          <label key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px',
            cursor: 'pointer', border: '1px solid transparent',
          }}>
            <span style={{
              width: 14, height: 14, flexShrink: 0,
              border: `1px solid ${it.done ? '#10b981' : '#262626'}`,
              background: it.done ? '#10b981' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: '#000', fontWeight: 900,
            }}>{it.done ? '✓' : ''}</span>
            <span style={{
              font: '700 11px/1.2 var(--font-sans)',
              color: it.done ? '#d4d4d4' : '#737373',
              textDecoration: it.done ? 'line-through' : 'none',
            }}>{it.label}</span>
          </label>
        ))}
      </div>
      <div style={{
        marginTop: 12, padding: 10, textAlign: 'center',
        background: ready ? 'rgba(16,185,129,.1)' : 'rgba(245,158,11,.08)',
        border: `1px solid ${ready ? 'rgba(16,185,129,.4)' : 'rgba(245,158,11,.3)'}`,
        font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.25em',
        color: ready ? '#10b981' : '#f59e0b', textTransform: 'uppercase',
      }}>{ready ? '⬢ Ejecutar Entrada' : '⌛ Esperar Confluencia'}</div>
    </Panel>
  );
}

// ---------- RISK CALC ----------
function RiskPanel() {
  const [balance, setBalance] = useStateP(100000);
  const [risk, setRisk] = useStateP(0.5);
  const [stop, setStop] = useStateP(42);
  const [rr, setRr] = useStateP(3);
  const riskUsd = balance * (risk / 100);
  const lots = (riskUsd / (stop * 10)).toFixed(2);
  const targetUsd = (riskUsd * rr).toFixed(0);

  const Input = ({ label, value, onChange, suffix, step = 0.1 }) => (
    <div>
      <div style={{ font: '700 8px/1 var(--font-mono)', color: '#737373', letterSpacing: '.3em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #171717', background: '#050505' }}>
        <input type="number" value={value} step={step} onChange={e => onChange(parseFloat(e.target.value) || 0)} style={{
          flex: 1, padding: '10px 12px', background: 'transparent', border: 'none', outline: 'none',
          font: '900 italic 14px/1 var(--font-sans)', color: '#fff', width: '100%', minWidth: 0,
        }}/>
        {suffix && <span style={{ padding: '0 12px', font: '700 9px/1 var(--font-mono)', color: '#525252', letterSpacing: '.2em' }}>{suffix}</span>}
      </div>
    </div>
  );

  return (
    <Panel eyebrow="Quantz · Position Sizing" title="Calculadora de Riesgo">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <Input label="Balance" value={balance} onChange={setBalance} suffix="USD" step={1000}/>
        <Input label="Riesgo %" value={risk} onChange={setRisk} suffix="%" step={0.1}/>
        <Input label="Stop Loss" value={stop} onChange={setStop} suffix="pips" step={1}/>
        <Input label="R:R Target" value={rr} onChange={setRr} suffix=":1" step={0.5}/>
      </div>
      <div style={{
        padding: 14, background: 'rgba(16,185,129,.06)',
        border: '1px solid rgba(16,185,129,.3)',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
      }}>
        <Stat label="Riesgo $" value={riskUsd.toFixed(0)} prefix="$" color="#ef4444"/>
        <Stat label="Tamaño" value={lots} suffix="lots" color="#fff"/>
        <Stat label="Target" value={targetUsd} prefix="$" color="#10b981"/>
      </div>
    </Panel>
  );
}

// ---------- DISCORD / SIGNALS ----------
function SignalsPanel() {
  const signals = [
    { time: '14:22', user: '@Lucas.T', msg: 'XAU long 2318 · SL 2308 · TP 2340', flag: '🟢' },
    { time: '14:12', user: '@Mentor_KR', msg: '⚠ Esperar NY open, no operar London close', flag: '⚠' },
    { time: '13:58', user: '@Marcos.E', msg: 'NAS100 LONG +84p, parcial en 1R', flag: '🟢' },
    { time: '13:40', user: '@Mentor_KR', msg: 'Bias semanal actualizado en canal #bias', flag: '◉' },
    { time: '13:22', user: '@Sofia.A', msg: 'EUR short invalidado, fuera BE', flag: '◯' },
  ];
  return (
    <Panel eyebrow="Community · Elite Discord" title="Feed Live" color="emerald"
      action={<Pill status="live">12 online</Pill>}>
      <div className="dash-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
        {signals.map((s, i) => (
          <div key={i} style={{
            padding: '8px 10px', borderLeft: '2px solid rgba(16,185,129,.3)',
            background: 'rgba(5,5,5,.4)',
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span>{s.flag}</span>
              <span style={{ font: '900 italic 10px/1 var(--font-sans)', color: '#34d399', letterSpacing: '.05em' }}>{s.user}</span>
              <span style={{ font: '700 8px/1 var(--font-mono)', color: '#525252', letterSpacing: '.15em', marginLeft: 'auto' }}>{s.time}</span>
            </div>
            <div style={{ font: '400 11px/1.4 var(--font-sans)', color: '#d4d4d4' }}>{s.msg}</div>
          </div>
        ))}
      </div>
      <button style={{
        marginTop: 12, width: '100%', padding: 12,
        background: '#10b981', color: '#000', border: 'none', cursor: 'pointer',
        font: '900 italic 10px/1 var(--font-sans)', letterSpacing: '.3em', textTransform: 'uppercase',
        boxShadow: '0 0 20px rgba(16,185,129,.3)',
      }}>Abrir Discord Elite →</button>
    </Panel>
  );
}

Object.assign(window, { LicensesPanel, BiasPanel, JournalPanel, AcademyPanel, ChecklistPanel, RiskPanel, SignalsPanel });
