# 🎯 PROMPT ORQUESTADOR — Auditoría Avanzada de Rutas

> **Contexto:** Tras 3 fases de corrección, la aplicación "quedó rota". Necesitamos diagnosticar y corregir TODAS las rutas fallidas.  
> **Objetivo:** Identificar cada ruta rota, entender la causa raíz, aplicar el fix, y verificar que funciona.  
> **Output:** `auditoria-rutas-report.md` + código corregido + commit.  
> **Regla:** Una ruta a la vez. Nunca fixes masivos de golpe.

---

## 📁 ARCHIVOS DE CONTEXTO OBLIGATORIOS

Lee estos archivos ANTES de empezar:

1. `@auditoria-rutas-instrucciones.md` — Tu checklist maestro de rutas
2. `@src/middleware.ts` — Verificar qué rutas están protegidas
3. `@next.config.js` o `@next.config.ts` — Config de redirecciones y rewrites
4. `@src/app/(public)/i/[slug]/page.tsx` — Ruta pública más crítica
5. `@src/app/(admin)/admin/pedidos/nuevo/page.tsx` — Wizard
6. `@src/app/(admin)/admin/pedidos/[id]/editar/page.tsx` — Editor
7. `@src/app/(admin)/admin/pedidos/page.tsx` — Kanban
8. `@src/app/(admin)/admin/dashboard/page.tsx` — Dashboard
9. `@src/app/(admin)/admin/login/page.tsx` — Login
10. `@src/app/api/upload/route.ts` — API upload
11. `@src/app/api/qr/route.ts` — API QR
12. `@src/app/api/rsvp/route.ts` — API RSVP
13. `@src/lib/templates.ts` — Mapeo de templates
14. `@src/lib/paquetes.ts` — Config de paquetes
15. `@prisma/schema.prisma` — Modelo de datos

---

## 🧱 ESTADO ACTUAL (POST-FASE 3)

- ✅ 99 tests pasan
- ✅ Build compila
- ❌ App "quedó rota" — rutas fallan en runtime
- ❓ Causa desconocida — necesitamos diagnóstico

---

## 🔄 FLUJO DE TRABAJO (Ejecutar en orden)

### FASE A: DIAGNÓSTICO (Solo lectura, no tocar código)

#### Paso A1: Build de producción
```bash
npm run build 2>&1 | tee build.log
```
Analiza CADA línea de error. Anota:
- Archivo afectado
- Línea del error
- Mensaje exacto
- Tipo de error (TypeScript, ESLint, Module not found, etc.)

#### Paso A2: Diagnóstico estático de rutas
Revisa archivo por archivo buscando estos patrones de rotura:

**Patrón 1: `params` no await en Next.js 14**
```typescript
// ❌ ROTO:
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params; // ← params es Promise en Next.js 14
}

// ✅ CORRECTO:
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```
Revisar en: `i/[slug]/page.tsx`, `pedidos/[id]/page.tsx`, `pedidos/[id]/editar/page.tsx`, `clientes/[id]/page.tsx`

**Patrón 2: `generateMetadata` con params mal tipados**
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

**Patrón 3: Imports rotos por renombrado**
Busca imports que referencien archivos que ya no existen o fueron movidos:
```bash
grep -r "from.*datosJson" src/ --include="*.ts" --include="*.tsx"
grep -r "import.*Music" src/components/templates/cumpleanos/ --include="*.tsx"
grep -r "Module not found" build.log
```

**Patrón 4: Prisma queries con campos renombrados**
```bash
grep -r "datosJson" src/ --include="*.ts" --include="*.tsx"
```
Si encuentras alguno, es un bloqueante.

**Patrón 5: Server Actions no exportadas correctamente**
```bash
grep -r "export async function.*Action" src/app/(admin)/ --include="*.ts"
```
Verificar que cada action tenga `"use server"` al inicio del archivo o de la función.

**Patrón 6: Middleware bloqueando rutas públicas**
```typescript
// En middleware.ts, verificar que /i/[slug] NO está protegido
export const config = {
  matcher: ["/admin/:path*"], // ← debe ser EXACTAMENTE esto
};
```

**Patrón 7: Zod schemas con campos faltantes**
Revisa los schemas de validación en:
- `editor-client.tsx` (React Hook Form + Zod)
- `nuevo-pedido-client.tsx` (wizard)
- `page.tsx` público (si valida datos)

Verificar que incluyan TODOS los campos nuevos de cumpleaños.

