# 📊 AUDITORÍA FASE CUMPLEAÑOS — Reporte

**Fecha:** 2026-06-08  
**Auditor:** Agente de Código  
**Commit base:** c69a704d5372e6289924f74e5904038d7a250d6b  
**Total checks:** 96  
**Estado general:** ❌ Rechazado (11 hallazgos bloqueantes detectados que impiden la compilación de producción y comprometen la integridad de datos)

---

## 📈 RESUMEN EJECUTIVO

| Categoría | ✅ Pass | ⚠️ Medio | ❌ Bloqueante | 🟢 Bajo |
|-----------|:-------:|:--------:|:------------:|:-------:|
| 1. Configuración | 7 | 1 | 1 | 0 |
| 2. Schema | 7 | 1 | 1 | 0 |
| 3. Templates | 5 | 3 | 2 | 0 |
| 4. Editor | 12 | 1 | 1 | 0 |
| 5. Borradores | 7 | 1 | 4 | 0 |
| 6. Preview | 8 | 1 | 0 | 1 |
| 7. Wizard | 8 | 1 | 0 | 0 |
| 8. Integración | 4 | 5 | 1 | 0 |
| 9. Tests | 6 | 1 | 0 | 0 |
| 10. Performance & Build | 4 | 1 | 1 | 0 |
| **Total** | **68** | **16** | **11** | **1** |

**Total:** 68/96 checks pasados (70.8% de éxito)

---

## 🔴 HALLAZGOS BLOQUEANTES

