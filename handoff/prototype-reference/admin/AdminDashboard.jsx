// AdminDashboard.jsx — Panel de administración (mockup visual)
// Sidebar + secciones con drag&drop, formularios, tablas.
// Esto es solo UI — no persiste, sirve de referencia para el handoff.
const { useState: useAdminState } = React;

const ADMIN_SECTIONS = [
  { id: 'overview',   label: 'Overview',       icon: '◉' },
  { id: 'meet',       label: 'Próximo Meet',   icon: '◎' },
  { id: 'bias',       label: 'Bias Diario',    icon: '▲' },
  { id: 'classes',    label: 'Clases & Replays', icon: '▶' },
  { id: 'signals',    label: 'Señales',        icon: '◆' },
  { id: 'certs',      label: 'Certificados',   icon: '✦' },
  { id: 'reviews',    label: 'Testimonios',    icon: '✧' },
  { id: 'students',   label: 'Alumnos',        icon: '●' },
  { id: 'payments',   label: 'Pagos',          icon: '$' },
  { id: 'plans',      label: 'Planes',         icon: '◇' },
];

const adminCard = {
  background: 'rgba(23,23,23,.6)',
  border: '1px solid rgba(16,185,129,.18)',
  padding: 20,
};

const adminLabel = {
  font: '900 italic 9px/1 var(--font-sans)',
  letterSpacing: '.4em',
  textTransform: 'uppercase',
  color: '#10b981',
  marginBottom: 8,
  display: 'block',
};

const adminInput = {
  width: '100%',
  background: 'rgba(10,10,10,.7)',
  border: '1px solid rgba(64,64,64,.6)',
  color: '#f5f5f5',
  padding: '10px 12px',
  font: '400 13px/1.4 var(--font-sans)',
  outline: 'none',
};

const adminBtn = (primary = true) => ({
  padding: '10px 18px',
  background: primary ? '#10b981' : 'transparent',
  color: primary ? '#000' : '#10b981',
  border: primary ? 'none' : '1px solid #10b981',
  cursor: 'pointer',
  font: '900 italic 10px/1 var(--font-sans)',
  letterSpacing: '.3em',
  textTransform: 'uppercase',
});

function AdminShell({ onBack }) {
  const [section, setSection] = useAdminState('overview');

  return (
    <div data-screen-label="07 admin" style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
    }}>
      <AdminSidebar section={section} setSection={setSection} onBack={onBack}/>
      <main style={{ padding: 32, overflowY: 'auto' }}>
        <AdminTopbar section={section}/>
        <div style={{ marginTop: 24 }}>
          {section === 'overview' && <Overview/>}
          {section === 'meet'     && <MeetEditor/>}
          {section === 'bias'     && <BiasEditor/>}
          {section === 'classes'  && <ClassesEditor/>}
          {section === 'signals'  && <SignalsEditor/>}
          {section === 'certs'    && <CertsEditor/>}
          {section === 'reviews'  && <ReviewsEditor/>}
          {section === 'students' && <StudentsTable/>}
          {section === 'payments' && <PaymentsTable/>}
          {section === 'plans'    && <PlansEditor/>}
        </div>
      </main>
    </div>
  );
}

