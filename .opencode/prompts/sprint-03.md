# 🚀 Sprint 3: Motor de Templates — Prompt para Kilo Code

## 📖 Contexto Inicial (LEER ANTES DE CODEAR)

1. `.opencode/architecture.md` — Patrón de templates, tipos InvitacionData
2. `.opencode/conventions.md` — Componentes, nomenclatura
3. `src/types/index.ts` — Tipos globales (crear si no existe)
4. `src/app/(admin)/admin/pedidos/[id]/page.tsx` — Detalle de pedido existente

## 🎯 Objetivo del Sprint

Sistema de templates funcional con:
- Arquitectura base de templates (componente genérico + tipado)
- 4 templates diseñados: Boda Elegante, XV Años Moderno, Baby Shower, Cumpleaños Fiesta
- Galería interactiva en landing con demos navegables
- Subida de 4 imágenes de ejemplo a Cloudinary

## 📝 Tareas Atómicas

### Paso 1: Arquitectura de Templates
- [ ] Crear `src/types/index.ts` con:
  - `InvitacionData`: interface con campos comunes (nombres, fecha, ubicacion, fotos, colores, mensaje, dressCode, etc.)
  - `TemplateConfig`: interface que define qué campos necesita cada template (array de field configs con tipo: text, date, color, image, textarea)
  - `TemplateType`: union type `'boda-elegante' | 'xv-moderno' | 'baby-shower' | 'cumpleanos-fiesta'`
- [ ] Crear `src/components/templates/TemplateWrapper.tsx`:
  - Recibe `template` (componente) + `data` (InvitacionData)
  - Añade animación de entrada (Framer Motion: fade-in + slide-up)
  - Añade fondo/base común
- [ ] Crear `src/lib/templates.ts`:
  - Mapa de templateType → componente
  - Mapa de templateType → TemplateConfig (qué campos necesita)
  - Helper `getTemplateConfig(type)`

**Done:** Puedes renderizar un template pasando tipo + datos.

### Paso 2: Template #1 — Boda Elegante
- [ ] Crear `src/components/templates/BodaElegante.tsx`.
- [ ] Diseño minimalista: tipografía elegante (serif via Google Fonts o Tailwind), colores neutros.
- [ ] Secciones: hero con nombres grandes, fecha prominente, contador regresivo (client-side), botón de ubicación (link a Google Maps), dress code, frase/footer.
- [ ] Responsive, animaciones suaves con Framer Motion.

**Done:** `/demo/boda-elegante` renderiza template con datos de prueba.

### Paso 3: Template #2 — XV Años Moderno
- [ ] Crear `src/components/templates/XVModerno.tsx`.
- [ ] Diseño vibrante: colores fuertes, foto de quinceañera grande.
- [ ] Animación de entrada llamativa.
- [ ] Secciones: foto principal, galería de 4 fotos (grid), datos de fiesta, sección de regalos (efectivo), música de fondo (autoplay muted, botón toggle).

**Done:** `/demo/xv-moderno` funciona.

### Paso 4: Template #3 — Baby Shower
- [ ] Crear `src/components/templates/BabyShower.tsx`.
- [ ] Diseño suave: colores pastel, tipografía redonda.
- [ ] Secciones: información del bebé (nombre si se sabe, fecha probable), lista de regalos sugeridos, confirmar asistencia (placeholder de formulario, funcional en Sprint 5).

**Done:** `/demo/baby-shower` funciona.

### Paso 5: Template #4 — Cumpleaños Fiesta
- [ ] Crear `src/components/templates/CumpleanosFiesta.tsx`.
- [ ] Diseño divertido: globos/confeti CSS animado, colores festivos.
- [ ] Secciones: foto del festejado, timeline de la fiesta (hora llegada, cena, pastel), botón RSVP, link a mesa de regalos.

**Done:** `/demo/cumpleanos-fiesta` funciona.

### Paso 6: Galería en Landing + Demos
- [ ] Subir 4 imágenes de ejemplo a Cloudinary (o usar placeholders de alta calidad si no tienes imágenes reales todavía).
- [ ] Actualizar landing: galería de 6 cards con imágenes reales de los templates.
- [ ] Cada card tiene botón "Ver demo" que abre `/demo/[tipo]`.
- [ ] Crear páginas de demo: `src/app/(public)/demo/[tipo]/page.tsx` que renderiza el template con datos ficticios realistas.

**Done:** Landing tiene galería con ejemplos reales. Clic en demo abre invitación funcional.

### Paso 7: Tests
- [ ] Test de render para cada template con datos de prueba.
- [ ] Test de validación: template rechaza datos incompletos (faltan campos requeridos).
- [ ] Test de `getTemplateConfig` retorna config correcta por tipo.

**Done:** `npm run test:ci` pasa verde.

## 🚫 Restricciones del Sprint

- NO implementar el editor de variables todavía (es Sprint 4).
- NO generar URLs públicas ni slugs.
- NO implementar RSVP funcional todavía (solo placeholder visual).
- NO modificar schema de Prisma.
- NO tocar lógica de pedidos del Sprint 2.

## 🧪 Tests Obligatorios

- `tests/unit/templates/render.test.tsx` — cada template renderiza sin crash
- `tests/unit/templates/config.test.ts` — getTemplateConfig correcto
- `tests/unit/templates/validation.test.ts` — datos incompletos manejados

## 🎯 Checkpoint

- [ ] 4 templates renderizan correctamente en `/demo/[tipo]`
- [ ] Galería en landing con imágenes reales
- [ ] Animaciones de entrada funcionan
- [ ] Responsive en móvil
- [ ] Tests pasan

## 🎬 Comando de Kickoff

```
Implementa el Sprint 3: Motor de Templates. Lee .opencode/architecture.md para el patrón de templates. Crea la arquitectura base, 4 templates visuales con Framer Motion, y galería en landing con demos navegables. Usa datos ficticios realistas para los demos. No implementes editor ni RSVP todavía. Escribe tests para cada template.
```

## 📊 Formato de Reporte

`sprint-03-report.md` con:
1. Archivos de templates creados
2. Decisiones de diseño (colores, animaciones)
3. Deuda técnica
4. Estado de tests
5. Notas para siguiente sprint
