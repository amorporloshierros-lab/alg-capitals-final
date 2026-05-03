# KeyRules × ALG Capitals — Contexto del Proyecto

> Este archivo lo lee Claude automáticamente en cada chat de este proyecto/repo.
> Mantenlo actualizado cuando cambien decisiones clave.

---

## 🎯 El negocio

**Marca:** KeyRules × ALG Capitals (también "Quantz")
**Founder:** Lucas Tripodoro
**Propuesta:** Educación + señales de trading cuántico institucional. No "trading minorista con esperanza" — metodología basada en Machine Learning, microestructura de mercado y liquidity delivery.

**Tagline:** *"Deja de tradear con sistema minorista y convierte tu estrategia a Quantz"*

**Canales:**
- Telegram (canal de señales y meets)
- YouTube (live trading, clases)
- Portal web (este proyecto)

---

## 📦 Planes comerciales

1. **Starter** — acceso básico, señales semanales
2. **Pro** — señales diarias, bias, replays
3. **Elite** ⭐ (recomendado) — todo lo anterior + Oracle MT5, sesiones live, revisión de setups 1:1
4. **Mentorías personalizadas**
5. **Certificaciones** (con certificados descargables)
6. **Libro: KeyWick** (recurso educativo)

Pagos aceptados (mockup actual): FTMO, FundedNext, Alpha, crypto, transferencia.

---

## 🎨 Sistema de diseño

**Paleta (NO TOCAR — es la identidad de marca):**
- Background: `#050505` (negro carbón)
- Surface: `#171717` / `rgba(23,23,23,.6)`
- Primary accent: `#10b981` (esmeralda institucional) → glow `rgba(16,185,129,.5)`
- Bear/alert: `#ef4444`
- Doji/warning: `#fbbf24`
- Text primary: `#f5f5f5`
- Text muted: `#a3a3a3` / `#737373` / `#525252`
- Border subtle: `rgba(16,185,129,.15-.3)`

**Tipografía (definida en `colors_and_type.css`):**
- `--font-sans`: Geist (display, headings, CTAs)
- `--font-mono`: Geist Mono (datos numéricos, timestamps, tickers)
- Style dominante: **bold italic mayúscula con letter-spacing amplio** (`.2em` – `.5em`)
- Peso: 900 para headings, 700 para datos, 400 para cuerpo

**Voz visual:**
- Institucional, dark, de cockpit/Bloomberg
- Corners **rectos** (no rounded corners grandes — max `rx=2` en shapes)
- Glows esmeralda puntuales, no gradientes rosados tipo startup
- Divisores tipo `|` con color `#262626`
- Chips con `border-left` de 4px esmeralda + uppercase + letter-spacing

---

## 🏗️ Arquitectura actual (prototipo HTML)

```
/
├── CLAUDE.md              ← este archivo
├── README.md              ← instrucciones técnicas
├── colors_and_type.css    ← tokens globales
├── assets/                ← logos, libros, testimonios, badges
│   ├── logo-sello.jpg
│   ├── libro-keywick.jpg
│   ├── alpha.png, ftmo.png, fundednext.png
│   ├── certificado-{1,2,3}.jpg
│   └── comentario-{1,2,3,4}.jpg
└── ui_kits/
    ├── marketing/         ← LANDING PÚBLICA (punto de entrada)
    │   ├── index.html     ← monta toda la app
    │   ├── CoinIntro.jsx  ← intro cinemática (moneda gira y cae)
    │   ├── Chrome.jsx     ← Navbar, LiveChart ECG, NextMeetBanner, ChatBotFab (vela)
    │   ├── Landing.jsx    ← Hero, Plans, TerminalPanel, Footer
    │   └── Screens.jsx    ← Certificados, ADN, Auditoria
    ├── dashboard/         ← PORTAL ALUMNOS (ya diseñado como prototipo)
    │   ├── DashPrimitives.jsx  ← Panel, Sparkline, Meter, etc
    │   ├── DashSimData.jsx     ← simulación de equity, trades, ticks
    │   ├── DashPanels.jsx      ← Equity, Bias, Journal, Checklist
    │   └── DashPanelsB.jsx     ← Challenge, Licenses, Academy, Risk, Signals
    └── app/               ← (versión móvil iOS, no tocar para el handoff)
```

**Stack del prototipo (LIMITACIONES):**
- HTML + React 18 + Babel inline (via CDN)
- Sin bundler, sin backend
- Todo el "live data" es simulado con `setInterval`
- Auth/DB/Pagos: **no existen, son mocks visuales**

---

## ✨ Features clave ya diseñadas

### Landing (home)
- **Intro de moneda**: al cargar, moneda gira y cae desde arriba con shockwave; "Domina el Algoritmo" sale desde dentro. Dura ~3.5s. Se saltea automáticamente en visitas subsecuentes (sessionStorage).
- **Navbar**: logo con borde circular esmeralda que **rota horizontalmente según scroll**
- **Hero**: fondo con línea tipo ECG animada (random walk realista con volatilidad/regímenes/shocks, oscilaciones amplias), banner "Próximo Meet" configurable (`MEET_CONFIG` en `Chrome.jsx` — dateISO + url). Cambia estado: pre-meet (countdown) / en vivo (rojo) / pasado.
- **Botón "Acceso"** y **"Portal Alumnos"** del navbar → llevan al dashboard
- **ChatBotFab (vela japonesa)**: abajo-derecha, es una vela que reacciona al scroll:
  - Top: vela verde alcista con chip `▲ +X%`
  - Middle (~55%): **DOJI** (línea fina amarilla con chip `◇ DOJI`)
  - Bottom: vela roja bajista
  - Incluye animación periódica de saludo con brazos (derecho saluda, izquierdo sostiene burbuja de chat)