function AdminSidebar({ section, setSection, onBack }) {
  return (
    <aside style={{
      borderRight: '1px solid rgba(16,185,129,.15)',
      padding: '24px 0',
      background: 'rgba(0,0,0,.4)',
      position: 'sticky', top: 0, alignSelf: 'start',
      height: '100vh',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '0 24px 20px', borderBottom: '1px solid rgba(16,185,129,.12)' }}>
        <div style={{ font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.5em', color:'#10b981', textTransform:'uppercase', marginBottom: 6 }}>
          ◉ Admin
        </div>
        <div style={{ font:'900 italic 14px/1.1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'.05em' }}>
          KeyRules<br/><span style={{ color:'#737373', fontSize:11 }}>Panel de control</span>
        </div>
      </div>

      <nav style={{ flex:1, padding:'14px 12px', display:'flex', flexDirection:'column', gap:2 }}>
        {ADMIN_SECTIONS.map(s => {
          const active = section === s.id;
          return (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'10px 12px', textAlign:'left',
              background: active ? 'rgba(16,185,129,.10)' : 'transparent',
              borderLeft: active ? '3px solid #10b981' : '3px solid transparent',
              color: active ? '#f5f5f5' : '#a3a3a3',
              border: 'none', borderLeftWidth: 3, borderLeftStyle: 'solid',
              borderLeftColor: active ? '#10b981' : 'transparent',
              cursor:'pointer',
              font:'700 11px/1 var(--font-sans)', letterSpacing:'.15em', textTransform:'uppercase',
              transition:'all 200ms',
            }}
            onMouseEnter={e => { if(!active) e.currentTarget.style.color = '#f5f5f5'; }}
            onMouseLeave={e => { if(!active) e.currentTarget.style.color = '#a3a3a3'; }}>
              <span style={{ color:'#10b981', width:12, display:'inline-block' }}>{s.icon}</span>
              {s.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding:'14px 24px', borderTop:'1px solid rgba(16,185,129,.12)' }}>
        <button onClick={onBack} style={{
          background:'none', border:'none', color:'#737373', cursor:'pointer',
          font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase',
          padding: 0,
        }}>← Volver al sitio</button>
      </div>
    </aside>
  );
}

function AdminTopbar({ section }) {
  const meta = ADMIN_SECTIONS.find(s => s.id === section);
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', borderBottom:'1px solid rgba(16,185,129,.15)', paddingBottom: 16 }}>
      <div>
        <div style={{ font:'400 10px/1 var(--font-mono)', letterSpacing:'.4em', color:'#525252', textTransform:'uppercase', marginBottom: 8 }}>
          Admin / {meta?.label}
        </div>
        <h1 style={{ margin:0, font:'900 italic 28px/1 var(--font-sans)', color:'#f5f5f5', textTransform:'uppercase', letterSpacing:'-.01em' }}>
          {meta?.label}
        </h1>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12, color:'#737373', font:'400 11px/1 var(--font-mono)', letterSpacing:'.2em', textTransform:'uppercase' }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 10px #10b981' }}/>
        Lucas T.
      </div>
    </div>
  );
}

// ---------- OVERVIEW ----------
function Overview() {
  const stats = [
    { label:'Alumnos activos', value:'247', sub:'+12 este mes' },
    { label:'Plan Elite',      value:'58',  sub:'23.5% del total' },
    { label:'MRR',             value:'$ 14.3k', sub:'+8.2% MoM' },
    { label:'Bias publicados', value:'128', sub:'90 días' },
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
      {stats.map(s => (
        <div key={s.label} style={adminCard}>
          <div style={adminLabel}>{s.label}</div>
          <div style={{ font:'900 italic 32px/1 var(--font-sans)', color:'#f5f5f5' }}>{s.value}</div>
          <div style={{ font:'400 11px/1 var(--font-mono)', color:'#737373', marginTop:6, letterSpacing:'.15em', textTransform:'uppercase' }}>{s.sub}</div>
        </div>
      ))}
      <div style={{ ...adminCard, gridColumn:'1 / -1', marginTop:8 }}>
        <div style={adminLabel}>Actividad reciente</div>
        <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
          {[
            ['Nuevo alumno','Martina P. — Plan Pro','hace 2 min'],
            ['Pago recibido','Diego R. — Elite anual — USD 1.200','hace 18 min'],
            ['Bias publicado','XAUUSD — sesgo bajista intraday','hace 1 h'],
            ['Replay subido','Clase 14 — Liquidity Delivery','hace 3 h'],
          ].map(([k,v,t]) => (
            <li key={v} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(38,38,38,.6)' }}>
              <div>
                <div style={{ font:'700 11px/1 var(--font-sans)', color:'#10b981', letterSpacing:'.2em', textTransform:'uppercase' }}>{k}</div>
                <div style={{ font:'400 13px/1.4 var(--font-sans)', color:'#d4d4d4', marginTop:4 }}>{v}</div>
              </div>
              <div style={{ font:'400 10px/1 var(--font-mono)', color:'#525252', letterSpacing:'.2em', textTransform:'uppercase' }}>{t}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------- MEET EDITOR ----------
function MeetEditor() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
      <div style={adminCard}>
        <div style={adminLabel}>Próximo Meet</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Field label="Título"     defaultValue="Live Trading Sesión Londres"/>
          <Field label="Fecha y hora" type="datetime-local" defaultValue="2026-05-02T14:00"/>
          <Field label="URL del live" defaultValue="https://youtube.com/live/xyz"/>
          <Field label="Plan mínimo" type="select" options={['Free','Starter','Pro','Elite']} defaultValue="Pro"/>
          <Toggle label="Activar banner en home" defaultChecked/>
          <div style={{ display:'flex', gap:10, marginTop:6 }}>
            <button style={adminBtn(true)}>Publicar</button>
            <button style={adminBtn(false)}>Programar</button>
          </div>
        </div>
      </div>
      <div style={adminCard}>
        <div style={adminLabel}>Vista previa del banner</div>
        <div style={{ marginTop:10, padding:'14px 16px', background:'rgba(16,185,129,.06)', borderLeft:'3px solid #10b981', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.4em', color:'#10b981', textTransform:'uppercase', marginBottom:6 }}>◉ Próximo Meet</div>
            <div style={{ font:'700 13px/1.3 var(--font-sans)', color:'#f5f5f5' }}>Live Trading Sesión Londres</div>
            <div style={{ font:'400 11px/1 var(--font-mono)', color:'#a3a3a3', letterSpacing:'.2em', textTransform:'uppercase', marginTop:6 }}>02 May · 14:00 ART</div>
          </div>
          <div style={{ font:'900 italic 10px/1 var(--font-sans)', letterSpacing:'.3em', color:'#fbbf24', textTransform:'uppercase' }}>en 02d 04h</div>
        </div>
      </div>
    </div>
  );
}

// ---------- BIAS EDITOR ----------
function BiasEditor() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:18 }}>
      <div style={adminCard}>
        <div style={adminLabel}>Nuevo Bias</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Field label="Par / Activo" defaultValue="XAUUSD"/>
          <Field label="Sesgo" type="select" options={['Alcista','Bajista','Neutral / Doji','Range']} defaultValue="Bajista"/>
          <Field label="Sesión" type="select" options={['Asia','Londres','NY AM','NY PM']} defaultValue="Londres"/>
          <Field label="Análisis (markdown)" type="textarea" rows={6} defaultValue="Liquidez tomada en 2435 — esperamos retest hacia el FVG 4H y caza de stops por debajo de 2418."/>
          <DropZone label="Video corto del bias (opcional)" hint="MP4 / MOV — máx 200MB"/>
          <Field label="Plan mínimo" type="select" options={['Pro','Elite']} defaultValue="Pro"/>
          <div style={{ display:'flex', gap:10 }}>
            <button style={adminBtn(true)}>Publicar bias</button>
            <button style={adminBtn(false)}>Guardar borrador</button>
          </div>
        </div>
      </div>
      <div style={adminCard}>
        <div style={adminLabel}>Bias recientes</div>
        <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
          {[
            ['XAUUSD','Bajista','#ef4444','Hoy · 09:14'],
            ['EURUSD','Alcista','#10b981','Ayer · 08:30'],
            ['NAS100','Range','#fbbf24','27 Abr · 14:00'],
            ['BTCUSD','Bajista','#ef4444','26 Abr · 11:00'],
          ].map(([pair,dir,c,t]) => (
            <li key={pair+t} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:'rgba(10,10,10,.5)', borderLeft:`3px solid ${c}` }}>
              <div>
                <div style={{ font:'900 italic 13px/1 var(--font-sans)', color:'#f5f5f5', letterSpacing:'.05em' }}>{pair}</div>
                <div style={{ font:'700 10px/1 var(--font-sans)', color:c, letterSpacing:'.2em', textTransform:'uppercase', marginTop:4 }}>{dir}</div>
              </div>
              <div style={{ font:'400 10px/1 var(--font-mono)', color:'#737373', letterSpacing:'.2em', textTransform:'uppercase' }}>{t}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------- CLASSES EDITOR ----------
function ClassesEditor() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:18 }}>
      <div style={adminCard}>
        <div style={adminLabel}>Subir nueva clase / replay</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Field label="Título" defaultValue="Clase 14 — Liquidity Delivery"/>
          <Field label="Módulo" type="select" options={['Fundamentos','Microestructura','ML aplicado','Risk Management','Live trading']} defaultValue="Microestructura"/>
          <Field label="Duración" defaultValue="48 min"/>
          <Field label="Plan mínimo" type="select" options={['Starter','Pro','Elite']} defaultValue="Elite"/>
          <div style={{ gridColumn:'1 / -1' }}>
            <Field label="Descripción" type="textarea" rows={3} defaultValue="Cómo identificar el delivery de liquidez en sesiones de Londres y NY usando footprint y order flow."/>
          </div>
          <div style={{ gridColumn:'1 / -1' }}>
            <DropZone label="Archivo de video" hint="MP4 — se sube a Mux con signed URLs · máx 4GB" big/>
          </div>
          <div style={{ gridColumn:'1 / -1' }}>
            <DropZone label="Thumbnail" hint="JPG / PNG — 1920×1080"/>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:16 }}>
          <button style={adminBtn(true)}>Publicar clase</button>
          <button style={adminBtn(false)}>Guardar como borrador</button>
        </div>
      </div>
    </div>
  );
}

// ---------- SIGNALS EDITOR ----------
function SignalsEditor() {
  const rows = [
    ['EURUSD','LONG','1.0832','1.0815','1.0890','PRO','15m','◎ activa','#10b981'],
    ['XAUUSD','SHORT','2438','2445','2418','ELITE','1H','◉ ejecutada','#a3a3a3'],
    ['BTCUSD','LONG','61240','60800','62500','PRO','4H','◎ activa','#10b981'],
    ['NAS100','SHORT','17840','17900','17680','ELITE','15m','✕ stop','#ef4444'],
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:18 }}>
      <div style={adminCard}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14 }}>
          <div style={adminLabel}>Nueva señal</div>
          <button style={adminBtn(true)}>＋ Crear señal</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:10 }}>
          <Field label="Par" defaultValue="EURUSD" tight/>
          <Field label="Dir" type="select" options={['LONG','SHORT']} defaultValue="LONG" tight/>
          <Field label="Entry" defaultValue="1.0832" tight/>
          <Field label="SL" defaultValue="1.0815" tight/>
          <Field label="TP" defaultValue="1.0890" tight/>
          <Field label="TF" type="select" options={['1m','5m','15m','1H','4H','1D']} defaultValue="15m" tight/>
          <Field label="Plan" type="select" options={['Pro','Elite']} defaultValue="Pro" tight/>
        </div>
      </div>
      <div style={adminCard}>
        <div style={adminLabel}>Histórico</div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>{['Par','Dir','Entry','SL','TP','Plan','TF','Estado'].map(h => (
              <th key={h} style={{ textAlign:'left', padding:'10px 8px', font:'700 9px/1 var(--font-sans)', letterSpacing:'.3em', color:'#737373', textTransform:'uppercase', borderBottom:'1px solid rgba(38,38,38,.6)' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i} style={{ borderBottom:'1px solid rgba(38,38,38,.4)' }}>
                {r.slice(0,7).map((c,j) => (
                  <td key={j} style={{ padding:'10px 8px', font:'400 12px/1 var(--font-mono)', color: j===1 ? (c==='LONG'?'#10b981':'#ef4444') : '#d4d4d4', letterSpacing:'.1em' }}>{c}</td>
                ))}
                <td style={{ padding:'10px 8px', font:'700 10px/1 var(--font-sans)', color:r[8], letterSpacing:'.2em', textTransform:'uppercase' }}>{r[7]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- CERTS EDITOR ----------
function CertsEditor() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <DropZone label="Subir nuevos certificados" hint="Arrastrá imágenes — JPG / PNG · se publica al instante" big/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {[1,2,3,4,5,6,7,8].map(n => (
          <div key={n} style={{ ...adminCard, padding:0, position:'relative' }}>
            <div style={{ aspectRatio:'4/5', background:`linear-gradient(135deg, rgba(16,185,129,.${10+n}) 0%, rgba(5,5,5,1) 100%)`, display:'flex', alignItems:'center', justifyContent:'center', font:'900 italic 32px/1 var(--font-sans)', color:'rgba(16,185,129,.4)' }}>
              ✦
            </div>
            <div style={{ padding:'10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(16,185,129,.12)' }}>
              <span style={{ font:'400 10px/1 var(--font-mono)', color:'#a3a3a3', letterSpacing:'.2em', textTransform:'uppercase' }}>cert-{String(n).padStart(2,'0')}</span>
              <button style={{ background:'none', border:'none', color:'#737373', cursor:'pointer', font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.3em', textTransform:'uppercase' }}>Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- REVIEWS EDITOR ----------
function ReviewsEditor() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <DropZone label="Subir capturas de testimonios" hint="Drag&drop de WhatsApp / Telegram screenshots" big/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[1,2,3,4,5,6].map(n => (
          <div key={n} style={{ ...adminCard, padding:0 }}>
            <div style={{ aspectRatio:'9/16', background:'#0a0a0a', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', color:'#262626', font:'900 italic 32px/1 var(--font-sans)' }}>
              ✧
              <div style={{ position:'absolute', top:8, left:8, padding:'3px 8px', background:'rgba(16,185,129,.15)', border:'1px solid #10b981', font:'900 italic 8px/1 var(--font-sans)', color:'#10b981', letterSpacing:'.3em', textTransform:'uppercase' }}>publicado</div>
            </div>
            <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(16,185,129,.12)', display:'flex', justifyContent:'space-between' }}>
              <span style={{ font:'400 10px/1 var(--font-mono)', color:'#a3a3a3', letterSpacing:'.2em', textTransform:'uppercase' }}>review-{String(n).padStart(2,'0')}</span>
              <span style={{ font:'400 10px/1 var(--font-mono)', color:'#525252', letterSpacing:'.2em' }}>2.1MB</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- STUDENTS / PAYMENTS / PLANS ----------
function StudentsTable() {
  const rows = [
    ['Lucas T.','lucas@keyrules.io','Elite','30 Nov 2026','#10b981'],
    ['Martina P.','m.parra@gmail.com','Pro','12 May 2026','#10b981'],
    ['Diego R.','dieg@trade.com','Elite','03 Abr 2027','#10b981'],
    ['Sofía A.','s.alza@hotmail.com','Starter','—','#ef4444'],
    ['Ezequiel M.','ezequielm@me.com','Pro','22 May 2026','#fbbf24'],
  ];
  return (
    <div style={adminCard}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14 }}>
        <div style={adminLabel}>Alumnos · 247 totales</div>
        <input placeholder="Buscar alumno..." style={{ ...adminInput, width:240 }}/>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>{['Nombre','Email','Plan','Vence','Estado','Acción'].map(h => (
            <th key={h} style={{ textAlign:'left', padding:'10px 8px', font:'700 9px/1 var(--font-sans)', letterSpacing:'.3em', color:'#737373', textTransform:'uppercase', borderBottom:'1px solid rgba(38,38,38,.6)' }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i} style={{ borderBottom:'1px solid rgba(38,38,38,.4)' }}>
              <td style={{ padding:'12px 8px', font:'700 13px/1 var(--font-sans)', color:'#f5f5f5' }}>{r[0]}</td>
              <td style={{ padding:'12px 8px', font:'400 12px/1 var(--font-mono)', color:'#a3a3a3' }}>{r[1]}</td>
              <td style={{ padding:'12px 8px' }}>
                <span style={{ padding:'3px 9px', background:'rgba(16,185,129,.10)', borderLeft:'3px solid #10b981', font:'900 italic 9px/1 var(--font-sans)', color:'#10b981', letterSpacing:'.3em', textTransform:'uppercase' }}>{r[2]}</span>
              </td>
              <td style={{ padding:'12px 8px', font:'400 12px/1 var(--font-mono)', color:'#d4d4d4', letterSpacing:'.1em' }}>{r[3]}</td>
              <td style={{ padding:'12px 8px' }}><span style={{ width:8, height:8, borderRadius:'50%', background:r[4], display:'inline-block', boxShadow:`0 0 8px ${r[4]}` }}/></td>
              <td style={{ padding:'12px 8px' }}>
                <button style={{ background:'none', border:'1px solid rgba(16,185,129,.4)', color:'#10b981', padding:'4px 10px', font:'900 italic 9px/1 var(--font-sans)', letterSpacing:'.2em', textTransform:'uppercase', cursor:'pointer' }}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function PaymentsTable() {
  const rows = [
    ['30 Abr','Diego R.','Elite anual','USD 1.200','MercadoPago','✓'],
    ['29 Abr','Martina P.','Pro mensual','USD 89','Stripe','✓'],
    ['28 Abr','Joaquín L.','Starter','USD 29','Crypto USDT','✓'],
    ['27 Abr','Tamara C.','Pro mensual','USD 89','Stripe','✕'],
  ];
  return (
    <div style={adminCard}>
      <div style={adminLabel}>Pagos · últimos 30 días</div>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>{['Fecha','Alumno','Plan','Monto','Método','Estado'].map(h => (
            <th key={h} style={{ textAlign:'left', padding:'10px 8px', font:'700 9px/1 var(--font-sans)', letterSpacing:'.3em', color:'#737373', textTransform:'uppercase', borderBottom:'1px solid rgba(38,38,38,.6)' }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i} style={{ borderBottom:'1px solid rgba(38,38,38,.4)' }}>
              {r.slice(0,4).map((c,j) => <td key={j} style={{ padding:'12px 8px', font:'400 12px/1 var(--font-mono)', color: j===3 ? '#10b981' : '#d4d4d4', letterSpacing:'.1em' }}>{c}</td>)}
              <td style={{ padding:'12px 8px', font:'400 11px/1 var(--font-sans)', color:'#a3a3a3' }}>{r[4]}</td>
              <td style={{ padding:'12px 8px', font:'900 italic 12px/1 var(--font-sans)', color: r[5]==='✓' ? '#10b981' : '#ef4444' }}>{r[5]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function PlansEditor() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
      {['Starter','Pro','Elite'].map((p,i) => (
        <div key={p} style={{ ...adminCard, borderColor: i===2 ? '#10b981' : 'rgba(16,185,129,.18)' }}>
          <div style={adminLabel}>Plan {p}</div>
          <Field label="Precio mensual (USD)" defaultValue={['29','89','249'][i]}/>
          <div style={{ height:10 }}/>
          <Field label="Precio anual (USD)" defaultValue={['290','890','2490'][i]}/>
          <div style={{ height:10 }}/>
          <Field label="Features (uno por línea)" type="textarea" rows={6} defaultValue={['Señales semanales\nBias semanal\nAcceso al canal','Señales diarias\nBias diario\nReplays\nCheckin grupal','Todo Pro\nOracle MT5\nSesiones live 1:1\nReview de setups\nLibro KeyWick'][i]}/>
          <div style={{ height:14 }}/>
          <Toggle label="Visible en landing" defaultChecked/>
          <Toggle label="Marcar como recomendado" defaultChecked={i===2}/>
        </div>
      ))}
    </div>
  );
}

// ---------- PRIMITIVES ----------
function Field({ label, type='text', defaultValue='', options=[], rows=3, tight }) {
  return (
    <div>
      <label style={{ ...adminLabel, fontSize: tight ? 8 : 9 }}>{label}</label>
      {type === 'textarea' ? (
        <textarea defaultValue={defaultValue} rows={rows} style={{ ...adminInput, resize:'vertical', fontFamily:'var(--font-sans)' }}/>
      ) : type === 'select' ? (
        <select defaultValue={defaultValue} style={adminInput}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} defaultValue={defaultValue} style={adminInput}/>
      )}
    </div>
  );
}
function Toggle({ label, defaultChecked }) {
  const [on, setOn] = useAdminState(!!defaultChecked);
  return (
    <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'6px 0' }}>
      <span onClick={() => setOn(v => !v)} style={{
        width: 36, height: 20, background: on ? '#10b981' : '#262626',
        position:'relative', transition:'background 200ms',
      }}>
        <span style={{
          position:'absolute', top:2, left: on ? 18 : 2,
          width:16, height:16, background:'#000',
          transition:'left 200ms cubic-bezier(.4,0,.2,1)',
        }}/>
      </span>
      <span style={{ font:'700 11px/1 var(--font-sans)', color:'#d4d4d4', letterSpacing:'.15em', textTransform:'uppercase' }}>{label}</span>
    </label>
  );
}
function DropZone({ label, hint, big }) {
  const [hover, setHover] = useAdminState(false);
  return (
    <div>
      {label && <label style={adminLabel}>{label}</label>}
      <div
        onDragEnter={() => setHover(true)}
        onDragLeave={() => setHover(false)}
        onDrop={e => { e.preventDefault(); setHover(false); }}
        onDragOver={e => e.preventDefault()}
        style={{
          padding: big ? '40px 20px' : '24px 20px',
          background: hover ? 'rgba(16,185,129,.08)' : 'rgba(10,10,10,.5)',
          border: `1.5px dashed ${hover ? '#10b981' : 'rgba(64,64,64,.6)'}`,
          textAlign:'center',
          transition:'all 200ms',
          cursor:'pointer',
        }}>
        <div style={{ font:'900 italic 22px/1 var(--font-sans)', color: hover ? '#10b981' : '#525252', marginBottom:8 }}>↓</div>
        <div style={{ font:'900 italic 11px/1 var(--font-sans)', color: hover ? '#10b981' : '#a3a3a3', letterSpacing:'.3em', textTransform:'uppercase', marginBottom:6 }}>
          Arrastrá archivos aquí
        </div>
        <div style={{ font:'400 11px/1 var(--font-mono)', color:'#525252', letterSpacing:'.15em', textTransform:'uppercase' }}>{hint}</div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminShell });
