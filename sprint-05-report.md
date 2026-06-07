# Reporte del Sprint 5: RSVP y Automatizaciones

Este reporte detalla los entregables de diseño, desarrollo y control de calidad realizados para la entrega del Sprint 5.

---

## 1. Archivos RSVP y Clonado

Se implementaron y modificaron los siguientes archivos clave para la funcionalidad del Sprint 5:

*   **Página Pública & Componentes de Confirmación:**
    *   [page.tsx](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/page.tsx) (Integración del formulario RSVP)
    *   [rsvp-form.tsx](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/rsvp-form.tsx) (Formulario de asistencia y modal animado)
    *   [actions.ts](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/actions.ts) (Server Action `createRSVPAction` para registrar confirmaciones)
*   **Detalle del Pedido & Panel RSVP de Administración:**
    *   [pedido-detalle-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/pedido-detalle-client.tsx) (Integración de tabla RSVP, clonación de pedidos y botón de notificaciones)
    *   [rsvp-table.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/rsvp-table.tsx) (Tabla de control de asistencia, resumen de pax, filtros y exportación CSV)
    *   [actions.ts](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/actions.ts) (Server Actions `getRSVPsByPedidoAction` y `clonarPedidoAction`)
*   **Servicio de Notificación & Dashboard:**
    *   [notificaciones.ts](file:///c:/Proyectos/Inv/src/lib/notificaciones.ts) (Generador del texto de invitación de WhatsApp)
    *   [page.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/page.tsx) (Badge "Próximo" para eventos agendados en ≤ 7 días)

---

## 2. Decisiones sobre Notificaciones

*   **Texto Preformateado vs API Real:** Se optó por generar texto listo para copiar y pegar (formato WhatsApp) en lugar de una integración directa de API (como Twilio o Cloud API). Esto permite validar la utilidad del mensaje sin incurrir en costos de suscripción ni complejidad de webhooks adicionales. La acción se realiza del lado del cliente mediante la Clipboard API del navegador de forma segura.

---

## 3. Deuda Técnica

*   **Paginación de Confirmaciones:** La tabla RSVP de administración realiza la renderización directa de todos los registros confirmados. Para pedidos con altos volúmenes de invitados (>300), se debería implementar paginación en el servidor o scroll infinito para optimizar el rendimiento del DOM en dispositivos de administración.
*   **Sanitización de Datos en CSV:** La exportación a CSV formatea cadenas escapando comillas dobles y comas. Para implementaciones robustas con soporte multi-idioma o caracteres especiales complejos, se recomienda usar una biblioteca robusta como `papaparse`.

---

## 4. Estado de los Tests

Se crearon 4 nuevos archivos de prueba obligatorios, los cuales pasaron exitosamente en verde junto con la suite existente (17 suites, 51 pruebas totales):

1.  `tests/integration/rsvp.test.ts` — Prueba la creación de RSVP en DB, control de pax para no-asistentes y validaciones Zod.
2.  `tests/integration/clonado.test.ts` — Valida la copia de pedidos, el estado inicial y el blanqueo de campos confidenciales y de publicación.
3.  `tests/unit/components/RSVPTable.test.tsx` — Verifica el renderizado de la tabla RSVP, sumatoria de pax y filtrado interactivo.
4.  `tests/unit/notificacion.test.ts` — Valida la generación correcta del mensaje preformateado para WhatsApp y sus fallbacks.

---

## 5. Notas para el Siguiente Sprint

*   **Seguridad y Sesiones:** Revisar el tiempo de expiración de sesiones del administrador.
*   **Mejoras en Edición:** Soporte para edición directa de pases/pax máximos por invitación si se requiere limitar la capacidad máxima por familia/grupo.