- **Scroll reveals bidireccionales**: elementos suben/entran desde izquierda/derecha/zoom con blur al aparecer en viewport — Y **se desarman al salir** (scroll hacia arriba también anima)
- **Transiciones entre pantallas**: al navegar entre Home/Planes/Testimonios/ADN/Portal hay fade + wipe esmeralda horizontal + re-entrada animada

### Dashboard (Portal Alumnos — mockup)
- Equity curve con P&L simulada, drawdown, profit factor, win rate
- Ticker multi-asset con precios que driftean en vivo
- Licencias: Oracle MT5, Indicadores (con estado/expiración)
- Challenge tracker (progreso FTMO/FundedNext)
- Bias diario, journal de trades, checklist de entrada
- Academia (módulos del curso), risk panel, signals

---

## 🚀 Qué falta para ser FUNCIONAL (scope del handoff)

Esto es lo que hay que implementar con backend real:

### 1. Autenticación real
- Login / signup / password recovery
- OAuth (Google, opcional)
- Session management con refresh tokens
- Roles: `free`, `starter`, `pro`, `elite`, `admin`

### 2. Base de datos
- Usuarios (perfil, plan activo, fecha de expiración)
- Trades del journal (por usuario)
- Progreso de curso (módulos completados por usuario)
- Bias diarios (publicados por admin, leídos por alumnos según plan)
- Replays/meets (URLs protegidas por nivel de plan)
- Signals (con timestamps, pair, entry/SL/TP)

### 3. Pagos
- MercadoPago (Argentina, LatAm)
- Stripe (internacional)
- Crypto (opcional — USDT/BTC)
- Webhooks que activen/extiendan suscripciones automáticamente
- Emails transaccionales (confirmación de pago, expiración próxima)

### 4. Video hosting protegido
- Mux o Cloudflare Stream para replays (signed URLs)
- No YouTube público para contenido pago

### 5. Meet Banner dinámico
- Admin puede editar `dateISO` + `url` desde un panel (no requiere redeploy)
- O integración directa con Telegram API / YouTube API para detectar lives automáticamente

### 6. Chat bot real
- OpenAI/Claude API para el asistente Quantz
- Respuestas basadas en docs del curso + bias del día
- Historial de conversación por usuario

### 7. Panel admin
- CRUD de bias diarios, signals, módulos de curso
- Ver lista de alumnos, enviar notificaciones
- Métricas: conversión por plan, retención, churn

---

## 🧰 Stack recomendado para la versión funcional

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + CSS variables de `colors_and_type.css`
- **Auth + DB:** Supabase (Postgres + RLS + auth built-in)
- **Pagos:** MercadoPago SDK + Stripe + webhooks en route handlers
- **Video:** Mux (signed playback URLs)
- **Email:** Resend
- **Deployment:** Vercel
- **Analytics:** Posthog (eventos de conversión por plan)

---

## 📐 Reglas INTOCABLES para Claude

1. **NO cambiar la paleta de colores** (negro #050505 + esmeralda #10b981). La identidad visual está validada.
2. **NO cambiar las tipografías** (Geist + Geist Mono).
3. **NO reemplazar la intro de moneda** sin consultar — es signature del brand.
4. **NO redondear corners** más de `2px` en componentes principales.
5. **NO usar emoji** en la UI principal (sí se permiten símbolos geométricos: ◉ ◇ ▲ ▼ ● ◎).
6. **NO meter filler content**. Si una sección queda vacía, es problema de layout, no de copy inventado.
7. **SÍ mantener**: el "Próximo Meet" banner editable desde un solo lugar (`MEET_CONFIG`).
8. **SÍ mantener**: las scroll reveals bidireccionales (entra al scrollear abajo, sale al scrollear arriba).
9. **SÍ mantener**: el chatbot como vela japonesa que reacciona al scroll.
10. **Para Claude Code específicamente**: cuando portes al stack real (Next.js + Supabase), **conservá los JSX existentes como referencia visual** — tomalos como fuente de verdad del diseño y portálos a componentes TSX sin perder animaciones, colores ni comportamientos.

---

## 🗂️ Archivos clave para entender el diseño

Si sos un Claude nuevo leyendo esto, abrí en este orden:

1. `colors_and_type.css` — tokens globales
2. `ui_kits/marketing/index.html` — orchestration + transiciones de pantalla
3. `ui_kits/marketing/CoinIntro.jsx` — intro
4. `ui_kits/marketing/Chrome.jsx` — navbar + hero chart + chatbot vela + banner meet
5. `ui_kits/marketing/Landing.jsx` — hero copy + plans + terminal + footer
6. `ui_kits/marketing/Screens.jsx` — certificados, ADN, auditoria
7. `ui_kits/dashboard/*.jsx` — portal alumnos

---

## 📅 Estado actual (última actualización)

- ✅ Landing pública completa con todas las animaciones
- ✅ Portal alumnos como prototipo visual con data simulada
- ✅ Transiciones cinemáticas entre pantallas
- ✅ Scroll reveals bidireccionales
- ✅ Meet banner configurable (de momento, editando código)
- ⏳ **Siguiente**: handoff a Claude Code para implementar backend funcional

---

## 💬 Cómo trabajar con este proyecto

- **Pequeños cambios visuales**: seguir trabajando en este Claude (diseño).
- **Implementación funcional (auth, pagos, DB)**: abrir Claude Code con este repo, decirle *"leé CLAUDE.md y armá la versión Next.js + Supabase conservando todo el diseño"*.
- **Contenido del curso / bias / signals**: eso es trabajo de admin, no de código — se cargaría desde el panel admin una vez que exista.