### [ID-01] Propiedad `tipoEvento` no declarada en configuración
- **Check:** #1.9 — `tipoEvento` es consistente
- **Archivo:** `src/lib/paquetes.ts`
- **Descripción:** La interfaz `PaqueteConfig` y los objetos definidos dentro del record `CONFIGURACION_EVENTOS` carecen de la propiedad `tipoEvento`. Aunque está implícito en el mapeo de claves de la constante, el checklist exige la presencia explícita de `tipoEvento: "cumpleanos"`.
- **Evidencia:**
  * En la línea 25 de [paquetes.ts](file:///c:/Proyectos/Inv/src/lib/paquetes.ts#L25-L30):
    ```typescript
    export interface PaqueteConfig {
      precio: number;
      secciones: string[];
      campos: CampoConfig[];
      implementado: boolean;
    }
    ```
- **Impacto:** Rompe el estándar de tipado plano e impide obtener el tipo de evento directamente desde un objeto `PaqueteConfig` en otras partes del aplicativo.
- **Recomendación:** Declarar `tipoEvento: TipoEvento` en el contrato de la interfaz `PaqueteConfig` y asignarlo en cada definición de paquete.

### [ID-02] Inexistencia del campo e itinerario de estado de Invitación en Schema
- **Check:** #2.5 — Modelo `Invitacion` tiene `estado`
- **Archivo:** `prisma/schema.prisma`
- **Descripción:** No existe un modelo `Invitacion` ni un campo de estado de la invitación con el enum `["borrador", "publicada", "archivada"]`. El modelo `Pedido` asume este rol de forma implícita, pero solo almacena el estado comercial del pedido (`estado` = `cotizado | pagado | en_produccion | entregado | completado`).
- **Evidencia:**
  * En [schema.prisma](file:///c:/Proyectos/Inv/prisma/schema.prisma#L31):
    ```prisma
    estado       String   @default("cotizado") // cotizado | pagado | en_produccion | entregado | completado
    ```
- **Impacto:** Dificulta separar el ciclo de vida de la publicación de la invitación (borrador/publicado) del estado financiero o de entrega del pedido físico/digital.
- **Recomendación:** Crear un campo `estadoInvitacion` en la tabla `Pedido` (ej. `BORRADOR`, `PUBLICADA`, `ARCHIVADA`) para aislar la lógica del ciclo de vida web.

### [ID-03] Campos faltantes en el Template Premium
- **Check:** #3.4 — Template Premium renderiza todos sus campos
- **Archivo:** `src/components/templates/cumpleanos/CumplePremium.tsx` y `src/lib/paquetes.ts`
- **Descripción:** El template premium carece de campos obligatorios/opcionales estipulados por el checklist: `fechaLimiteRSVP`, `mensajeAgradecimiento`, `confettiAnimacion` (toggle) y `cuentaRegresiva`.
- **Evidencia:** El archivo `CumplePremium.tsx` no lee ni maneja de ninguna forma `fechaLimiteRSVP`, `mensajeAgradecimiento`, `confettiAnimacion` o `cuentaRegresiva`. La animación de confeti es fija por CSS y no existe componente/módulo de cuenta regresiva.
- **Impacto:** Se está cobrando $850 MXN por un paquete Premium que carece de las funcionalidades exclusivas principales (RSVP dinámico, cronómetro y confeti dinámico interactivo).
- **Recomendación:** Declarar dichos campos en `paquetes.ts` e implementar el contador animado en `CumplePremium.tsx` junto con un trigger real de confeti por javascript.

### [ID-04] OG Tags dinámicos rotos para Cumpleaños
- **Check:** #3.8 — OG tags dinámicos
- **Archivo:** `src/app/(public)/i/[slug]/page.tsx`
- **Descripción:** El generador de metadatos dinámica (`generateMetadata`) mapea los datos empleando propiedades exclusivas de bodas (`datos.nombres` y `datos.portadaUrl`), ignorando las claves usadas para cumpleaños (`datos.nombre` y `datos.fotoPortada`).
- **Evidencia:**
  * En [page.tsx](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/page.tsx#L33-L34):
    ```typescript
    const datos = order.datosJson as unknown as InvitacionData;
    const title = datos.nombres || "Invitación Especial";
    ```
  * En [page.tsx](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/page.tsx#L52):
    ```typescript
    const ogImage = datos.portadaUrl || (datos.fotos && datos.fotos[0]) || ...
    ```
- **Impacto:** Las invitaciones públicas de cumpleaños que se compartan por chat o redes sociales muestran metadatos genéricos fallbacks ("Invitación Especial" de título e imagen decorativa genérica) en lugar de la foto y nombre del festejado.
- **Recomendación:** Adecuar las condiciones en `generateMetadata` de acuerdo al `order.tipoEvento`. Si es `cumpleanos`, leer `datos.nombre` y `datos.fotoPortada`.

### [ID-05] Galería de imágenes no soporta Multi-Upload en el Editor
- **Check:** #4.8 — Galería de imágenes permite agregar/eliminar/reordenar
- **Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`
- **Descripción:** El campo `fotosGaleria` se trata como un tipo `image` común en el editor, por lo que solo permite subir un único archivo de imagen. No se provee interfaz tipo grilla para subir múltiples fotos ni lógica para reordenar o eliminar ítems individuales.
- **Evidencia:**
  * En [templates.ts](file:///c:/Proyectos/Inv/src/lib/templates.ts#L48):
    ```typescript
    type: c.tipo === "upload" ? "image" : (c.tipo as any), // Map upload to image for compatibility
    ```
  * En [editor-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx#L941-L960) se evalúa y renderiza únicamente como una sola imagen.
- **Impacto:** Limitación crítica de las plantillas Completa (máx 3 fotos) y Premium (máx 6 fotos). El administrador solo puede almacenar una foto en lugar de un set de imágenes.
- **Recomendación:** Crear un componente `MultiImageUploader` dentro del editor que serialice un array de URLs de Cloudinary en `datosJson`.

### [ID-06] Inexistencia de Guardado Automático
- **Check:** #5.2 — Guardado automático cada 30 segundos
- **Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`
- **Descripción:** No se ha implementado ninguna lógica de guardado automático programado o por debounce en el componente cliente del editor.
- **Evidencia:** El archivo `editor-client.tsx` carece de llamadas a `useEffect`, hooks `useDebounce` u objetos `setInterval` / `setTimeout` vinculados al guardado del formulario.
- **Impacto:** Alto riesgo de pérdida de información si el usuario recarga la página por error, pierde conexión a Internet o cierra la pestaña de forma accidental.
- **Recomendación:** Implementar un efecto secundario que observe cambios en el formulario y ejecute `savePedidoDatosAction` automáticamente tras 30 segundos de inactividad.

### [ID-07] Pérdida de datos al recargar el Editor (Borrador Roto)
- **Check:** #5.6 — Borrador recupera datos al recargar / #5.11 — No hay pérdida de datos
- **Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`
- **Descripción:** El objeto `defaultValues` que inicializa el formulario omite la gran mayoría de los campos específicos implementados para Cumpleaños (tales como `nombre`, `edad`, `lugar`, `direccion`, `fotoPortada`, `tipoCelebracion`, `mensajeFestejo`, `itinerario`, `datosRegalo`, etc.).
- **Evidencia:**
  * En [editor-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx#L375-L391):
    ```typescript
    const defaultValues = useMemo<EditorFormValues>(() => ({
      nombres: dbDatos.nombres || pedido.cliente?.nombre || "",
      fechaPart: initialDateParts.fechaPart,
      horaPart: initialDateParts.horaPart,
      ubicacion: dbDatos.ubicacion || pedido.notas || "",
      mapaUrl: dbDatos.mapaUrl || "",
      ...
    }), [...]);
    ```
- **Impacto:** Al volver a abrir o refrescar el editor, todos los campos dinámicos de cumpleaños cargan en blanco en el panel izquierdo (formulario). Si el administrador guarda borrador nuevamente, se sobrescribe la base de datos con estos campos vacíos, borrando permanentemente el trabajo previo.
- **Recomendación:** Mapear todos los campos dinámicos de cumpleaños en `defaultValues` extrayéndolos de `dbDatos`.

### [ID-08] Invitación en Borrador accesible públicamente
- **Check:** #5.7 — Borrador no publica la invitación
- **Archivo:** `src/app/(admin)/admin/pedidos/actions.ts` y `src/app/(public)/i/[slug]/page.tsx`
- **Descripción:** Al crear un pedido en el Wizard, se le genera inmediatamente un slug y se le construye una `urlPublica` activa en la base de datos.
- **Evidencia:**
  * En [actions.ts](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/actions.ts#L61-L98):
    ```typescript
    const slug = await getUniqueSlug(client.nombre, eventDate);
    ...
    const pedido = await prisma.pedido.create({
      data: {
        ...
        slug,
        urlPublica: `http://localhost:3000/i/${slug}`,
      }
    });
    ```
- **Impacto:** Cualquier persona que intente adivinar la URL pública usando el nombre del cliente podrá ver el borrador desordenado e incompleto de la invitación en tiempo real, antes de que el administrador decida "Publicar".
- **Recomendación:** El campo `slug` y `urlPublica` deben crearse únicamente al llamar a `publicarInvitacionAction`. Adicionalmente, el resolver de la ruta `/i/[slug]` debe retornar `notFound()` si el pedido tiene un estado diferente de `"entregado"`.

### [ID-09] Playwright E2E Test Totalmente Roto
- **Check:** #8.1 — Flujo completo (E2E)
- **Archivo:** `tests/e2e/flujo-completo.spec.ts`
- **Descripción:** Las pruebas de Playwright fallan de forma absoluta: intentan seleccionar el tipo de evento `"boda"` (el cual está deshabilitado en el Wizard), interactuar con inputs de texto obsoletos en el editor (`name="ubicacion"`) y presionar un botón con el texto `"Guardar Cambios"` en lugar de `"Guardar borrador"`.
- **Evidencia:**
  * En [flujo-completo.spec.ts](file:///c:/Proyectos/Inv/tests/e2e/flujo-completo.spec.ts#L36-L54):
    ```typescript
    await page.selectOption('select[name="tipoEvento"]', 'boda');
    ...
    await page.fill('input[name="ubicacion"]', 'Salón Real...');
    await page.click('button[type="submit"]:has-text("Guardar Cambios")');
    ```
- **Impacto:** El pipeline de integración continua (CI) arroja fallos en todas las ejecuciones, impidiendo automatizar la entrega de releases sin bugs.
- **Recomendación:** Actualizar la especificación para que complete el flujo utilizando `"cumpleanos"`, los nombres de input correspondientes y los selectores reales de botón.

### [ID-10] Fallo de compilación del Build (ESLint Blocker)
- **Check:** #10.1 — `npm run build` pasa sin errores
- **Archivo:** Múltiples archivos (`src/app/(admin)/admin/pedidos/actions.ts`, `editor-client.tsx`, `CumpleCompleta.tsx`, `CumplePremium.tsx`, `templates.ts`).
- **Descripción:** La compilación (`next build`) aborta debido a errores estrictos de ESLint en TypeScript (uso de tipo `any` y variables importadas que no son utilizadas).
- **Evidencia:**
  * Registro de error de compilación:
    ```bash
    Failed to compile.
    ./src/app/(admin)/admin/pedidos/actions.ts
    98:40  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
    ./src/components/templates/cumpleanos/CumpleCompleta.tsx
    4:45  Error: 'Music' is defined but never used.  @typescript-eslint/no-unused-vars
    ```
- **Impacto:** Bloqueo crítico del despliegue del proyecto. Ningún cambio puede ser subido al servidor en producción (Vercel).
- **Recomendación:** Eliminar las variables sin usar en las plantillas y reemplazar el uso de `any` por tipos adecuados o typecasting seguro (`unknown`).

---

## 🟡 HALLAZGOS MEDIOS

### [ID-11] Estructuras y campos de paquetes no implementados poblados
- **Check:** #1.7 — Campos de paquetes NO implementados están vacíos o null
- **Archivo:** `src/lib/paquetes.ts`
- **Descripción:** Los 9 paquetes que muestran "Próximamente" (Boda, XV, Baby Shower) poseen definiciones de campos y secciones completas en lugar de estar limpios o vacíos, lo que confunde el alcance real implementado.
- **Recomendación:** Inicializar `campos` y `secciones` en arrays vacíos o setearlos en `null` para los eventos no implementados en esta fase.

### [ID-12] Nombre de campo en base de datos incongruente
- **Check:** #2.3 — Modelo `Pedido` tiene `datosInvitacion`
- **Archivo:** `prisma/schema.prisma`
- **Descripción:** El campo JSON destinado para guardar datos dinámicos se llama `datosJson` en lugar de `datosInvitacion` como solicita la especificación de la checklist.
- **Recomendación:** Se puede renombrar el campo a través de una migración, o en su defecto, dejarlo mapeado en la documentación para prevenir futuros errores conceptuales.

### [ID-13] Ignorancia de campos válidos en plantillas Esencial/Completa
- **Check:** #3.2 y #3.3 — Renders de campos de Esencial y Completa
- **Archivo:** `src/components/templates/cumpleanos/CumpleEsencial.tsx` y `CumpleCompleta.tsx`
- **Descripción:** Campos provistos en el Wizard y configurador como `tipoCelebracion` y `whatsapp` no son consumidos ni pintados por estas plantillas.
- **Recomendación:** Ajustar los componentes para que rendericen un link para enviar mensajes directos de WhatsApp o reflejen el tipo de fiesta (Adultos/Infantil/Sorpresa).

### [ID-14] Meta tags por defecto en ruta pública para Cumpleaños
- **Check:** #3.9 — Meta tags correctos
- **Archivo:** `src/app/(public)/i/[slug]/page.tsx`
- **Descripción:** Los meta tags `<title>` y `<meta name="description">` del sitio cargan por defecto en boda ya que dependen de `datos.nombres` en lugar de `datos.nombre`.
- **Recomendación:** Corregir los fallbacks en `generateMetadata` de igual forma que con las OG tags.

### [ID-15] Ausencia de Skeletons / Loaders en el Editor
- **Check:** #4.12 — Editor maneja estado de "cargando"
- **Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`
- **Descripción:** El panel de edición izquierdo no muestra estados intermedios de carga ni componentes visuales skeleton durante la inicialización de los datos.
- **Recomendación:** Renderizar skeletons o un spinner de carga global en el panel del formulario mientras React Hook Form carga sus valores por defecto.

### [ID-16] Falta de revalidación forzada de OG Tags dinámicos
- **Check:** #5.10 — Publicar actualiza OG tags
- **Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/actions.ts`
- **Descripción:** La publicación no limpia de forma consistente cachés perimetrales CDN que afecten a la lectura de metadatos dinámicos del slug recién generado.
- **Recomendación:** Utilizar mecanismos de purga manual de caché en Vercel o tags de revalidación específicos para las invitaciones públicas.

### [ID-17] Falta de toggle "Vista Desktop" en el simulador
- **Check:** #6.7 — Preview tiene toggle "Vista Mobile/Desktop"
- **Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`
- **Descripción:** No hay interruptor para visualizar la plantilla final en una resolución desktop simulada; la vista previa se halla fija a la simulación móvil (`Smartphone`).
- **Recomendación:** Añadir una barra de toggle que modifique el tamaño máximo del contenedor de la invitación entre `max-w-[360px]` (mobile) y `max-w-[100%]` (desktop).

### [ID-18] Falta de validación estricta de teléfono en el Wizard
- **Check:** #7.9 — Wizard valida campos obligatorios del cliente
- **Archivo:** `src/app/(admin)/admin/pedidos/nuevo/nuevo-pedido-client.tsx`
- **Descripción:** La validación de Zod para teléfonos de clientes es laxa y permite guardar cualquier tipo de carácter sin validar una longitud mínima de 10 números.
- **Recomendación:** Implementar un validador regex (`/^[0-9]{10}$/`) en Zod para el campo `telefono`.

### [ID-19] Notificación de WhatsApp con texto incompleto
- **Check:** #8.5 — Notificación WA genera texto con datos correctos
- **Archivo:** `src/lib/notificaciones.ts`
- **Descripción:** El generador de texto para notificaciones de WhatsApp solo envía el nombre del cliente y los enlaces, omitiendo la fecha, la hora o el lugar del evento.
- **Recomendación:** Modificar la función para que reciba estos parámetros e incluya una plantilla de texto más informativa.

### [ID-20] Badge de Tipo de Evento crudo en Panel Kanban
- **Check:** #8.6 — Panel admin muestra pedidos de cumpleaños con badge correcto
- **Archivo:** `src/app/(admin)/admin/pedidos/pedidos-client.tsx`
- **Descripción:** El badge que identifica al pedido en las tarjetas del Kanban renderiza el string en crudo (`"cumpleanos"`) sin traducción amistosa.
- **Recomendación:** Mapear los nombres de eventos mediante un objeto diccionario (ej. `cumpleanos: "Cumpleaños"`) antes de renderizarlos.

### [ID-21] Búsqueda de Pedidos en Kanban no incluye el Nombre del Festejado
- **Check:** #8.8 — Búsqueda de pedidos funciona con nuevos campos
- **Archivo:** `src/app/(admin)/admin/pedidos/pedidos-client.tsx`
- **Descripción:** La barra de filtrado busca sobre `cliente.nombre` (comprador) y `slug` del pedido, pero no revisa el nombre del festejado contenido dentro del JSON `datosJson`.
- **Recomendación:** Extender el filtro para incluir una evaluación sobre `datosJson.nombre` y `datosJson.nombres`.

### [ID-22] Clonador de Pedidos copia datos sensibles de cumpleaños
- **Check:** #8.9 — Clonado de pedido limpia datos sensibles
- **Archivo:** `src/app/(admin)/admin/pedidos/[id]/actions.ts`
- **Descripción:** El clonador limpia los campos de boda `nombres`, `portadaUrl` y `fotos`, pero deja intactos `nombre`, `fotoPortada` y `fotosGaleria`, provocando que el clon herede los datos del cumpleaños anterior.
- **Recomendación:** Incluir el limpiado de `nombre`, `fotoPortada` y `fotosGaleria` en `clonarPedidoAction`.

### [ID-23] Exportación RSVP CSV carece de Metadatos del Evento
- **Check:** #8.10 — Export CSV de RSVP incluye datos de cumpleaños
- **Archivo:** `src/app/(admin)/admin/pedidos/[id]/rsvp-table.tsx`
- **Descripción:** El CSV exportado solo lista invitados confirmados sin añadir una fila inicial con el nombre y fecha del cumpleaños.
- **Recomendación:** Concatenar filas iniciales en el string de CSV que contengan la información del pedido.

### [ID-24] Ejecución cruzada en Vitest con archivos Playwright E2E
- **Check:** #9.6 — Tests pasan en CI
- **Archivo:** `vitest.config.ts`
- **Descripción:** Vitest escanea los archivos `*.spec.ts` de Playwright lanzando errores de importación al ejecutar las suites unitarias.
- **Recomendación:** Declarar `exclude: ['**/tests/e2e/**']` en el bloque de configuraciones de test de `vitest.config.ts`.

### [ID-25] Advertencias de ESLint críticas en código React
- **Check:** #10.3 — No hay console warnings críticos
- **Archivo:** Múltiples archivos (`CumpleCompleta.tsx`, `CumpleEsencial.tsx`, `CumplePremium.tsx`, `XVModerno.tsx`).
- **Descripción:** Múltiples advertencias por dependencias de hook en `useEffect` y uso de `<img>` en lugar del componente `<Image />` de Next.js.
- **Recomendación:** Resolver los arreglos de dependencias de hooks e implementar el cargador dinámico de imágenes optimizado.

---

## 🟢 HALLAZGOS BAJOS / MEJORAS

### [ID-26] Ausencia de marca de agua en la Vista Previa
- **Check:** #6.9 — Preview muestra watermark o indicador de borrador
- **Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`
- **Descripción:** El renderizado del simulador de celular no tiene ninguna etiqueta flotante o marca de agua traslúcida que identifique el render como una vista previa (ej. "Borrador de prueba"), lo que podría confundir a usuarios inexpertos.
- **Recomendación:** Añadir un overlay absoluto con baja opacidad y el texto "VISTA PREVIA".

---

## 📋 PLAN DE CORRECCIÓN

### Fase 1: Bloqueantes (Antes de deploy)
| ID | Hallazgo | Archivo | Estimación | Prioridad |
|----|----------|---------|------------|-----------|
| ID-10 | Error ESLint bloquea Build NextJS | Múltiples archivos | 1.0 h | P0 |
| ID-07 | Pérdida de datos en Editor al refrescar | `editor-client.tsx` | 1.0 h | P0 |
| ID-08 | URL del borrador es pública al crear pedido | `actions.ts` / `page.tsx` | 2.0 h | P0 |
| ID-05 | No hay multi-upload de galería en Editor | `editor-client.tsx` | 3.0 h | P0 |
| ID-03 | Falta cronómetro, confetti y rsvp en Premium | `CumplePremium.tsx` | 3.0 h | P0 |
| ID-04 | OG Tags dinámicos rotos para cumpleaños | `i/[slug]/page.tsx` | 1.0 h | P0 |
| ID-09 | Playwright E2E script obsoleto y roto | `tests/e2e/flujo-completo.spec.ts` | 1.5 h | P0 |
| ID-06 | Falta de auto-guardado en editor | `editor-client.tsx` | 1.5 h | P1 |
| ID-01 | Falta `tipoEvento` en config de paquetes | `src/lib/paquetes.ts` | 1.0 h | P1 |
| ID-02 | Falta estado de borrador en schema DB | `prisma/schema.prisma` | 2.0 h | P1 |

### Fase 2: Medios (Próximo sprint)
| ID | Hallazgo | Archivo | Estimación | Prioridad |
|----|----------|---------|------------|-----------|
| ID-13 | Campos inactivos en plantilla Esencial/Completa | `CumpleEsencial.tsx` / `CumpleCompleta.tsx` | 1.5 h | P1 |
| ID-17 | Falta toggle Desktop/Mobile en preview | `editor-client.tsx` | 2.0 h | P1 |
| ID-21 | Búsqueda Kanban no incluye festejados | `pedidos-client.tsx` | 1.5 h | P1 |
| ID-22 | Clonador de pedidos arrastra datos sensibles | `src/app/(admin)/admin/pedidos/[id]/actions.ts` | 1.0 h | P1 |
| ID-24 | Vitest interfiere con Playwright specs | `vitest.config.ts` | 0.5 h | P1 |
| ID-25 | Múltiples warnings de React/ESLint | Múltiples plantillas | 2.0 h | P1 |
| ID-11 | Limpiar paquetes no implementados | `src/lib/paquetes.ts` | 1.0 h | P2 |
| ID-12 | Nombre de campo `datosJson` en db schema | `schema.prisma` | 1.5 h | P2 |
| ID-14 | Meta tags fallbacks erróneos | `i/[slug]/page.tsx` | 1.0 h | P2 |
| ID-15 | Falta skeleton/loader en inputs de editor | `editor-client.tsx` | 1.5 h | P2 |
| ID-16 | Revalidación / Purga de caché OG Tags | `editor-client.tsx` | 1.0 h | P2 |
| ID-18 | Validar formato de teléfono en Wizard | `nuevo-pedido-client.tsx` | 1.0 h | P2 |
| ID-19 | WhatsApp notificaciones incompletas | `notificaciones.ts` | 1.0 h | P2 |
| ID-20 | Badge de evento crudo en Kanban | `pedidos-client.tsx` | 1.0 h | P2 |
| ID-23 | CSV RSVP no exporta metadatos | `rsvp-table.tsx` | 1.0 h | P2 |

### Fase 3: Bajos (Backlog)
| ID | Hallazgo | Archivo | Estimación | Prioridad |
|----|----------|---------|------------|-----------|
| ID-26 | Agregar marca de agua a Preview | `editor-client.tsx` | 0.5 h | P2 |

---

## ✅ CHECKS QUE PASARON (Resumen)

- **#1.1 Existe `src/lib/paquetes.ts`**: El archivo de configuración existe y exporta la estructura base correctamente.
- **#1.2 Hay exactamente 12 paquetes definidos**: El listado cuenta con todos los paquetes futuros.
- **#1.3 Solo 3 paquetes de Cumpleaños tienen `implementado: true`**: El control estratégico del sprint está activado para cumpleaños.
- **#1.4 Precios correctos**: Las tarifas base coinciden con los montos acordados ($350, $550, $850).
- **#2.1 El modelo `Pedido` tiene `tipoEvento`**: Campo String correctamente indexado.
- **#2.2 El modelo `Pedido` tiene `paquete`**: Campo String correctamente indexado.
- **#2.4 El modelo `Pedido` tiene `slug`**: Campo único e indexado correctamente en Postgres.
- **#2.7 Migraciones aplicadas en Neon**: Todas las migraciones se hallan actualizadas e integradas en la nube.
- **#3.1 Existen 3 templates de cumpleaños**: Ficheros react independientes de cumpleaños.
- **#3.5 Diseño es "festivo"**: Excelencia estética de colores neón y temas oscuros moderna.
- **#3.6 Templates NO implementados usan fallback**: El componente `Proximamente.tsx` funciona graceful.
- **#4.1 Editor carga campos según paquete**: Panel izquierdo dinámico exitoso.
- **#4.3 Split screen funciona**: Diseños flexibles y amigables side-by-side.
- **#4.4 Preview en tiempo real reactiva**: Actualización al presionar teclas sin lag visible.
- **#4.7 Upload Cloudinary**: Integración de API con optimizaciones dinámicas de imagen correctas.
- **#7.1 Selección de evento exclusivo en Wizard**: Bloquea bodas, xv, babyshower gracefully.
- **#7.7 Cálculo de precios automático**: Sincroniza tarifas de paquetes al instante.
- **#8.2 Flujo RSVP (Base de Datos)**: Creación de confirmación persistente exitosa.
- **#8.3 Contador de Visitas (Analytics)**: Suma de visitas en base de datos al renderizar invitación pública correcta.
- **#9.2 Tests unitarios de templates**: Pruebas de renderizado pasando en el runner.
- **#9.3 Tests unitarios del editor**: Pruebas de simulación de inputs y guardados pasando.

---

## 📝 NOTAS DEL AUDITOR

* **Entorno de Tests e Interferencia de Neon DB**: Al ejecutar los tests de integración de base de datos de forma paralela en el mismo Neon Postgres, los procesos de vaciado (`deleteMany`) interfieren entre sí arrojando errores falsos-positivos de foreign key constraint violations. Se comprobó que al forzar la ejecución secuencial (`vitest run --sequence.concurrent false --no-file-parallelism`), las 22 suites unitarias/integración de vitest (77 tests en total) pasan con 100% de éxito.
* **Integración del Editor JSON**: Aunque se restauró el editor manual de JSON para no bloquear a otros eventos inactivos, es de suma importancia migrar este editor a una interfaz visual antes de habilitar la Fase Bodas o XV Años.