**Patrón 8: Templates con props incorrectas**
```typescript
// Verificar que cada template recibe las props correctas:
// CumpleEsencial, CumpleCompleta, CumplePremium
// XVModerno, BodaElegante, BabyShower
```

#### Paso A3: Iniciar servidor y navegar
```bash
npm run dev
```

Abre el navegador y navega a cada ruta del checklist. Anota:
- ¿Carga la página? (200 vs 404 vs 500)
- ¿Hay errores en consola? (copiar stack trace completo)
- ¿Hay errores en terminal? (copiar mensaje de Next.js)

**Orden de navegación prioritario:**
1. `http://localhost:3000/` → Landing
2. `http://localhost:3000/admin/login` → Login
3. `http://localhost:3000/admin/dashboard` → Dashboard (requiere login)
4. `http://localhost:3000/admin/pedidos` → Kanban
5. `http://localhost:3000/admin/pedidos/nuevo` → Wizard
6. Crear un pedido de cumpleaños → verificar redirección a editor
7. `http://localhost:3000/admin/pedidos/[id]/editar` → Editor
8. Guardar borrador → verificar que no crashea
9. Publicar invitación → verificar que genera slug
10. `http://localhost:3000/i/[slug-generado]` → Invitación pública
11. `http://localhost:3000/i/[slug-inventado]` → Debe dar 404

---

### FASE B: CORRECCIÓN (Fix aplicado por fix)

Por cada hallazgo encontrado en Fase A:

1. **Documenta el hallazgo** en el formato del reporte
2. **Aplica el fix** con el código mínimo necesario
3. **Verifica** reiniciando `npm run dev` y navegando a la ruta afectada
4. **No pases al siguiente** hasta que este funcione

**Prioridad de fixes:**
1. 🔴 Build no compila → fix primero
2. 🔴 Ruta crítica rota (login, dashboard, editor, invitación pública) → fix segundo
3. 🟡 Ruta importante rota (wizard, kanban, API) → fix tercero
4. 🟢 Ruta secundaria rota → fix al final

---

### FASE C: VERIFICACIÓN FINAL

```bash
# 1. Build limpio
npm run build

# 2. Tests
npx vitest run --sequence.concurrent false --no-file-parallelism

# 3. Si hay tests E2E
npx playwright test

# 4. Navegación manual final (repetir Fase A3)
```

---

## 📝 COMMIT

```bash
git add .
git commit -m "fix(rutas): auditoría y corrección de rutas rotas post-fase3"
```

---

## ⚠️ REGLAS DE ORO

1. **Una ruta a la vez.** Nunca fixes masivos.
2. **Diagnostica ANTES de tocar código.** No adivines la causa.
3. **Si no sabes por qué se rompió**, busca en el historial de git (`git log --oneline`) qué commit introdujo el cambio.
4. **Mantén backward compatibility.** Si cambias un campo, asegúrate que el código antiguo siga funcionando.
5. **NO renombres archivos** a menos que sea absolutamente necesario.
6. **NO añadas features nuevas.** Solo corrige lo roto.
7. **Si un fix introduce otro bug**, revierte y reporta.

---

## 🧠 DIAGNÓSTICO POR SÍNTOMA

| Síntoma | Causa probable | Archivo a revisar |
|---------|--------------|-------------------|
| "Cannot read properties of undefined (reading 'nombre')" | `datosInvitacion` es null o no tiene el campo esperado | Template, `page.tsx` público |
| "Module not found: Can't resolve '@/components/...'" | Import roto o archivo movido | Archivo con el import |
| "params should be awaited" | Next.js 14 requiere `await params` | Cualquier `page.tsx` con params |
| "PrismaClientValidationError" | Query usa campo que no existe en schema | Archivo con la query |
| "Type error: Property 'datosJson' does not exist" | Aún referencia al campo renombrado | Cualquier archivo con `datosJson` |
| "500 Internal Server Error" | Server Action crash o API route crash | Actions o API routes |
| "404 Not Found" | Ruta no existe o middleware la bloquea | `middleware.ts`, estructura de carpetas |
| "React Hook Form: Controller name is required" | Schema de Zod no tiene el campo | `editor-client.tsx` |
| "Infinite re-render" | useEffect con dependencias incorrectas | Componente con useEffect |
| "Hydration failed" | Renderizado SSR vs CSR diferente | `page.tsx` o layout |

---

> **Modelo sugerido:** Gemini 3.5 Flash High en modo Code.  
> **Si te atascas:** Cambia a `deepseek-chat` o `glm-4.5-flash` para debug.  
> **Tiempo estimado:** 30-60 minutos dependiendo de cuántas rutas estén rotas.
