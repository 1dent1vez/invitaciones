# 🔍 AUDITORÍA AVANZADA DE RUTAS — Proyecto Invitaciones Digitales

> **Objetivo:** Identificar y corregir TODAS las rutas rotas de la aplicación tras las 3 fases de corrección.  
> **Scope:** Rutas públicas, rutas de admin, API routes, Server Actions, redirecciones, y navegación interna.  
> **Output:** `auditoria-rutas-report.md` con hallazgos clasificados + fixes aplicados.  
> **Regla:** NO tocar código que no esté roto. Solo diagnosticar, reportar, y corregir rutas fallidas.

---

## 🗺️ MAPA COMPLETO DE RUTAS DEL PROYECTO

### A. RUTAS PÚBLICAS (`src/app/(public)/`)

| Ruta | Método | Props/Params | Dependencias | Estado esperado |
|------|--------|-------------|--------------|-----------------|
| `/` | GET | — | Landing page | ✅ 200 |
| `/i/[slug]` | GET | `slug: string` | `generateMetadata`, template dinámico | ✅ 200 si PUBLICADA, ❌ 404 si BORRADOR |
| `/i/[slug]/rsvp` | POST/GET | `slug: string` | Formulario RSVP | ✅ 200 si PUBLICADA |
| `/contacto` | GET | — | Formulario de contacto | ✅ 200 |
| `/precios` | GET | — | Página de precios | ✅ 200 |

### B. RUTAS DE ADMIN (`src/app/(admin)/`)

| Ruta | Método | Props/Params | Middleware | Estado esperado |
|------|--------|-------------|------------|-----------------|
| `/admin/login` | GET/POST | — | Público | ✅ 200 |
| `/admin` | GET | — | Protegido (`/admin/*`) | ✅ 200 → redirect a `/admin/dashboard` |
| `/admin/dashboard` | GET | — | Protegido | ✅ 200 |
| `/admin/pedidos` | GET | — | Protegido | ✅ 200 |
| `/admin/pedidos/nuevo` | GET/POST | — | Protegido | ✅ 200 |
| `/admin/pedidos/[id]` | GET | `id: string` | Protegido | ✅ 200 |
| `/admin/pedidos/[id]/editar` | GET | `id: string` | Protegido | ✅ 200 |
| `/admin/clientes` | GET | — | Protegido | ✅ 200 |
| `/admin/clientes/[id]` | GET | `id: string` | Protegido | ✅ 200 |
| `/admin/analytics` | GET | — | Protegido | ✅ 200 |

### C. API ROUTES (`src/app/api/`)

| Ruta | Método | Props/Params | Estado esperado |
|------|--------|-------------|-----------------|
| `/api/auth/[...nextauth]` | GET/POST | — | ✅ 200 |
| `/api/upload` | POST | — | ✅ 200 |
| `/api/qr` | GET | `url: string` | ✅ 200 |
| `/api/rsvp` | POST | — | ✅ 200 |
| `/api/analytics` | POST | — | ✅ 200 |

### D. SERVER ACTIONS (dispersos en `actions.ts`)

| Action | Archivo | Parámetros | Estado esperado |
|--------|---------|-----------|-----------------|
| `crearPedidoAction` | `pedidos/actions.ts` | datos del pedido | ✅ Crea pedido con `estadoInvitacion: "BORRADOR"`, `slug: null` |
| `publicarInvitacionAction` | `pedidos/[id]/editar/actions.ts` | `pedidoId: string` | ✅ Genera slug, cambia a PUBLICADA |
| `savePedidoDatosAction` | `pedidos/[id]/editar/actions.ts` | `pedidoId, datos` | ✅ Guarda en `datosInvitacion` |
| `clonarPedidoAction` | `pedidos/[id]/actions.ts` | `pedidoId: string` | ✅ Clona con datos limpios |
| `eliminarPedidoAction` | `pedidos/actions.ts` | `pedidoId: string` | ✅ Soft delete o hard delete |
| `crearClienteAction` | `clientes/actions.ts` | datos del cliente | ✅ Crea cliente |
| `actualizarClienteAction` | `clientes/actions.ts` | `id, datos` | ✅ Actualiza cliente |

---

## 🔧 METODOLOGÍA DE AUDITORÍA

### Paso 1: Diagnóstico estático (sin ejecutar app)

Revisa archivo por archivo buscando estos patrones de rotura:

