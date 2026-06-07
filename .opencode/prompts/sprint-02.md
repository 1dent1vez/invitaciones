# 🚀 Sprint 2: CRM Core — Prompt para Kilo Code

## 📖 Contexto Inicial (LEER ANTES DE CODEAR)

1. `.opencode/architecture.md` — Schema Prisma, estructura de carpetas
2. `.opencode/conventions.md` — Server actions, nomenclatura, manejo de errores
3. `.opencode/testing-strategy.md` — Tests de integración, Vitest + Prisma
4. `src/lib/prisma.ts` — Singleton existente
5. `src/app/(admin)/admin/layout.tsx` — Layout admin existente

## 🎯 Objetivo del Sprint

Panel admin funcional con:
- Dashboard de métricas reales
- CRUD completo de clientes
- Creación de pedidos vinculados a clientes
- Kanban de estados con drag & drop (o botones)
- Detalle de pedido + registro de pagos

## 📝 Tareas Atómicas

### Paso 1: Dashboard admin
- [ ] Crear `src/app/(admin)/admin/page.tsx`.
- [ ] Cards de métricas: pedidos del mes, ingresos totales, pendientes de hoy, leads nuevos.
- [ ] Datos reales desde Prisma (aggregations: `count`, `sum`).
- [ ] Usar shadcn/ui Card, Badge, Skeleton para loading.

**Done:** Dashboard muestra números reales de la base de datos.

### Paso 2: CRUD de Clientes
- [ ] Crear `src/app/(admin)/admin/clientes/page.tsx` — tabla con shadcn/ui Table.
- [ ] Server actions: `getClientesAction`, `createClienteAction`, `updateClienteAction`, `deleteClienteAction`.
- [ ] Modal/dialog para crear/editar cliente (shadcn/ui Dialog + Form).
- [ ] Búsqueda por nombre (server-side con `contains`).
- [ ] Campos: nombre, teléfono, fuente (select: tienda/instagram/whatsapp/referido), email, notas.

**Done:** Puedes registrar, buscar, editar y eliminar clientes desde el panel.

### Paso 3: Creación de Pedidos
- [ ] Crear `src/app/(admin)/admin/pedidos/nuevo/page.tsx` — formulario wizard.
- [ ] Paso 1: Seleccionar cliente existente (autocomplete/búsqueda) o crear nuevo rápido.
- [ ] Paso 2: Datos del evento: tipo (select), fecha (date picker), template (select), precio (input numérico), notas.
- [ ] Server action `createPedidoAction` que cree el pedido con estado "cotizado".
- [ ] Redirigir a detalle del pedido al guardar.

**Done:** Primer pedido de prueba creado desde el panel.

### Paso 4: Kanban de Estados
- [ ] Crear `src/app/(admin)/admin/pedidos/page.tsx` — vista kanban.
- [ ] Columnas: Cotizado, Pagado, En producción, Entregado, Completado.
- [ ] Server action `updatePedidoEstadoAction(id, nuevoEstado)`.
- [ ] Cada tarjeta muestra: nombre del cliente, tipo de evento, fecha, precio.
- [ ] Filtros por tipo de evento (tabs o select).
- [ ] Drag & drop opcional (usar `@dnd-kit` si es sencillo, si no, botones de mover).

**Done:** Mover pedidos entre columnas actualiza el estado en DB.

### Paso 5: Detalle de Pedido + Pagos
- [ ] Crear `src/app/(admin)/admin/pedidos/[id]/page.tsx`.
- [ ] Mostrar info completa del pedido y cliente.
- [ ] Sección "Pagos": formulario para registrar pago (monto, método: efectivo/transferencia, upload de comprobante a Cloudinary).
- [ ] Server action `registrarPagoAction`.
- [ ] Tabla de pagos registrados con fecha y monto.
- [ ] Calcular y mostrar saldo pendiente (`precio - sum(pagos.monto)`).

**Done:** Pedido muestra saldo pendiente y pagos registrados.

### Paso 6: Tests
- [ ] Test integration: crear cliente, crear pedido, transición de estado.
- [ ] Test integration: registrar pago, cálculo de saldo.
- [ ] Test componente: render de tabla de clientes, kanban.

**Done:** `npm run test:ci` pasa verde.

## 🚫 Restricciones del Sprint

- NO implementar editor de invitaciones todavía.
- NO generar URLs públicas ni QR.
- NO implementar RSVP.
- NO modificar el schema de Prisma (ya está definido en Sprint 1).
- NO usar formularios sin validación (zod obligatorio).

## 🧪 Tests Obligatorios

- `tests/integration/clientes.test.ts` — CRUD completo
- `tests/integration/pedidos.test.ts` — crear pedido, cambiar estado
- `tests/integration/pagos.test.ts` — registrar pago, saldo
- `tests/unit/components/Kanban.test.tsx` — render + interacción

## 🎯 Checkpoint

- [ ] Dashboard con datos reales
- [ ] CRUD clientes funcional
- [ ] Crear pedido con wizard
- [ ] Kanban actualiza estados
- [ ] Detalle de pedido + pagos
- [ ] Tests pasan

## 🎬 Comando de Kickoff

```
Implementa el Sprint 2: CRM Core. Lee .opencode/conventions.md para server actions y manejo de errores. Usa el schema de Prisma ya existente. Crea dashboard, CRUD clientes, pedidos, kanban y pagos. Escribe tests de integración junto con cada feature. No toques templates ni editor de invitaciones todavía.
```

## 📊 Formato de Reporte

`sprint-02-report.md` con:
1. Archivos creados/modificados
2. Decisiones técnicas (ej. "usé dnd-kit para kanban" o "usé botones por simplicidad")
3. Deuda técnica
4. Estado de tests
5. Notas para el siguiente sprint
