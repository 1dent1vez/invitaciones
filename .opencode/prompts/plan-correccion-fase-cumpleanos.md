# 🔧 PLAN DE CORRECCIÓN — Fase Cumpleaños

> **Generado:** 2026-06-08  
> **Basado en:** Auditoría Fase Cumpleaños (96 checks, 68 pass, 11 bloqueantes, 16 medios, 1 bajo)  
> **Objetivo:** Llevar el proyecto de ❌ Rechazado a ✅ Aprobado  
> **Regla de oro:** Una fase, un prompt. Nunca múltiples fases de golpe.

---

## 🗺️ MAPA DE DEPENDENCIAS

```
FASE 1 (Fundamentos)
├── ID-10 Fix ESLint → desbloquea build
├── ID-01 Add tipoEvento → desbloquea tipado
├── ID-02 Add estadoInvitacion → desbloquea publicación segura
└── ID-12 Rename datosJson → consistencia conceptual
     │
     ▼
FASE 2 (Editor + Templates)
├── ID-07 Fix defaultValues → desbloquea data integrity
├── ID-08 Fix slug generation → desbloquea seguridad borradores
├── ID-05 Multi-upload → desbloquea galería Completa/Premium
├── ID-03 Complete Premium → desbloquea valor $850
├── ID-04 Fix OG tags → desbloquea compartir social
└── ID-14 Fix meta tags → desbloquea SEO
     │
     ▼
FASE 3 (Polish + Tests)
├── ID-06 Auto-save → UX
├── ID-09 Fix E2E → CI/CD
└── ID-11 al ID-26 → Medios y bajos
```

---

## 🎯 FASE 1: FUNDAMENTOS — Build + Schema + Config

**Objetivo:** Desbloquear el build, corregir el schema de datos, y alinear la configuración de paquetes.

### Hallazgos a corregir:
| ID | Hallazgo | Archivo | Estimación |
|----|----------|---------|------------|
| ID-10 | ESLint bloquea build (any, unused vars) | Múltiples | 1.0h |
| ID-01 | Falta `tipoEvento` en `PaqueteConfig` | `src/lib/paquetes.ts` | 1.0h |
| ID-02 | Falta estado de invitación en schema | `prisma/schema.prisma` + migración | 2.0h |
| ID-12 | Campo JSON se llama `datosJson` no `datosInvitacion` | `prisma/schema.prisma` + codebase | 1.5h |
| ID-24 | Vitest incluye archivos Playwright | `vitest.config.ts` | 0.5h |

### Prompt para agente de código:

```
# FASE 1: FUNDAMENTOS — Build + Schema + Config

## Contexto
Proyecto Invitaciones Digitales. Stack: Next.js 14 + Prisma + PostgreSQL + TypeScript.
La auditoría detectó 5 bloqueantes fundamentales que impiden compilar y desestructuran
el modelo de datos. Esta fase debe resolverlos TODOS antes de continuar.

## Reglas de oro
- NO toques templates, editor, wizard, ni features visuales en esta fase.
- Solo schema, config, types, y fixes de compilación.
- Cada cambio en schema requiere: modificar schema → generar migración → aplicar en Neon.
- Tests junto con código.
- Git commit obligatorio al final.

## Tareas (en orden)

### 1. Fix ESLint bloqueantes (ID-10)
Archivos a revisar:
- src/app/(admin)/admin/pedidos/actions.ts — reemplazar `any` por tipo adecuado
- src/components/templates/cumpleanos/CumpleCompleta.tsx — eliminar import `Music` sin usar
- src/components/templates/cumpleanos/CumplePremium.tsx — eliminar imports sin usar
- src/components/templates/cumpleanos/CumpleEsencial.tsx — eliminar imports sin usar
- src/lib/templates.ts — revisar `any` en map de tipos
- Otros archivos que fallen en `npm run build`

Criterio: `npm run build` debe pasar SIN errores de ESLint.

### 2. Agregar `tipoEvento` a PaqueteConfig (ID-01)
Archivo: src/lib/paquetes.ts

- Agregar `tipoEvento: TipoEvento` a la interfaz `PaqueteConfig`
- `TipoEvento` debe ser un enum o union type: `"cumpleanos" | "boda" | "xv" | "babyshower"`
- Asignar `tipoEvento` en cada uno de los 12 paquetes
- Los 3 de cumpleaños: `tipoEvento: "cumpleanos"`
- Los 9 restantes: `tipoEvento` correspondiente (boda, xv, babyshower)
- Actualizar TODOS los lugares que consumen `PaqueteConfig` para que no rompan

### 3. Agregar estado de invitación al schema (ID-02)
Archivo: prisma/schema.prisma

- Agregar campo `estadoInvitacion` al modelo `Pedido`:
  ```prisma
  estadoInvitacion String @default("BORRADOR") // BORRADOR | PUBLICADA | ARCHIVADA
  ```
- Generar migración: `npx prisma migrate dev --name add_estado_invitacion`
- Aplicar en Neon (o verificar que se aplicará en el próximo deploy)
- Crear enum/helper en TypeScript: `src/lib/estados.ts` con:
  ```typescript
  export const ESTADO_INVITACION = {
    BORRADOR: "BORRADOR",
    PUBLICADA: "PUBLICADA",
    ARCHIVADA: "ARCHIVADA",
  } as const;
  ```
- Actualizar `src/types/index.ts` si es necesario

### 4. Renombrar `datosJson` → `datosInvitacion` (ID-12)
Archivos: prisma/schema.prisma + TODOS los archivos que lean/escriban `datosJson`

- En `schema.prisma`, renombrar el campo:
  ```prisma
  datosInvitacion Json? @default("{}")
  ```
- Generar migración: `npx prisma migrate dev --name rename_datos_json`
- Buscar y reemplazar TODAS las referencias a `datosJson` en el codebase:
  - src/app/(admin)/admin/pedidos/actions.ts
  - src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx
  - src/app/(admin)/admin/pedidos/[id]/editar/actions.ts
  - src/app/(public)/i/[slug]/page.tsx
  - src/components/templates/
  - src/lib/templates.ts
  - Cualquier test que use `datosJson`
- Criterio: `npm run build` pasa y no hay referencias a `datosJson` en el código

### 5. Excluir E2E tests de Vitest (ID-24)
Archivo: vitest.config.ts

- Agregar en la configuración:
  ```typescript
  test: {
    exclude: ['**/node_modules/**', '**/tests/e2e/**', '**/dist/**']
  }
  ```
- Verificar que `npm test` (vitest) no intenta cargar archivos de Playwright

## Tests obligatorios
- Test unitario: `src/lib/paquetes.ts` verifica que cada paquete tiene `tipoEvento`
- Test unitario: `src/lib/estados.ts` verifica enum de estados
- Test de compilación: `npm run build` pasa sin errores
- Test de tests: `npm test` pasa sin errores

## Commit
```bash
git add .
git commit -m "fix(fase1): schema estadoInvitacion + tipoEvento config + datosInvitacion rename + ESLint fixes + vitest exclude"
```
```

---

## 🎯 FASE 2: EDITOR + TEMPLATES + DATA INTEGRITY

**Objetivo:** Corregir el editor para que no pierda datos, implementar multi-upload, completar el template Premium, y arreglar OG/meta tags para cumpleaños.

