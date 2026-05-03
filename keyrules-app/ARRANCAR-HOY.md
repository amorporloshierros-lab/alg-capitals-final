# Arrancar el bias HOY — pasos exactos

## 1. Crear las tablas en Supabase

1. Ir a https://supabase.com/dashboard → tu proyecto
2. SQL Editor → New query
3. Pegar el contenido de `supabase/schema.sql`
4. Click "Run" (▶)

## 2. Darte rol admin

En el mismo SQL Editor, corré esto (cambiá el email):

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'l.lanzalot@pmdarquitectura.com';
```

(Si todavía no te registraste, hacé el paso 4 primero y después volvé acá)

## 3. Configurar redirect URL en Supabase Auth

1. Supabase → Authentication → URL Configuration
2. **Site URL**: `http://localhost:3000` (dev) o tu dominio en producción
3. **Redirect URLs**: agregar `http://localhost:3000/auth/callback`

## 4. Levantar el servidor local

```bash
cd keyrules-app
pnpm dev
```

Abrir http://localhost:3000

## 5. Registrarte

1. Ir a http://localhost:3000/signup
2. Crear cuenta con tu email
3. Confirmar el email (revisar bandeja)
4. Correr el `UPDATE profiles SET role = 'admin'...` del paso 2

## 6. Publicar el primer bias

1. Ir a http://localhost:3000/admin/bias
2. Seleccioná el par (XAUUSD por default)
3. Elegí el sesgo (Alcista / Bajista / Neutral / Range)
4. Elegí la sesión
5. Escribí el análisis
6. Activá "Publicar ahora"
7. Click "Publicar bias"

## 7. Verlo como alumno

Ir a http://localhost:3000/portal/bias

---

## URLs clave

| Ruta | Descripción |
|------|-------------|
| `/login` | Login |
| `/signup` | Registro |
| `/admin/bias` | Panel admin — Bias Diario |
| `/portal/bias` | Vista del alumno |

---

## Si algo falla

**Error "relation bias does not exist"** → El SQL no se corrió. Paso 1.

**Error "permission denied"** → El role admin no se seteó. Paso 2.

**Redirect loop en /admin** → Cookie de sesión corrupta. Ctrl+Shift+Delete en el browser → borrar cookies de localhost.
