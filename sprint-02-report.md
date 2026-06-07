# 🚀 Reporte de Finalización: Sprint 2 — CRM Core

## 1. Archivos Creados y Modificados

### 📂 Archivos Creados
* **Clientes (CRUD):**
  * [src/app/(admin)/admin/clientes/actions.ts](file:///c:/Proyectos/Inv/src/app/(admin)/admin/clientes/actions.ts) — Server Actions para consultar, crear, actualizar y eliminar clientes con validación Zod.
  * [src/app/(admin)/admin/clientes/clientes-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/clientes/clientes-client.tsx) — Componente cliente premium de administración de clientes con búsquedas, alertas y modales interactivos.
  * [src/app/(admin)/admin/clientes/page.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/clientes/page.tsx) — Página del servidor de Next.js que carga la lista inicial de clientes desde Prisma.
* **Pedidos (Kanban & Creación):**
  * [src/app/(admin)/admin/pedidos/actions.ts](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/actions.ts) — Server Actions para crear pedidos (con generación automática de slugs y resolución de colisiones) y actualizar estados del Kanban.
  * [src/app/(admin)/admin/pedidos/page.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/page.tsx) — Página del servidor que carga los pedidos para alimentar el tablero Kanban.
  * [src/app/(admin)/admin/pedidos/pedidos-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/pedidos-client.tsx) — Componente de Kanban interactivo con 5 columnas de estados, controles rápidos, filtrado por tipo de evento y búsqueda reactiva.
  * [src/app/(admin)/admin/pedidos/nuevo/page.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/nuevo/page.tsx) — Página contenedora del Wizard para crear un nuevo pedido.
  * [src/app/(admin)/admin/pedidos/nuevo/nuevo-pedido-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/nuevo/nuevo-pedido-client.tsx) — Formulario wizard de 2 pasos (Paso 1: Selección/creación rápida de cliente; Paso 2: Detalles del evento y plantilla) con feedback de carga y validaciones premium.
* **Detalle de Pedidos & Pagos:**
  * [src/app/(admin)/admin/pedidos/[id]/actions.ts](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/actions.ts) — Server Action para registro de abonos (`registrarPagoAction`), validando el límite de saldo y actualizando estados automáticamente.
  * [src/app/(admin)/admin/pedidos/[id]/page.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/page.tsx) — Página del servidor que carga la información completa del pedido con sus relaciones de pagos y cliente.
  * [src/app/(admin)/admin/pedidos/[id]/pedido-detalle-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/pedido-detalle-client.tsx) — Componente premium con información financiera interactiva, historial de pagos, balance pendiente y formulario de abono.
* **UI & Componentes shadcn:**
  * [src/components/ui/dialog.tsx](file:///c:/Proyectos/Inv/src/components/ui/dialog.tsx) — Diálogos modales adaptados a la base del boilerplate.
  * [src/components/ui/table.tsx](file:///c:/Proyectos/Inv/src/components/ui/table.tsx) — Tablas con diseño oscuro y estilizado.
* **Pruebas Unitarias y de Integración:**
  * [tests/integration/clientes.test.ts](file:///c:/Proyectos/Inv/tests/integration/clientes.test.ts) — Test de integración para CRUD completo de clientes y constraints de eliminación.
  * [tests/integration/pedidos.test.ts](file:///c:/Proyectos/Inv/tests/integration/pedidos.test.ts) — Test de integración para flujos de pedido y lógica de colisión de slugs únicos.
  * [tests/integration/pagos.test.ts](file:///c:/Proyectos/Inv/tests/integration/pagos.test.ts) — Test de integración de cobros, cálculo de saldos y transición a estado pagado.
  * [tests/unit/components/Kanban.test.tsx](file:///c:/Proyectos/Inv/tests/unit/components/Kanban.test.tsx) — Test de interfaz para interacción y filtrado del Kanban de pedidos.

### 📝 Archivos Modificados
* [src/app/(admin)/admin/page.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/page.tsx) — Reemplazados los números estáticos del dashboard por consultas de agregación reales en Prisma (`count` y `sum`).
* [tests/setup.ts](file:///c:/Proyectos/Inv/tests/setup.ts) — Mockeado el módulo de Next.js `next/cache` para evitar que el método `revalidatePath` falle durante las pruebas de integración en entorno aislado.

---

## 2. Decisiones Técnicas Tomadas

1. **Resolución de Invariancia en React Hook Form y Zod Resolver:**
   * *Razón:* Al utilizar `z.preprocess` para campos numéricos (`precio`, `monto`) o `.transform` para campos opcionales/nulos, el tipo de entrada (*input*) y de salida (*output*) del esquema difieren. RHF define su tipo genérico de forma estricta (invariante) lo que provoca fallos del compilador al enlazar `zodResolver(schema)`. Lo resolvimos importando `Resolver` de `react-hook-form` y realizando un cast seguro sin hacer uso de `any` (por ejemplo: `resolver: zodResolver(pagoSchema) as unknown as Resolver<PagoInput>`).
2. **Instanciación de `Decimal` en el Cliente:**
   * *Razón:* Prisma maneja los campos numéricos exactos como `Decimal`. Para realizar actualizaciones optimistas y tipar correctamente el estado local del componente cliente sin importar recursos exclusivos del servidor, importamos el objeto isomorphic `Prisma` desde `@prisma/client` y usamos `new Prisma.Decimal(data.monto)` directamente.
3. **Manejo Seguro de Nulos en el Buscador:**
   * *Razón:* El esquema de base de datos tiene la propiedad `slug` de pedidos marcada como opcional/nula. El compilador de TypeScript lanza errores al intentar ejecutar `.toLowerCase()` en propiedades potencialmente nulas. Añadimos un fallback robusto `(p.slug || "").toLowerCase()`.
4. **Mock global de `revalidatePath` en Vitest:**
   * *Razón:* Ejecutar Server Actions en test unitarios/integración sin un contexto de servidor de Next.js activo arroja el error `Invariant: static generation store missing`. Mockear `next/cache` globalmente resolvió el problema sin afectar la lógica del test.

---

## 3. Deuda Técnica Identificada

* **Subida de Comprobantes:** Actualmente, el campo de comprobante en la Server Action y base de datos se maneja como string (almacena el link). Se dejó listo el espacio del formulario para la subida real a Cloudinary, la cual se integrará en sprints posteriores.
* **Cierre de Pedidos Completados:** La transición a estado "pagado" es automática al liquidar el saldo, pero el paso a "completado" o "entregado" queda a discreción del administrador en el Kanban.
* **Paginación en Tablas:** Actualmente la consulta de clientes carga la totalidad de la base. Se recomienda paginar en el servidor en el Sprint 6 para mejorar el rendimiento cuando la cartera de clientes aumente a miles.

---

## 4. Estado de los Tests

Tanto las pruebas unitarias de frontend como los tests de integración de base de datos son completamente exitosos:

* **Suite de Pruebas Ejecutadas:** `npx vitest run --pool=forks --maxWorkers=1`
* **Test Files:** 6 pasados (100%)
* **Total de Pruebas:** 21 pasadas:
  * **Clientes (5):** Creación exitosa, restricciones de longitud de caracteres, actualizaciones, eliminación y bloqueos si el cliente tiene pedidos.
  * **Pedidos (4):** Creación válida, unicidad e incrementos de sufijos numéricos en slugs ante colisiones de nombre, y transiciones de estado correctas/incorrectas.
  * **Pagos (3):** Registro de pagos exitosos, cálculo e impedimento de exceder el saldo del pedido, y cambio automático de estado a 'pagado' al liquidar balance.
  * **Auth/Landing/Kanban (9):** Login y middleware, Landing page premium, y filtro reactivo de tarjetas en Kanban.

---

## 5. Próximo Sprint: Preparativos y Notas

Para el **Sprint 3 (Plantillas y Editor de Invitaciones)**:
1. **Modelos del Schema de Prisma listos:** El modelo `Pedido` ya cuenta con el campo `template` (por ejemplo: `boda-elegante`) para vincularse al editor y visor correspondiente.
2. **Estrategia de visualización:** Las invitaciones públicas se resolverán mediante el slug único del pedido (ejemplo: `/invitacion/maria-y-juan-2026`).