#### 1A. Rutas con `params` mal tipados (Next.js 14)

```typescript
// ❌ ROTO (Next.js 14 requiere await en params):
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
}

// ✅ CORRECTO:
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

**Archivos a revisar:**
- `src/app/(public)/i/[slug]/page.tsx`
- `src/app/(admin)/admin/pedidos/[id]/page.tsx`
- `src/app/(admin)/admin/pedidos/[id]/editar/page.tsx`
- `src/app/(admin)/admin/clientes/[id]/page.tsx`

#### 1B. `generateMetadata` con params mal tipados

```typescript
// ❌ ROTO:
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
}

// ✅ CORRECTO:
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

**Archivos a revisar:**
- `src/app/(public)/i/[slug]/page.tsx`
- `src/app/(admin)/admin/pedidos/[id]/page.tsx`

#### 1C. Server Actions con imports rotos

Busca imports de archivos que ya no existen o fueron renombrados:

```typescript
// ❌ ROTO (si se renombró):
import { savePedidoDatos } from "./actions";

// ✅ CORRECTO (verificar nombre real):
import { savePedidoDatosAction } from "./actions";
```

**Archivos a revisar:**
- `editor-client.tsx` → imports de actions
- `nuevo-pedido-client.tsx` → imports de actions
- `pedidos-client.tsx` → imports de actions
- `page.tsx` público → imports de templates

#### 1D. Templates con imports rotos

```typescript
// ❌ ROTO (si se movió/renombró):
import { CumplePremium } from "@/components/templates/cumpleanos/CumplePremium";

// Verificar que la ruta existe:
// src/components/templates/cumpleanos/CumplePremium.tsx
```

**Archivos a revisar:**
- `src/lib/templates.ts`
- `src/app/(public)/i/[slug]/page.tsx`
- Cualquier archivo que importe templates dinámicamente

#### 1E. Prisma queries con campos renombrados

```typescript
// ❌ ROTO (si aún usa datosJson):
const pedido = await prisma.pedido.findUnique({
  where: { id },
  select: { datosJson: true } // ← ya no existe
});

// ✅ CORRECTO:
const pedido = await prisma.pedido.findUnique({
  where: { id },
  select: { datosInvitacion: true }
});
```

**Archivos a revisar (grep por `datosJson`):**
```bash
grep -r "datosJson" src/ --include="*.ts" --include="*.tsx"
```

#### 1F. Zod schemas con campos faltantes

```typescript
// ❌ ROTO (si el schema no incluye nuevos campos):
const schema = z.object({
  nombres: z.string(), // ← campo de boda, no existe en cumpleaños
});

// ✅ CORRECTO (schema unificado):
const schema = z.object({
  nombres: z.string().optional(),
  nombre: z.string().optional(),
  // ... todos los campos posibles
});
```

**Archivos a revisar:**
- `editor-client.tsx` (schema de React Hook Form / Zod)
- `nuevo-pedido-client.tsx` (schema del wizard)

#### 1G. Middleware de autenticación

```typescript
// ❌ ROTO (si la ruta pública no está excluida):
// middleware.ts
export const config = {
  matcher: ["/admin/:path*"], // ← debe excluir /i/[slug], /api/, etc.
};
```

**Archivo a revisar:**
- `src/middleware.ts`

---

### Paso 2: Diagnóstico dinámico (ejecutar app)

#### 2A. Build de producción

```bash
npm run build 2>&1 | tee build.log
```

Buscar:
- `Error:` → cualquier error de compilación
- `Failed to compile` → errores de TypeScript/ESLint
- `Module not found` → imports rotos
- `Cannot find module` → dependencias faltantes
- `Type error` → errores de tipado

#### 2B. Iniciar servidor de desarrollo

```bash
npm run dev
```

Navegar manualmente a cada ruta y verificar:

**Rutas públicas:**
- [ ] `http://localhost:3000/` → Landing carga
- [ ] `http://localhost:3000/i/[slug-existente-publicado]` → Invitación carga
- [ ] `http://localhost:3000/i/[slug-existente-borrador]` → 404
- [ ] `http://localhost:3000/i/[slug-inventado]` → 404
- [ ] `http://localhost:3000/contacto` → Página carga
- [ ] `http://localhost:3000/precios` → Página carga

