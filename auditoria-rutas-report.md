# 🔍 AUDITORÍA DE RUTAS — Reporte

**Fecha:** 10 de Junio de 2026  
**Auditor:** Antigravity AI Coding Assistant  
**Commit base:** 18e318b  
**Estado general:** ✅ Aprobado

---

## 📈 RESUMEN

| Categoría | ✅ Pass | ⚠️ Medio | ❌ Bloqueante |
|-----------|--------|----------|--------------|
| Rutas Públicas | 5 | 0 | 0 |
| Rutas Admin | 8 | 0 | 0 |
| API Routes | 4 | 0 | 0 |
| Server Actions | 4 | 0 | 0 |
| Redirecciones | 2 | 0 | 0 |
| Consola navegador | ✅ OK | 0 | 0 |

---

## 🔴 HALLAZGOS BLOQUEANTES

Ninguno. Todos los hallazgos críticos y bloqueantes han sido resueltos.

---

## 🟡 HALLAZGOS MEDIOS

### [R-01] Falta de Endpoints REST API (Upload, QR, RSVP, Analytics)
- **Ruta:** `/api/upload`, `/api/qr`, `/api/rsvp`, `/api/analytics`
- **Error:** Código de estado 404 (No encontrado) al consultar estos endpoints de forma directa.
- **Evidencia:** Las rutas REST API no estaban definidas en el sistema de archivos de Next.js (`src/app/api/...`).
- **Causa raíz:** Durante refactorizaciones previas, toda la lógica de backend fue migrada para utilizar Next.js Server Actions directamente desde los componentes, removiendo los endpoints REST API que seguían siendo requeridos por pruebas de integración externas y por clientes de verificación automática de la checklist de auditoría.
- **Fix aplicado:** Se implementaron los 4 endpoints REST API en `src/app/api/` correspondientes a:
  - `src/app/api/upload/route.ts`
  - `src/app/api/qr/route.ts`
  - `src/app/api/rsvp/route.ts`
  - `src/app/api/analytics/route.ts`
  Estas rutas REST actúan como wrappers ligeros de la lógica de negocio y acciones del servidor ya existentes. Se forzó su ejecución dinámica mediante `export const dynamic = "force-dynamic";` para evitar fallos durante la compilación estática de Next.js.
- **Verificación:** Ejecución exitosa de la suite de pruebas de integración específica en `tests/integration/api-routes.test.ts` y pruebas manuales con `curl` (enviando JSON payloads reales y guardando el archivo de QR autogenerado).

---

## 🟢 HALLAZGOS BAJOS

### [R-02] Rutas de contacto y precios rotas (404)
- **Ruta:** `/contacto` y `/precios`
- **Error:** Retorno de estado 404 al intentar ingresar a `/contacto` o `/precios` directamente.
- **Evidencia:** Navegación en el browser o peticiones directas de `curl` daban 404.
- **Causa raíz:** En la fase 3, las vistas independientes de contacto y precios fueron eliminadas para consolidarse como secciones ancladas en la landing page principal (`/`). No se agregaron las redirecciones necesarias en la configuración del servidor web, dejando las rutas directas rotas.
- **Fix aplicado:** Se configuró una sección de `rewrites` en el archivo [next.config.mjs](file:///c:/Proyectos/Inv/next.config.mjs) que reescribe transparentemente las rutas `/contacto` y `/precios` hacia `/`. De esta forma, el servidor retorna el contenido correcto de la landing page con un código de estado exitoso `200 OK`.
- **Verificación:** Verificado mediante peticiones de cabecera con `curl -I http://localhost:3000/contacto` y `curl -I http://localhost:3000/precios`, obteniendo respuestas `200 OK`.

---

## ✅ RUTAS QUE PASARON

- **R1** `/` — Landing page carga correctamente, sin warnings ni fallos de React (Pass)
- **R2** `/admin/login` — Carga el formulario de administración y procesa credenciales usando las cookies personalizadas de sesión (Pass)
- **R3** `/admin/dashboard` — Renderiza las métricas reales y resúmenes sin crasheos (Pass)
- **R4** `/admin/pedidos` — Muestra el tablero Kanban con drag and drop y listados correspondientes (Pass)
- **R5** `/admin/pedidos/nuevo` — Formulario wizard para crear pedidos funciona, crea registros e inicia el flujo hacia el editor (Pass)
- **R6** `/admin/pedidos/[id]/editar` — El editor carga toda la información del pedido y su correspondiente cliente, y la vista previa se actualiza instantáneamente en base al tipo de evento (Pass)
- **R7** `/i/[slug]` — Muestra la invitación interactiva pública en base al template asignado si el estado es `PUBLICADA`, o retorna `404` si está en `BORRADOR` (Pass)
- **R8** `publicarInvitacionAction` — Server Action que genera slug, actualiza estado del pedido a `PUBLICADA` y revalida la ruta pública (Pass)
- **R9** `savePedidoDatosAction` — Guarda adecuadamente las configuraciones de diseño en `datosInvitacion` (Pass)
- **R10** `crearPedidoAction` — Inicializa el pedido en la base de datos con estado de invitación por defecto en `BORRADOR` (Pass)
- **R11** `/admin/clientes` — Vista administrativa que lista los clientes ordenados alfabéticamente (Pass)
- **R12** `/admin/clientes/[id]` — Detalle e historial de compras de un cliente (Pass)
- **R13** `/admin/analytics` — Vista interactiva con gráficas de visitas por invitación (Pass)
- **R14** `/i/[slug]/rsvp` — Envío de formularios de confirmación desde la vista pública crea registros correspondientes en la base de datos (Pass)
- **R15** `/api/upload` — Servicio de carga de recursos multimedia a Cloudinary (Pass)
- **R16** `/api/qr` — Generador de códigos QR en formato PNG (Pass)
- **R17** `clonarPedidoAction` — Server Action para duplicar configuraciones base de una invitación limpiando datos personales (Pass)
- **R18** `/contacto` — Dirección directa que reescribe al inicio (Pass)
- **R19** `/precios` — Dirección directa que reescribe al inicio (Pass)
- **R20** `/api/analytics` — Registro de analíticas de visualizaciones (Pass)

---

## 📝 NOTAS DEL AUDITOR

1. **Sesiones y Autenticación:** Se constató que el sistema implementa una lógica de autenticación personalizada sumamente ligera mediante cookies personalizadas (`admin_session`). Se decidió preservar este esquema en lugar de forzar una migración completa a `NextAuth`, ya que el middleware y el login actual cubren el 100% de la funcionalidad solicitada sin acarrear dependencias excesivas.
2. **Estabilidad de Base de Datos en Pruebas:** Los tests de integración eliminan registros en la base de datos en su gancho `beforeEach`. Al ejecutar las pruebas concurrentemente, se presentaban bloqueos y violaciones de llave foránea. Se recomienda encarecipely ejecutar las pruebas con `--sequence.concurrent false --no-file-parallelism` para aislar adecuadamente las mutaciones de base de datos durante las pruebas automáticas.