### Hallazgos a corregir:
| ID | Hallazgo | Archivo | Estimación |
|----|----------|---------|------------|
| ID-07 | Pérdida de datos al recargar editor | `editor-client.tsx` | 1.0h |
| ID-08 | Slug público generado al crear pedido | `actions.ts` + `page.tsx` | 2.0h |
| ID-05 | Galería no soporta multi-upload | `editor-client.tsx` | 3.0h |
| ID-03 | Template Premium incompleto | `CumplePremium.tsx` + `paquetes.ts` | 3.0h |
| ID-04 | OG Tags rotos para cumpleaños | `i/[slug]/page.tsx` | 1.0h |
| ID-14 | Meta tags fallbacks erróneos | `i/[slug]/page.tsx` | 1.0h |

### Prompt para agente de código:

```
# FASE 2: EDITOR + TEMPLATES + DATA INTEGRITY

## Contexto
Fase 1 completada (schema, config, build desbloqueado). Ahora corregimos el editor,
templates, y la integridad de datos de cumpleaños.

## Reglas de oro
- Cada cambio en el editor debe mantener compatibilidad con eventos tipo "boda" (aún no implementados)
- Los OG tags y meta tags deben ser dinámicos según `tipoEvento`
- El template Premium debe justificar los $850 MXN
- Tests junto con código
- Git commit obligatorio al final

## Tareas (en orden)

### 1. Fix defaultValues del editor para cumpleaños (ID-07)
Archivo: src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx

Problema: `defaultValues` solo inicializa campos de boda (`nombres`, `ubicacion`, etc.)
y omite campos de cumpleaños (`nombre`, `edad`, `lugar`, `direccion`, `fotoPortada`, 
`tipoCelebracion`, `mensajeFestejo`, `itinerario`, `datosRegalo`, etc.).

Solución:
- Extender `defaultValues` para que lea TODOS los campos posibles de `dbDatos` (ahora `datosInvitacion`)
- Usar un helper que merge los datos guardados con defaults seguros:
  ```typescript
  const defaultValues = useMemo<EditorFormValues>(() => ({
    // Campos comunes
    nombres: dbDatos.nombres || "",
    nombre: dbDatos.nombre || pedido.cliente?.nombre || "",
    fechaPart: initialDateParts.fechaPart,
    horaPart: initialDateParts.horaPart,
    // Campos cumpleaños
    edad: dbDatos.edad || "",
    lugar: dbDatos.lugar || dbDatos.ubicacion || "",
    direccion: dbDatos.direccion || "",
    fotoPortada: dbDatos.fotoPortada || dbDatos.portadaUrl || "",
    tipoCelebracion: dbDatos.tipoCelebracion || "general",
    mensajeFestejo: dbDatos.mensajeFestejo || dbDatos.mensajeBienvenida || "",
    itinerario: dbDatos.itinerario || [],
    datosRegalo: dbDatos.datosRegalo || "",
    fotosGaleria: dbDatos.fotosGaleria || dbDatos.fotos || [],
    colorPrimario: dbDatos.colorPrimario || "#FF6B6B",
    colorSecundario: dbDatos.colorSecundario || "#4ECDC4",
    // ... todos los demás campos de cumpleaños
  }), [...]);
  ```
- Criterio: Al recargar el editor, todos los campos de cumpleaños mantienen sus valores guardados

### 2. Fix generación de slug público (ID-08)
Archivos:
- src/app/(admin)/admin/pedidos/actions.ts (wizard)
- src/app/(admin)/admin/pedidos/[id]/editar/actions.ts (publicar)
- src/app/(public)/i/[slug]/page.tsx (ruta pública)

Problema: El slug y la URL pública se generan al CREAR el pedido, exponiendo borradores.

Solución:
- En `actions.ts` (wizard): REMOVER la generación de `slug` y `urlPublica` del `create`
  ```typescript
  // ANTES (incorrecto):
  // slug: await getUniqueSlug(client.nombre, eventDate),
  // urlPublica: `http://localhost:3000/i/${slug}`,

  // DESPUÉS (correcto):
  // slug: null,
  // urlPublica: null,
  ```
- En `actions.ts` (publicar): Generar slug y URL SOLO al publicar:
  ```typescript
  export async function publicarInvitacionAction(pedidoId: string) {
    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido) throw new Error("Pedido no encontrado");

    const slug = pedido.slug || await getUniqueSlug(pedido.cliente.nombre, pedido.fechaEvento);
    const urlPublica = `${process.env.NEXT_PUBLIC_APP_URL}/i/${slug}`;

    await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        estadoInvitacion: "PUBLICADA",
        slug,
        urlPublica,
      }
    });

    // Revalidar cache
    revalidatePath(`/i/${slug}`);
    return { slug, urlPublica };
  }
  ```
- En `page.tsx` (ruta pública): Retornar `notFound()` si `estadoInvitacion !== "PUBLICADA"`
  ```typescript
  if (!order || order.estadoInvitacion !== "PUBLICADA") {
    notFound();
  }
  ```
- Criterio: Crear un pedido nuevo → no tiene slug ni URL. Publicar → genera slug y URL. Acceder a URL sin publicar → 404.

### 3. Multi-upload de galería en el editor (ID-05)
Archivo: src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx

Problema: `fotosGaleria` se trata como un campo `image` simple, solo permite 1 foto.

Solución:
- Crear componente `MultiImageUploader` dentro del editor o en `src/components/ui/`
- El componente debe:
  - Permitir subir múltiples imágenes a Cloudinary (una por una o drag-drop)
  - Mostrar grid de thumbnails con botón de eliminar (X) por imagen
  - Permitir reordenar (drag & drop o flechas arriba/abajo)
  - Respetar el límite del paquete: 3 para Completa, 6 para Premium
  - Mostrar contador "X de Y fotos"
  - Guardar como array de strings (URLs) en `datosInvitacion.fotosGaleria`
- En el editor, detectar si el campo es tipo `gallery` (nuevo tipo) o `image`:
  ```typescript
  if (campo.tipo === "gallery") {
    return <MultiImageUploader 
      value={field.value || []} 
      onChange={field.onChange} 
      maxImages={campo.maxItems || 3}
    />;
  }
  ```
- Actualizar `src/lib/paquetes.ts` para que los campos de galería tengan `tipo: "gallery"` y `maxItems: 3 | 6`
- Criterio: Template Completa permite 3 fotos, Premium 6, se guardan y recuperan correctamente

### 4. Completar template Premium (ID-03)
Archivos: src/components/templates/cumpleanos/CumplePremium.tsx + src/lib/paquetes.ts

Problema: Faltan `fechaLimiteRSVP`, `mensajeAgradecimiento`, `confettiAnimacion`, `cuentaRegresiva`.

Solución:
- En `paquetes.ts`: Agregar campos faltantes al paquete Premium:
  ```typescript
  { id: "fechaLimiteRSVP", tipo: "date", label: "Fecha límite de confirmación", required: false },
  { id: "mensajeAgradecimiento", tipo: "textarea", label: "Mensaje de agradecimiento", required: false },
  { id: "confettiAnimacion", tipo: "boolean", label: "Activar confetti", defaultValue: true },
  { id: "cuentaRegresiva", tipo: "boolean", label: "Mostrar cuenta regresiva", defaultValue: true },
  ```
- En `CumplePremium.tsx`, implementar:
  - **Cuenta regresiva:** Componente `CountdownTimer` que recibe `fechaEvento` y muestra días/horas/min/seg con animación (Framer Motion). Se oculta automáticamente después del evento.
  - **Confetti:** Usar `canvas-confetti` o implementación propia. Disparar al cargar la página si `confettiAnimacion === true`. Botón para re-disparar.
  - **RSVP dinámico:** Mostrar fecha límite de confirmación ("Confirma antes del 10 de Agosto"). Si la fecha actual supera la límite, mostrar mensaje "El período de confirmación ha cerrado".
  - **Mensaje de agradecimiento:** Mostrar en footer post-RSVP o siempre visible en la parte inferior.
- Criterio: El template Premium muestra TODOS los campos exclusivos y se ve diferente al Completa

### 5. Fix OG Tags dinámicos para cumpleaños (ID-04)
Archivo: src/app/(public)/i/[slug]/page.tsx

Problema: OG tags usan `datos.nombres` y `datos.portadaUrl` (campos de boda).

Solución:
- En `generateMetadata`, detectar `tipoEvento` y usar campos correctos:
  ```typescript
  const datos = order.datosInvitacion as unknown as InvitacionData;

  let title = "Invitación Especial";
  let description = "Te invitamos a celebrar con nosotros";
  let ogImage = "/default-og.jpg";

  if (order.tipoEvento === "cumpleanos") {
    title = datos.nombre ? `¡Fiesta de cumpleaños de ${datos.nombre}!` : "Invitación de Cumpleaños";
    description = datos.mensajeFestejo || datos.mensajeBienvenida || `Acompáñanos a celebrar el cumpleaños de ${datos.nombre}`;
    ogImage = datos.fotoPortada || (datos.fotosGaleria?.[0]) || "/default-cumpleanos-og.jpg";
  } else if (order.tipoEvento === "boda") {
    title = datos.nombres ? `Boda de ${datos.nombres}` : "Nuestra Boda";
    description = datos.mensajeBienvenida || "Nos casamos y queremos que nos acompañes";
    ogImage = datos.portadaUrl || (datos.fotos?.[0]) || "/default-boda-og.jpg";
  }
  // ... xv, babyshower
  ```
- Criterio: Compartir una invitación de cumpleaños en WhatsApp/Facebook muestra el nombre del festejado y su foto

### 6. Fix meta tags fallbacks (ID-14)
Archivo: src/app/(public)/i/[slug]/page.tsx

Problema: `<title>` y `<meta name="description">` usan `datos.nombres` (boda) para cumpleaños.

Solución:
- Aplicar la misma lógica condicional de OG tags a los meta tags básicos:
  ```typescript
  return {
    title,
    description,
    openGraph: { title, description, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
  ```
- Criterio: El título de la pestaña del navegador muestra "¡Fiesta de cumpleaños de [Nombre]!"

## Tests obligatorios
- Test: Editor defaultValues carga todos los campos de cumpleaños
- Test: Publicar invitación genera slug y cambia estado a PUBLICADA
- Test: Acceder a URL no publicada retorna 404
- Test: MultiImageUploader sube 3 fotos, elimina 1, quedan 2
- Test: Template Premium renderiza cuenta regresiva y confetti
- Test: OG tags de cumpleaños usan `datos.nombre` y `datos.fotoPortada`
- Test: Meta tags de boda siguen funcionando (backward compatibility)
- Test E2E (Playwright): Flujo completo de cumpleaños (crear → editar → publicar → ver)

## Commit
```bash
git add .
git commit -m "fix(fase2): editor defaultValues + slug seguro + multi-upload + premium template + OG/meta tags dinámicos"
```
```

---

## 🎯 FASE 3: POLISH + TESTS + MEDIOS

**Objetivo:** Auto-guardado, tests E2E actualizados, limpieza de paquetes no implementados, y todos los hallazgos medios/bajos.

### Hallazgos a corregir:
| ID | Hallazgo | Archivo | Estimación |
|----|----------|---------|------------|
| ID-06 | Auto-guardado cada 30s | `editor-client.tsx` | 1.5h |
| ID-09 | Tests E2E obsoletos | `tests/e2e/flujo-completo.spec.ts` | 1.5h |
| ID-11 | Paquetes no implementados con campos poblados | `src/lib/paquetes.ts` | 1.0h |
| ID-13 | Campos tipoCelebracion/whatsapp no usados | `CumpleEsencial.tsx`, `CumpleCompleta.tsx` | 1.5h |
| ID-15 | Skeleton loaders en editor | `editor-client.tsx` | 1.5h |
| ID-16 | Revalidación caché OG tags | `editor-client.tsx` | 1.0h |
| ID-17 | Toggle mobile/desktop en preview | `editor-client.tsx` | 2.0h |
| ID-18 | Validación teléfono en wizard | `nuevo-pedido-client.tsx` | 1.0h |
| ID-19 | WA notificaciones incompletas | `src/lib/notificaciones.ts` | 1.0h |
| ID-20 | Badge crudo en kanban | `pedidos-client.tsx` | 1.0h |
| ID-21 | Búsqueda no incluye festejado | `pedidos-client.tsx` | 1.5h |
| ID-22 | Clonador no limpia datos cumpleaños | `src/app/(admin)/admin/pedidos/[id]/actions.ts` | 1.0h |
| ID-23 | CSV RSVP sin metadatos | `rsvp-table.tsx` | 1.0h |
| ID-25 | Warnings ESLint/React | Múltiples | 2.0h |
| ID-26 | Watermark en preview | `editor-client.tsx` | 0.5h |

### Prompt para agente de código:

```
# FASE 3: POLISH + TESTS + MEDIOS

## Contexto
Fases 1 y 2 completadas. Ahora resolvemos auto-guardado, tests, y todos los hallazgos medios.

## Reglas de oro
- NO modifiques schema ni configuración de paquetes (ya estable en Fase 1)
- NO toques templates Premium (ya completo en Fase 2)
- Tests junto con código
- Git commit obligatorio al final

## Tareas (agrupadas por área)

### Área A: Editor UX (ID-06, ID-15, ID-17, ID-26)
Archivo: src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx

1. **Auto-guardado (ID-06):**
   - Implementar hook `useDebounce` o `useEffect` con timer de 30s
   - Guardar automáticamente SI hay cambios sin guardar (dirty state)
   - Mostrar indicador "Guardando..." / "Guardado" / "Cambios sin guardar"
   - NO auto-publicar, solo guardar borrador
   ```typescript
   useEffect(() => {
     if (isDirty && !isSaving) {
       const timer = setTimeout(() => {
         handleSaveDraft();
       }, 30000);
       return () => clearTimeout(timer);
     }
   }, [isDirty, isSaving]);
   ```

2. **Skeleton loaders (ID-15):**
   - Mientras carga `defaultValues`, mostrar skeletons en el panel izquierdo
   - Usar shadcn/ui Skeleton component
   - 5-6 skeletons que simulan los campos del formulario

3. **Toggle mobile/desktop (ID-17):**
   - Agregar botones toggle arriba del preview: 📱 Mobile | 🖥️ Desktop
   - Mobile: `max-w-[360px]` (actual)
   - Desktop: `max-w-[100%]` o `max-w-[768px]`
   - Animación suave de transición (Tailwind transition)

4. **Watermark en preview (ID-26):**
   - Overlay absoluto en el preview: "VISTA PREVIA — BORRADOR"
   - Opacidad 30%, posición top-right, rotación -5deg
   - Solo visible cuando `estadoInvitacion === "BORRADOR"`

### Área B: Wizard (ID-18)
Archivo: src/app/(admin)/admin/pedidos/nuevo/nuevo-pedido-client.tsx

- Validación estricta de teléfono con Zod:
  ```typescript
  telefono: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos numéricos")
  ```
- Agregar hint visual: "Ej: 5512345678"

### Área C: Notificaciones (ID-19)
Archivo: src/lib/notificaciones.ts

- Función `generarMensajeWhatsApp(pedido)` debe incluir:
  - Nombre del festejado
  - Fecha y hora del evento
  - Lugar
  - URL de la invitación
  - Mensaje personalizado
  ```
  ¡Hola! Te invito al cumpleaños de [NOMBRE] 🎉

  📅 Fecha: [FECHA]
  🕐 Hora: [HORA]
  📍 Lugar: [LUGAR]

  [MENSAJE PERSONALIZADO]

  Confirma tu asistencia aquí: [URL]
  ```

### Área D: Kanban & Pedidos (ID-20, ID-21, ID-22)
Archivos: src/app/(admin)/admin/pedidos/pedidos-client.tsx + actions.ts

1. **Badge traducido (ID-20):**
   - Crear diccionario:
     ```typescript
     const EVENTO_LABELS: Record<string, string> = {
       cumpleanos: "Cumpleaños",
       boda: "Boda",
       xv: "XV Años",
       babyshower: "Baby Shower",
     };
     ```
   - Usar en badges: `EVENTO_LABELS[pedido.tipoEvento] || pedido.tipoEvento`

2. **Búsqueda por festejado (ID-21):**
   - Extender filtro de búsqueda:
     ```typescript
     const match = 
       pedido.cliente.nombre.toLowerCase().includes(query) ||
       pedido.slug?.toLowerCase().includes(query) ||
       (pedido.datosInvitacion?.nombre?.toLowerCase().includes(query)) ||
       (pedido.datosInvitacion?.nombres?.toLowerCase().includes(query));
     ```

3. **Clonador limpia datos cumpleaños (ID-22):**
   - En `clonarPedidoAction`, agregar:
     ```typescript
     datosInvitacion: {
       ...cleanedData,
       nombre: "",
       fotoPortada: "",
       fotosGaleria: [],
       // Limpiar campos específicos de cumpleaños
     }
     ```

### Área E: RSVP & CSV (ID-23)
Archivo: src/app/(admin)/admin/pedidos/[id]/rsvp-table.tsx

- Agregar metadata al inicio del CSV:
  ```typescript
  const metadata = [
    `Evento: ${pedido.datosInvitacion?.nombre || "Cumpleaños"}`,
    `Fecha: ${formatDate(pedido.fechaEvento)}`,
    `Lugar: ${pedido.datosInvitacion?.lugar || pedido.datosInvitacion?.ubicacion || ""}`,
    "", // línea vacía
  ];
  const csvContent = [metadata.join("\n"), headers, ...rows].join("\n");
  ```

### Área F: Limpieza de paquetes (ID-11)
Archivo: src/lib/paquetes.ts

- Para los 9 paquetes no implementados, limpiar `campos` y `secciones`:
  ```typescript
  {
    id: "boda-esencial",
    nombre: "Boda Esencial",
    tipoEvento: "boda",
    precio: 350,
    implementado: false,
    campos: [], // vacío
    secciones: [], // vacío
  }
  ```

### Área G: Templates Esencial/Completa (ID-13)
Archivos: CumpleEsencial.tsx, CumpleCompleta.tsx

- **tipoCelebracion:** Mostrar badge/tag según valor ("Infantil", "Adultos", "Sorpresa")
- **whatsapp:** Si existe `datos.whatsapp`, mostrar botón "Enviar WhatsApp" que abre `https://wa.me/${datos.whatsapp}`

### Área H: Tests E2E (ID-09)
Archivo: tests/e2e/flujo-completo.spec.ts

- Actualizar para flujo de cumpleaños:
  ```typescript
  test("flujo completo de cumpleaños", async ({ page }) => {
    // 1. Login
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "password");
    await page.click('button[type="submit"]');

    // 2. Crear pedido (Wizard)
    await page.goto("/admin/pedidos/nuevo");
    await page.selectOption('select[name="tipoEvento"]', 'cumpleanos');
    await page.selectOption('select[name="paquete"]', 'cumpleanos-esencial');
    await page.fill('input[name="clienteNombre"]', "Juan Pérez");
    await page.fill('input[name="telefono"]', "5512345678");
    await page.click('button:has-text("Crear Pedido")');

    // 3. Editar invitación
    await page.waitForURL(/\/admin\/pedidos\/\w+\/editar/);
    await page.fill('input[name="nombre"]', "María");
    await page.fill('input[name="lugar"]', "Salón Fiesta");
    await page.click('button:has-text("Guardar borrador")');
    await page.waitForSelector('text=Guardado');

    // 4. Publicar
    await page.click('button:has-text("Publicar")');
    await page.waitForSelector('text=Publicada');

    // 5. Ver invitación pública
    const url = await page.locator('[data-testid="url-publica"]').inputValue();
    await page.goto(url);
    await page.waitForSelector('text=María');
    await page.waitForSelector('text=Salón Fiesta');
  });
  ```

### Área I: Warnings ESLint (ID-25)
Archivos: Múltiples templates

- Resolver `useEffect` dependency arrays faltantes
- Reemplazar `<img>` por `<Image />` de Next.js donde sea posible
- Eliminar variables sin uso restantes

## Tests obligatorios
- Test: Auto-guardado se dispara tras 30s de inactividad
- Test: Skeleton se muestra mientras carga editor
- Test: Toggle mobile/desktop cambia el ancho del preview
- Test: Badge muestra "Cumpleaños" no "cumpleanos"
- Test: Búsqueda encuentra por nombre del festejado
- Test: Clonador limpia `nombre`, `fotoPortada`, `fotosGaleria`
- Test: CSV incluye metadata del evento
- Test: WA notificación incluye fecha, hora, lugar
- Test E2E: Flujo completo pasa en Playwright
- Test: `npm run build` pasa sin warnings críticos

## Commit
```bash
git add .
git commit -m "fix(fase3): auto-save + skeletons + toggle preview + tests E2E + polish medios"
```
```

---

## 📊 RESUMEN DE TODAS LAS FASES

| Fase | Hallazgos | Tiempo | Commit sugerido |
|------|-----------|--------|-----------------|
| Fase 1 | ID-10, ID-01, ID-02, ID-12, ID-24 | ~5.5h | `fix(fase1): schema + config + build` |
| Fase 2 | ID-07, ID-08, ID-05, ID-03, ID-04, ID-14 | ~11.5h | `fix(fase2): editor + templates + OG tags` |
| Fase 3 | ID-06, ID-09, ID-11-13, ID-15-26 | ~14.0h | `fix(fase3): auto-save + tests + polish` |
| **Total** | **26 hallazgos** | **~31h** | — |

---

## 🎯 PROMPT ORQUESTADOR PARA EJECUTAR CADA FASE

```markdown
# ORQUESTADOR — Corrección Fase Cumpleaños

## Contexto
El proyecto Invitaciones Digitales fue auditado y detectó 26 hallazgos (11 bloqueantes, 16 medios, 1 bajo).
Este prompt ejecuta UNA fase de corrección a la vez.

## Archivos de contexto obligatorios
@plan-correccion-fase-cumpleanos.md
@auditoria-cumpleanos-report.md
@prisma/schema.prisma
@src/lib/paquetes.ts
@src/lib/templates.ts
@src/types/index.ts

## Instrucciones
1. Lee el reporte de auditoría para entender los hallazgos
2. Lee el plan de corrección para ver la fase asignada
3. Ejecuta TODAS las tareas de esa fase en orden
4. Escribe tests para cada fix
5. Verifica `npm run build` pasa antes de terminar
6. Verifica `npm test` pasa antes de terminar
7. Genera un mini-reporte de fase al final
8. Haz git commit

## Reglas de oro
- Una fase, una ejecución. Nunca ejecutes múltiples fases de golpe.
- NO añadas features extras fuera del scope de la fase
- Si te atascas, detente y reporta el problema
- Tests junto con código, nunca al final
```

---

> **Nota para el usuario:** Ejecuta las fases en orden. Nunca saltes de Fase 1 a Fase 3.
> Cada fase desbloquea la siguiente. Fase 1 es crítica porque sin build no puedes validar nada.