**Rutas de admin (requiere login):**
- [ ] `/admin/login` → Formulario carga
- [ ] `/admin/login` (POST con credenciales) → Redirect a `/admin/dashboard`
- [ ] `/admin/dashboard` → Métricas cargan
- [ ] `/admin/pedidos` → Kanban carga
- [ ] `/admin/pedidos/nuevo` → Wizard carga
- [ ] `/admin/pedidos/[id-existente]` → Detalle carga
- [ ] `/admin/pedidos/[id-existente]/editar` → Editor carga con datos
- [ ] `/admin/clientes` → Lista carga
- [ ] `/admin/clientes/[id-existente]` → Detalle carga

**Redirecciones:**
- [ ] `/admin` → redirect a `/admin/dashboard`
- [ ] `/admin/pedidos/nuevo` (POST exitoso) → redirect a `/admin/pedidos/[nuevo-id]/editar`
- [ ] `/admin/pedidos/[id]/editar` (click "Publicar") → redirect o refresh con URL pública

#### 2C. Server Actions (testear desde UI)

- [ ] Crear pedido en wizard → pedido creado con `estadoInvitacion: "BORRADOR"`, `slug: null`
- [ ] Guardar borrador en editor → datos guardados en `datosInvitacion`
- [ ] Publicar invitación → `slug` generado, `estadoInvitacion: "PUBLICADA"`, `urlPublica` generada
- [ ] Clonar pedido → nuevo pedido con datos limpios
- [ ] Eliminar pedido → pedido eliminado

#### 2D. API Routes

```bash
# Test con curl o navegador
curl http://localhost:3000/api/upload  # → método no permitido o auth required
curl http://localhost:3000/api/qr?url=test  # → imagen QR o JSON
curl -X POST http://localhost:3000/api/rsvp  # → crea RSVP o error de validación
```

---

### Paso 3: Consola del navegador

En cada página, abrir DevTools → Console y verificar:

- [ ] **No hay errores de React** (keys duplicadas, hooks fuera de orden, etc.)
- [ ] **No hay errores de red** (404 en assets, fuentes, imágenes)
- [ ] **No hay warnings de Next.js** (imágenes sin dimensions, etc.)
- [ ] **No hay errores de TypeScript en runtime** (acceso a propiedades de undefined)

Patrones comunes de error:
```
TypeError: Cannot read properties of undefined (reading 'nombre')
→ defaultValues no maneja `datosInvitacion` null/undefined

Warning: Each child in a list should have a unique "key" prop
→ Falta key en map de galería o itinerario

Failed to load resource: the server responded with a status of 404
→ Ruta de imagen o API incorrecta
```

---

## 📋 CHECKLIST DE RUTAS CRÍTICAS

### Rutas que DEBEN funcionar (P0 — Bloqueantes si fallan)

| # | Ruta | Método | Qué verificar | Estado |
|---|------|--------|--------------|--------|
| R1 | `/` | GET | Landing renderiza sin errores | ⬜ |
| R2 | `/admin/login` | GET/POST | Login funciona, sesión se crea | ⬜ |
| R3 | `/admin/dashboard` | GET | Métricas reales, no crash | ⬜ |
| R4 | `/admin/pedidos` | GET | Kanban carga, drag & drop funciona | ⬜ |
| R5 | `/admin/pedidos/nuevo` | GET/POST | Wizard crea pedido, redirige a editor | ⬜ |
| R6 | `/admin/pedidos/[id]/editar` | GET | Editor carga con datos, preview funciona | ⬜ |
| R7 | `/i/[slug]` | GET | Invitación pública renderiza template correcto | ⬜ |
| R8 | `publicarInvitacionAction` | POST | Genera slug, cambia estado, revalida | ⬜ |
| R9 | `savePedidoDatosAction` | POST | Guarda datos en `datosInvitacion` | ⬜ |
| R10 | `crearPedidoAction` | POST | Crea con `estadoInvitacion: "BORRADOR"` | ⬜ |

### Rutas importantes (P1 — Medios si fallan)

| # | Ruta | Método | Qué verificar | Estado |
|---|------|--------|--------------|--------|
| R11 | `/admin/clientes` | GET | Lista de clientes carga | ⬜ |
| R12 | `/admin/clientes/[id]` | GET | Detalle de cliente carga | ⬜ |
| R13 | `/admin/analytics` | GET | Gráficas de analytics cargan | ⬜ |
| R14 | `/i/[slug]/rsvp` | POST | RSVP se crea correctamente | ⬜ |
| R15 | `/api/upload` | POST | Subida a Cloudinary funciona | ⬜ |
| R16 | `/api/qr` | GET | QR se genera correctamente | ⬜ |
| R17 | `clonarPedidoAction` | POST | Clona con datos limpios | ⬜ |

