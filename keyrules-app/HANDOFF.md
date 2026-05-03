# Handoff — KeyRules × ALG Capitals · Versión funcional

> Paquete de handoff a **Claude Code** para portar el prototipo HTML a una app **Next.js + Supabase + Vercel** con panel de administración funcional.

---

## 🎯 Objetivo

Convertir el prototipo HTML actual en una **aplicación web funcional** con:

1. **Landing pública** — idéntica al diseño actual (animaciones, Matrix, vela, transiciones).
2. **Portal Alumnos** — protegido por auth, datos reales (ya no simulados).
3. **Panel Admin** — solo para Lucas (`/admin`), donde sube/edita TODO sin tocar código.

---

## 🧱 Stack

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR, route handlers para webhooks, Vercel-friendly |
| Estilos | **Tailwind CSS + CSS variables de `colors_and_type.css`** | Mantener tokens de marca |
| Auth + DB + Storage | **Supabase** (Postgres + RLS + Auth + Storage) | Todo en uno, RLS para roles |
| Pagos | **MercadoPago + Stripe + crypto manual** | LatAm + internacional |
| Video | **Mux** (signed playback URLs) | Replays protegidos por plan |
| Email | **Resend** | Transaccionales |
| Deploy | **Vercel** | 1-click, edge |
| Analytics | **Posthog** | Conversión por plan |

---

## 📁 Estructura sugerida del repo Next.js

```
keyrules-app/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  ← Landing (port de Landing.jsx + Chrome.jsx)
│   │   ├── planes/page.tsx
│   │   ├── testimonios/page.tsx
│   │   └── adn/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot/page.tsx
│   ├── portal/                        ← Portal Alumnos (protegido)
│   │   ├── layout.tsx                 ← gate de auth
│   │   ├── page.tsx                   ← Dashboard del alumno
│   │   ├── academia/page.tsx
│   │   ├── bias/page.tsx
│   │   └── signals/page.tsx
│   ├── admin/                         ← Panel Admin (solo rol=admin)
│   │   ├── layout.tsx                 ← AdminShell con Sidebar
│   │   ├── page.tsx                   ← Overview
│   │   ├── meet/page.tsx
│   │   ├── bias/page.tsx
│   │   ├── classes/page.tsx
│   │   ├── signals/page.tsx
│   │   ├── certs/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── students/page.tsx
│   │   ├── payments/page.tsx
│   │   └── plans/page.tsx
│   └── api/
│       ├── webhooks/
│       │   ├── mercadopago/route.ts
│       │   └── stripe/route.ts
│       └── mux/sign/route.ts
├── components/
│   ├── coin-intro.tsx                 ← port CoinIntro.jsx + MatrixRain
│   ├── chrome/
│   │   ├── navbar.tsx
│   │   ├── live-chart.tsx
│   │   ├── meet-banner.tsx
│   │   └── chatbot-fab.tsx            ← conectado a backend de Lucas
│   └── admin/
│       ├── sidebar.tsx
│       ├── topbar.tsx
│       ├── drop-zone.tsx
│       ├── field.tsx
│       └── toggle.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   ├── client.ts
│   │   └── admin.ts
│   ├── mux.ts
│   └── auth.ts
├── styles/
│   └── tokens.css                     ← copy de colors_and_type.css
└── prototype-reference/               ← JSX originales como referencia visual
    ├── CoinIntro.jsx
    ├── Chrome.jsx
    ├── Landing.jsx
    ├── Screens.jsx
    ├── AdminDashboard.jsx
    └── ...
```

---

## 🗄️ Schema de DB (Supabase / Postgres)

```sql
-- Roles
create type user_role as enum ('free','starter','pro','elite','admin');
create type plan_tier as enum ('starter','pro','elite');
create type signal_status as enum ('active','executed','stop','tp');
create type bias_dir as enum ('alcista','bajista','neutral','range');

-- Profiles
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null unique,
  name text,
  role user_role default 'free',
  plan plan_tier,
  plan_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Bias diario
create table bias (
  id uuid primary key default gen_random_uuid(),
  pair text not null,
  direction bias_dir not null,
  session text,
  analysis_md text,
  video_url text,
  min_plan plan_tier default 'pro',
  published_at timestamptz,
  created_at timestamptz default now(),
  created_by uuid references profiles(id)
);

-- Clases / Replays
create table classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text,
  duration_min int,
  description text,
  mux_playback_id text,
  mux_asset_id text,
  thumbnail_url text,
  min_plan plan_tier default 'pro',
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Señales
create table signals (
  id uuid primary key default gen_random_uuid(),
  pair text not null,
  direction text check (direction in ('LONG','SHORT')),
  entry numeric not null,
  sl numeric not null,
  tp numeric not null,
  timeframe text,
  min_plan plan_tier default 'pro',
  status signal_status default 'active',
  posted_at timestamptz default now()
);

-- Testimonios y certificados (imágenes en Storage)
create table media_items (
  id uuid primary key default gen_random_uuid(),
  kind text check (kind in ('certificate','review')),
  storage_path text not null,
  caption text,
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Próximo Meet
create table meet_config (
  id int primary key default 1,
  title text,
  date_iso timestamptz,
  url text,
  min_plan plan_tier default 'pro',
  active boolean default true,
  updated_at timestamptz default now()
);

-- Pagos
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  plan plan_tier,
  amount_usd numeric,
  method text,
  external_id text,
  status text,
  paid_at timestamptz default now()
);

-- Journal del alumno (privado)
create table journal_trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  pair text,
  direction text,
  entry numeric, sl numeric, tp numeric,
  result_pct numeric,
  notes text,
  taken_at timestamptz default now()
);

-- Progreso de curso
create table class_progress (
  user_id uuid references profiles(id) on delete cascade,
  class_id uuid references classes(id) on delete cascade,
  completed_at timestamptz,
  primary key (user_id, class_id)
);
```

