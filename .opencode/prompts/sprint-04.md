# 🚀 Sprint 4: Editor y Publicación — Prompt para Kilo Code

## 📖 Contexto Inicial (LEER ANTES DE CODEAR)

1. `.opencode/architecture.md` — Flujo de datos, generación de URL, OG tags, QR
2. `.opencode/conventions.md` — Server actions, formularios, zod
3. `src/types/index.ts` — InvitacionData, TemplateConfig
4. `src/components/templates/` — 4 templates existentes
5. `src/lib/templates.ts` — getTemplateConfig

## 🎯 Objetivo del Sprint

Editor visual funcional con:
- Formulario dinámico según template seleccionado
- Preview en vivo (split screen)
- Generación de URL pública con slug único
- Meta tags Open Graph dinámicos
- Generador de QR server-side

## 📝 Tareas Atómicas

### Paso 1: Formulario de Variables del Editor
- [ ] Crear `src/app/(admin)/admin/pedidos/[id]/editar/page.tsx`.
- [ ] Leer pedido de DB, obtener `template` y `datosJson`.
- [ ] Usar `getTemplateConfig(pedido.template)` para obtener campos requeridos.
- [ ] Renderizar formulario dinámico: inputs según tipo (text, date, color picker, textarea, image upload).
- [ ] Image upload: input file que sube a Cloudinary via server action, guarda URL.
- [ ] Color picker: input type color o componente shadcn/ui.
- [ ] Usar react-hook-form + zod para validación.
- [ ] Guardar datos en `datosJson` del pedido (no publicar aún).

**Done:** Seleccionas template y aparecen los campos correctos. Guarda datos en DB.

### Paso 2: Preview en Vivo
- [ ] Layout split screen: izquierda formulario, derecha preview.
- [ ] Preview renderiza el template correspondiente con los datos actuales del formulario.
- [ ] Botón "Actualizar preview" o auto-update con debounce (cada 500ms).
- [ ] Preview debe ser fiel al resultado final (mismo componente TemplateWrapper).

**Done:** Escribes un nombre en el formulario y se ve reflejado en el template al instante.

### Paso 3: Generación de URL Pública
- [ ] Botón "Publicar" en el editor.
- [ ] Server action `publicarInvitacionAction(pedidoId)`:
  - Genera slug único: `slugify(nombres + fecha)` + sufijo numérico si duplicado.
  - Guarda slug en pedido.
  - Construye URL pública: `${process.env.NEXT_PUBLIC_URL}/i/${slug}`.
  - Actualiza estado del pedido a "entregado" (o nuevo estado "publicado").
- [ ] Crear página pública `src/app/(public)/i/[slug]/page.tsx`:
  - Server Component que lee slug, busca pedido en Prisma.
  - Renderiza template correcto con `datosJson`.
  - Si no existe, mostrar 404.

**Done:** Accedes a `/i/ana-carlos-15ago` y se ve la invitación real.

### Paso 4: Meta Tags Open Graph Dinámicos
- [ ] En `src/app/(public)/i/[slug]/page.tsx`, generar metadata dinámica:
  - `title`: nombres del evento
  - `description`: fecha + tipo de evento
  - `og:image`: primera foto del evento o imagen genérica del template
- [ ] Usar `export async function generateMetadata({ params })` de Next.js 14.
- [ ] Asegurar que la imagen OG sea accesible públicamente (Cloudinary).

**Done:** Compartir link en WhatsApp muestra preview bonito con foto y texto.

### Paso 5: Generador de QR
- [ ] Server action `generarQRAction(pedidoId)`:
  - Usar librería `qrcode` para generar PNG desde URL pública.
  - Subir PNG a Cloudinary.
  - Guardar `qrUrl` en el pedido.
- [ ] Mostrar QR en el panel de detalle del pedido (`/admin/pedidos/[id]`).
- [ ] Botón "Descargar QR" que descarga el PNG.

**Done:** Descargas el QR del panel, escanea y lleva a la invitación.

### Paso 6: Tests
- [ ] Test integration: generación de slug único, manejo de duplicados.
- [ ] Test integration: publicar invitación, acceder por slug.
- [ ] Test componente: render de editor con formulario dinámico.
- [ ] Test unit: generación de QR (mock de Cloudinary).

**Done:** `npm run test:ci` pasa verde.

## 🚫 Restricciones del Sprint

- NO implementar RSVP todavía (Sprint 5).
- NO implementar analytics todavía.
- NO modificar schema de Prisma (ya soporta todo).
- NO tocar kanban ni CRUD de clientes (solo leer para crear pedido).
- NO usar client-side rendering para la página pública (debe ser Server Component para OG tags).

## 🧪 Tests Obligatorios

- `tests/integration/slug.test.ts` — generación única, duplicados
- `tests/integration/publicar.test.ts` — publicar, acceder por slug, 404
- `tests/unit/qr.test.ts` — generación de QR (mock)
- `tests/unit/components/Editor.test.tsx` — render de formulario dinámico

## 🎯 Checkpoint

- [ ] Editor con formulario dinámico funciona
- [ ] Preview en vivo actualiza correctamente
- [ ] Publicar genera slug único y URL accesible
- [ ] OG tags dinámicos en página pública
- [ ] QR generado y descargable
- [ ] Tests pasan

## 🎬 Comando de Kickoff

```
Implementa el Sprint 4: Editor y Publicación. Crea el editor visual con formulario dinámico según template, preview en vivo split screen, generación de URL pública con slug único, meta tags OG dinámicos, y QR server-side. La página pública debe ser Server Component para OG. No implementes RSVP todavía. Escribe tests para slug, publicación y QR.
```

## 📊 Formato de Reporte

`sprint-04-report.md` con:
1. Archivos del editor y página pública
2. Decisiones sobre OG tags y QR
3. Deuda técnica
4. Estado de tests
5. Notas para siguiente sprint