### Rutas secundarias (P2 — Bajos si fallan)

| # | Ruta | Método | Qué verificar | Estado |
|---|------|--------|--------------|--------|
| R18 | `/contacto` | GET | Formulario de contacto carga | ⬜ |
| R19 | `/precios` | GET | Página de precios carga | ⬜ |
| R20 | `/api/analytics` | POST | Analytics se registran | ⬜ |

---

## 🏷️ CLASIFICACIÓN DE HALLAZGOS

| Severidad | Definición | Acción |
|-----------|-----------|--------|
| 🔴 **Bloqueante** | Ruta P0 falla, build roto, crash en runtime | Corregir ANTES de cualquier otro fix |
| 🟡 **Medio** | Ruta P1 falla, feature incompleta, workaround existe | Corregir en este sprint |
| 🟢 **Bajo** | Ruta P2 falla, polish, no afecta operación | Corregir en siguiente sprint |

---

## 📄 FORMATO DEL REPORTE (`auditoria-rutas-report.md`)

```markdown
# 🔍 AUDITORÍA DE RUTAS — Reporte

**Fecha:** [auto]  
**Auditor:** Agente de Código  
**Commit base:** [hash]  
**Estado general:** [✅ Aprobado / ⚠️ Aprobado con observaciones / ❌ Rechazado]

---

## 📈 RESUMEN

| Categoría | ✅ Pass | ⚠️ Medio | ❌ Bloqueante |
|-----------|--------|----------|--------------|
| Rutas Públicas | X | X | X |
| Rutas Admin | X | X | X |
| API Routes | X | X | X |
| Server Actions | X | X | X |
| Redirecciones | X | X | X |
| Consola navegador | X | X | X |

---

## 🔴 HALLAZGOS BLOQUEANTES

### [R-01] Título del hallazgo
- **Ruta:** `/ruta/afectada`
- **Error:** Mensaje exacto del error o descripción del comportamiento roto
- **Evidencia:** Código relevante o stack trace
- **Causa raíz:** Por qué se rompió (ej: rename de campo, cambio de tipado Next.js 14, etc.)
- **Fix aplicado:** Código de la corrección
- **Verificación:** Cómo confirmar que ya funciona

---

## 🟡 HALLAZGOS MEDIOS

### [R-XX] ...

---

## 🟢 HALLAZGOS BAJOS

### [R-YY] ...

---

## ✅ RUTAS QUE PASARON

- R1 `/` — Landing OK
- R2 `/admin/login` — Login OK
- ...

---

## 📝 NOTAS DEL AUDITOR

[Observaciones adicionales]
```

---

## 🛠️ INSTRUCCIONES DE EJECUCIÓN

1. **NO modifiques código en el Paso 1.** Solo lee y anota hallazgos.
2. **En el Paso 2**, si encuentras un error, detente y documenta antes de seguir.
3. **Corrige los bloqueantes primero**, luego medios, luego bajos.
4. **Después de cada fix**, verifica que la ruta funcione reiniciando `npm run dev`.
5. **Al final**, ejecuta `npm run build` para confirmar que todo compila.
6. **Genera el reporte** y haz commit.

---

## ⚠️ PATRONES DE ROTURA COMUNES POST-REFACTOR

Basado en los cambios de las 3 fases, estas son las roturas más probables:

1. **`datosJson` aún referenciado** en algún archivo no refactorizado
2. **`params` no await** en Next.js 14 (cambio de API en v14)
3. **`tipoEvento` no manejado** en algún switch/case
4. **`estadoInvitacion` no verificado** en alguna query de Prisma
5. **Import de template incorrecto** (ruta cambió o archivo renombrado)
6. **Schema de Zod incompleto** (faltan campos nuevos de cumpleaños)
7. **Server Action no exportada** o exportada como default en lugar de named
8. **Middleware bloqueando rutas públicas** (`/i/[slug]`)
9. **`generateMetadata` crash** por acceso a propiedad de undefined
10. **Imágenes con src roto** (Cloudinary URL mal formada o campo vacío)