### RLS (Row Level Security)

- `profiles` → user lee/edita el suyo; admin lee todos.
- `bias`, `classes`, `signals` → SELECT permitido si `auth.user.plan >= min_plan`. INSERT/UPDATE/DELETE solo `admin`.
- `media_items`, `meet_config` → SELECT público. WRITE solo `admin`.
- `payments` → user lee los suyos, admin lee todos.
- `journal_trades`, `class_progress` → solo el user dueño.

### Storage buckets
- `assets-public/` (logos, libros, brand) — público
- `certificates/` y `reviews/` — público read, write solo admin
- `bias-videos/` y `class-thumbnails/` — public read si plan permite (o signed URLs)
- Videos de clases → **Mux**, no Storage

---

## 🎨 Reglas de diseño INTOCABLES

Copiadas del `CLAUDE.md` raíz del proyecto. Resumen:

1. **NO cambiar paleta**: `#050505` + `#10b981`.
2. **NO cambiar tipos**: Geist + Geist Mono.
3. **NO redondear corners** más de `2px`.
4. **NO usar emoji** en la UI principal (sí símbolos: ◉ ◇ ▲ ▼ ● ◎ ✦ ✧).
5. **NO meter filler content**.
6. **SÍ conservar**: intro de moneda + Matrix rain, vela animada del chatbot que reacciona al scroll, scroll reveals bidireccionales, transiciones cinemáticas entre pantallas, banner Próximo Meet editable.
7. **Voz visual**: dark, cockpit/Bloomberg, glows esmeralda puntuales (no gradientes pasteles).

---

## 🔌 Integraciones obligatorias

### Pagos
- **MercadoPago Checkout Pro** → webhook `/api/webhooks/mercadopago` que actualiza `profiles.plan` y `plan_expires_at`.
- **Stripe Checkout** → webhook `/api/webhooks/stripe`.
- **Crypto** → flujo manual: alumno paga, Lucas confirma desde Admin → Pagos.

### Video
- **Mux**: al subir un MP4 desde Admin → Clases, se hace upload directo a Mux, se guardan `playback_id` + `asset_id` en `classes`. La playback URL se firma server-side en `/api/mux/sign?id=...` validando plan del usuario.

### Email (Resend)
- Confirmación de pago.
- Aviso de expiración (cron job 7 días antes).
- Welcome con link al Portal.

### Chatbot
El prototipo apunta a `https://outsell-crimson-cheese.ngrok-free.dev/api/chat` (backend custom de Lucas). En producción:
- Si Lucas mantiene su backend → solo reemplazar URL por dominio fijo.
- Si se reemplaza con Claude API → endpoint propio en Next.js que hable con Anthropic API server-side (no exponer key).

---

## 🛡️ Auth y roles

- Supabase Auth (email + password, opcional Google OAuth).
- Middleware en `app/admin/layout.tsx` y `app/portal/layout.tsx` que valida sesión y rol.
- Solo Lucas tiene `role='admin'` (set manual en DB la primera vez).

---

## 📦 Qué incluye este paquete

```
handoff/
├── HANDOFF.md                ← este archivo
├── PROMPT-CLAUDE-CODE.txt    ← prompt para pegar directo en Claude Code
├── CLAUDE.md                 ← contexto de marca y reglas (copia del raíz)
├── colors_and_type.css       ← tokens de diseño
├── prototype-reference/      ← TODOS los .jsx del diseño actual
│   ├── marketing/
│   │   ├── index.html
│   │   ├── CoinIntro.jsx
│   │   ├── Chrome.jsx
│   │   ├── Landing.jsx
│   │   └── Screens.jsx
│   ├── dashboard/            ← Portal Alumnos (mockup)
│   └── admin/
│       └── AdminDashboard.jsx ← panel admin (mockup visual)
└── assets/                   ← logos, certificados de muestra, libro
```

---

## ✅ Checklist de handoff

- [ ] Inicializar repo Next.js 15 + TS + Tailwind
- [ ] Copiar `colors_and_type.css` a `styles/tokens.css` y mapear a Tailwind config
- [ ] Crear proyecto Supabase, correr el schema SQL, configurar RLS
- [ ] Portar landing pública conservando animaciones (CoinIntro, MatrixRain, LiveChart, ChatBotFab vela, scroll reveals)
- [ ] Portar Portal Alumnos con datos reales (en lugar de DashSimData)
- [ ] Implementar `/admin` completo replicando el mockup de `AdminDashboard.jsx`
- [ ] Integrar Mux para uploads de video
- [ ] Integrar MercadoPago + Stripe webhooks
- [ ] Email transaccional con Resend
- [ ] Deploy a Vercel + dominio
- [ ] Crear primer usuario admin en Supabase

---

## 🚀 Cómo arrancar el handoff

1. Descargar este paquete.
2. Crear repo nuevo en GitHub: `keyrules-app`.
3. Copiar carpeta `prototype-reference/` al repo.
4. Copiar `CLAUDE.md`, `HANDOFF.md`, `colors_and_type.css` al raíz.
5. Abrir Claude Code en ese repo.
6. Pegar el contenido de `PROMPT-CLAUDE-CODE.txt` como primer mensaje.
7. Iterar.

---

**Contacto:** Lucas Tripodoro · founder de KeyRules × ALG Capitals
