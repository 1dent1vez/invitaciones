# 🚀 Sprint 5: RSVP y Automatizaciones — Prompt para Kilo Code

## 📖 Contexto Inicial (LEER ANTES DE CODEAR)

1. `.opencode/architecture.md` — Flujo RSVP, notificaciones, clonado
2. `.opencode/conventions.md` — Server actions, formularios
3. `src/app/(public)/i/[slug]/page.tsx` — Página pública existente
4. `src/app/(admin)/admin/pedidos/[id]/page.tsx` — Detalle de pedido existente

## 🎯 Objetivo del Sprint

- RSVP funcional desde invitación pública
- Panel de RSVP en admin con totales y export CSV
- Sistema de clonado de pedidos
- Notificaciones automáticas (texto de WA listo)

## 📝 Tareas Atómicas

### Paso 1: Formulario RSVP Público
- [ ] En la página pública `/i/[slug]`, añadir botón "Confirmar asistencia".
- [ ] Modal/formulario con campos: nombre, ¿asiste? (radio sí/no), número de personas (pax), teléfono, mensaje opcional.
- [ ] Server action `createRSVPAction`:
  - Recibe slug, busca pedido.
  - Valida datos (nombre obligatorio, pax ≥ 1).
  - Crea RSVP vinculado al pedido.
  - Retorna éxito.
- [ ] Feedback al usuario: "¡Gracias! Tu confirmación ha sido registrada."
- [ ] Diseño acorde al template (no romper el estilo visual).

**Done:** Un invitado puede confirmar asistencia desde su celular.

### Paso 2: Panel de RSVP Admin
- [ ] En `/admin/pedidos/[id]`, añadir sección "Confirmaciones".
- [ ] Tabla con: nombre, asiste (sí/no), pax, teléfono, mensaje, fecha.
- [ ] Totales: "X personas confirmadas de Y invitados esperados" (Y = precio/persona estimado o campo configurable en pedido).
- [ ] Server action `getRSVPsByPedidoAction`.
- [ ] Botón "Exportar a CSV" que genera y descarga CSV client-side.

**Done:** Ves quién confirmó, cuántos vienen, y puedes exportar.

### Paso 3: Sistema de Clonado
- [ ] Botón "Clonar pedido" en pedidos completados (`/admin/pedidos/[id]`).
- [ ] Server action `clonarPedidoAction(id)`:
  - Copia pedido existente.
  - Limpia: nombres, fecha evento, fotos, slug, urlPublica, qrUrl, datosJson parcial.
  - Estado inicial: "cotizado".
  - Redirige a editor del nuevo pedido.
- [ ] Abre editor con datos prellenados (tipo evento, template, precio, notas).

**Done:** Clonas un pedido anterior y en 5 minutos tienes uno nuevo listo para editar.

### Paso 4: Notificaciones Automáticas
- [ ] En detalle de pedido, botón "Notificar cliente" (visible cuando estado es "entregado" o "publicado").
- [ ] Al hacer click, generar texto preformateado para WhatsApp:
  ```
  ¡Hola [nombre cliente]! Tu invitación está lista 🎉
  Link: [url]
  QR: [qrUrl]
  ```
- [ ] Mostrar en un modal con textarea editable + botón "Copiar texto".
- [ ] No enviar WA automáticamente (no tenemos Twilio todavía). Solo generar texto listo para copiar/pegar.
- [ ] Recordatorios: en dashboard, mostrar pedidos con evento en ≤ 7 días (badge "Próximo").

**Done:** Click en "Notificar cliente" genera mensaje de WA listo para copiar.

### Paso 5: Tests
- [ ] Test integration: RSVP se crea correctamente, validaciones.
- [ ] Test integration: clonado copia datos excepto campos sensibles.
- [ ] Test componente: panel RSVP muestra totales correctos.
- [ ] Test unit: generación de texto de notificación.

**Done:** `npm run test:ci` pasa verde.

## 🚫 Restricciones del Sprint

- NO implementar envío real de WhatsApp (Twilio) todavía.
- NO modificar schema de Prisma (ya soporta RSVP y pedidos).
- NO tocar templates ni editor (solo añadir RSVP a página pública).
- NO implementar analytics todavía.

## 🧪 Tests Obligatorios

- `tests/integration/rsvp.test.ts` — crear RSVP, validaciones, totales
- `tests/integration/clonado.test.ts` — clonar pedido, verificar datos limpios
- `tests/unit/components/RSVPTable.test.tsx` — render + totales
- `tests/unit/notificacion.test.ts` — texto de WA generado correctamente

## 🎯 Checkpoint

- [ ] RSVP funcional desde celular
- [ ] Panel admin muestra confirmaciones y totales
- [ ] Exportar CSV funciona
- [ ] Clonado crea pedido limpio
- [ ] Notificación genera texto de WA
- [ ] Tests pasan

## 🎬 Comando de Kickoff

```
Implementa el Sprint 5: RSVP y Automatizaciones. Añade formulario RSVP a la invitación pública, panel de confirmaciones en admin con CSV, sistema de clonado de pedidos, y generador de texto de notificación para WhatsApp. No modifiques templates ni editor. Escribe tests para RSVP, clonado y notificaciones.
```

## 📊 Formato de Reporte

`sprint-05-report.md` con:
1. Archivos RSVP y clonado
2. Decisiones sobre notificaciones (texto vs API real)
3. Deuda técnica
4. Estado de tests
5. Notas para siguiente sprint
